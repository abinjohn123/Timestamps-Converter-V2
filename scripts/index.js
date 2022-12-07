import { timeToSeconds, secondsToTime } from './conversions.js';

// State variables
let adjustmentType = -1;
let masterData = [];

function setMasterData(text) {
  if (text.trim() === '') {
    masterData = [];
    return;
  }

  masterData = text
    .replaceAll('\r', '')
    .split('\n')
    .map((line) => {
      // const timestamp = (line.match(/\d{0,2}:{0,1}\d{1,2}:\d{1,2}/) || [
      //   null,
      // ])[0];
      const timestamp = (line.match(/(?:\d{0,2}:\d{2}|\d{1,2}):\d{1,2}/) || [
        null,
      ])[0];

      const index = line.indexOf(timestamp);
      const string = line.replace(timestamp, '');
      return { index, timestamp, string };
    });

  console.log(masterData);
}

// ##################################
// auto focus input fields
// for time input
// ##################################
const timeInputsContainer = document.querySelector('.adjustment-inputs');

function timeInputHandler(e) {
  // check if input is valid
  const inputValue = e.target.value;
  if (!inputValue) {
    e.target.value = '';
    return;
  }

  // shift focus to next input element
  const currentInputEl = Number.parseInt(e.target.dataset.time);
  const nextInputEl = document.querySelector(
    `[data-time="${currentInputEl + 1}"]`
  );
  if (!nextInputEl) {
    e.target.blur();
    return;
  }
  nextInputEl.select();
}

// select input value when focused
function timeFocusHandler(e) {
  e.target.select();
}

timeInputsContainer.addEventListener('input', timeInputHandler);
timeInputsContainer.addEventListener('focusin', timeFocusHandler);

// ##################################
// clear button to clear all inputs
// ##################################
const btnClear = document.querySelector('.btn-clear');

function clearInputs() {
  const inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach((input) => (input.value = ''));
}

btnClear.addEventListener('click', clearInputs);

// ##################################
// select adjustment type
// ##################################
const adjustmentBtns = document.querySelector('.adjustment-controls');

function setAdjustmentType(e) {
  const targetBtn = e.target.closest('.btn-control');
  adjustmentType = Number.parseInt(targetBtn.value);

  adjustmentBtns
    .querySelectorAll('.btn-control')
    .forEach((btn) => btn.classList.toggle('--selected', btn === targetBtn));
}
adjustmentBtns.addEventListener('click', setAdjustmentType);
// select one button at the start
document
  .querySelector(`.btn-control[value="${adjustmentType}"]`)
  .classList.add('--selected');

// ########################################
// shift button click
// ########################################
const shiftBtn = document.querySelector('.btn-shift');
const inputTextEl = document.querySelector('.textbox.--input');

function handleShift() {
  setMasterData(inputTextEl.value);
  const timeInputEls = [
    ...timeInputsContainer.querySelectorAll('input[type="number"]'),
  ].map((el) => Number.parseInt(el.value) || 0);

  const totalSeconds = timeToSeconds(timeInputEls);
  if (!totalSeconds) console.log('invalid time');
  if (totalSeconds === 0) return;
}

shiftBtn.addEventListener('click', handleShift);

// ########################################
// render output
// ########################################
const outputTextEl = document.querySelector('.textbox.--output');

function renderOutput() {
  masterData.forEach((entry, i) => {
    const line = document.createElement('p');
    line.id = `line-${i}`;

    const textBefore = entry.string.slice(0, entry.index);
    const timestamp = entry.timestamp
      ? `<span class="timestamp">${entry.timestamp}</span>`
      : '';
    const textAfter = entry.string.slice(entry.index);
    line.innerHTML = `${textBefore}${timestamp}${textAfter}`;

    outputTextEl.append(line);
  });
}
