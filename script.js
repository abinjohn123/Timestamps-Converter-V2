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
