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
const adjustmentBox = document.querySelector('.adjustment-box');

function makeAdjustments(adjustment) {
  masterData.forEach((entry) => {
    const timestampInSeconds = timeToSeconds(entry.timestamp);

    if (adjustmentType === -1 && adjustment > timestampInSeconds)
      entry.timestamp = 'XX:XX';
    else {
      const newTimestamp = secondsToTime(
        timestampInSeconds + adjustment * adjustmentType
      );
      entry.timestamp = newTimestamp;
    }
  });
}

function getShiftTime() {
  const timeInputDigits = [
    ...timeInputsContainer.querySelectorAll('input[type="number"]'),
  ];
  let timeInputString = '';

  timeInputString = timeInputDigits.reduce((string, el, i, arr) => {
    const digitAtPos = Number.parseInt(el.value) || 0;
    string += digitAtPos;
    if (i % 2 === 1 && i !== arr.length - 1) string += ':';
    return string;
  }, '');

  return timeInputString;
}

function handleShift() {
  setMasterData(inputTextEl.value);
  const shiftTime = getShiftTime();

  const totalSeconds = timeToSeconds(shiftTime);
  if (totalSeconds === 0) return;
  if (!totalSeconds) {
    clearOutput();
    adjustmentBox.classList.add('--error');
    return;
  }
  adjustmentBox.classList.remove('--error');

  makeAdjustments(totalSeconds);
  renderOutput();
}

shiftBtn.addEventListener('click', handleShift);

// ########################################
// render output
// ########################################
const outputTextEl = document.querySelector('.textbox.--output');

function clearOutput() {
  outputTextEl.innerHTML = '';
}

function renderOutput() {
  clearOutput();

  let allFormats = [...document.querySelectorAll('.format-btn.clicked')];
  allFormats = allFormats.map((formatEl) => formatEl.dataset.format);

  for (let i = 0; i < masterData.length; ++i) {
    const entry = masterData[i];
    const line = document.createElement('p');
    line.id = `line-${i}`;

    if (entry.index === -1) line.innerHTML = `&nbsp;`;
    else {
      const textBefore = entry.string.slice(0, entry.index);
      const timestamp = entry.timestamp
        ? `<span class="timestamp ${allFormats.join(' ')}">${
            entry.timestamp
          }</span>`
        : '';
      const textAfter = entry.string.slice(entry.index);
      line.innerHTML = `${textBefore}${timestamp}${textAfter}`;
    }
    outputTextEl.append(line);
  }
  window.scrollTo({
    top: 580,
    behavior: 'smooth',
  });
}

// ########################################
// format timestamps
// ########################################
const formatContainer = document.querySelector('.format-box');

function formatTimestamps(e) {
  if (e.target.classList.contains('format-box')) return;
  const formatType = e.target.closest('.format-btn');
  formatType.classList.toggle('clicked');
  renderOutput();
}

formatContainer.addEventListener('click', formatTimestamps);

// ########################################
// init
// ########################################

const sampleInput = `(00:00) This is a sample text content
(02:06) A timestamp can be placed anywhere in a line
(07:55) However, multiple timestamps per line are not detected
(12:14) Time can be both added and subtracted from the input timestamps
(14:45) Go ahead and start converting!
`;

document.querySelector('.textbox.--input').value = sampleInput;
