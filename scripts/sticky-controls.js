const pageHeader = document.querySelector('header');
const appControls = document.querySelector('.app-controls');
const spaceMaker = document.querySelector('.space-maker');

function obsCallback(entries) {
  if (!entries[0].isIntersecting) {
    appControls.classList.add('--fixed');
    spaceMaker.classList.remove('--hidden');
  } else {
    spaceMaker.classList.add('--hidden');
    appControls.classList.remove('--fixed');
  }
}

const obsOptions = {
  root: null,
  threshold: 0,
};

const scrollObserver = new IntersectionObserver(obsCallback, obsOptions);
scrollObserver.observe(pageHeader);
