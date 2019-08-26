const svg = document.querySelector('svg');
let fillTimeoutId;
let animateTimeoutId;

function prepare() {
  // set up stroke drawing
  svg.querySelectorAll('path').forEach( (path,i) => {
    let color = path.getAttribute('fill');
    path.style.setProperty('--color', color);
    let length = path.getTotalLength();
    length = Math.floor(length);
    path.style.setProperty('--length', length);
  });
}

function cancelDraw() {
  svg.classList.remove('animate');
  svg.classList.remove('fill');
  clearTimeout( fillTimeoutId );
  clearTimeout( animateTimeoutId );
}

function draw() {
  cancelDraw();

  animateTimoutId = setTimeout( () => {
    // start stroke drawing
    svg.classList.add('animate');
    // stop stroke drawing & fill color
    fillTimeoutId = setTimeout( () => svg.classList.add('fill'), 3500);

  }, 100)
}

prepare();
draw();

document.getElementById('again').addEventListener('click', draw);