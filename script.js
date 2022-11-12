// State variables
let adjustmentType = -1;

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
