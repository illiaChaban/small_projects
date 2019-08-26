

const svg = document.querySelector('svg');

let prevSpeed = 0;
// set up stroke drawing
svg.querySelectorAll('path').forEach( (path,i) => {
  let color = path.getAttribute('fill');
  path.style.setProperty('--color', color);
  let length = path.getTotalLength();
  length = Math.floor(length);
  path.style.setProperty('--length', length);
  // stroke length of 20000 will animate 8 seconds
  const speed = Math.round( length / 20000 * 8 );
  path.style.setProperty('--speed', speed + 's');
  path.style.setProperty('--delay', prevSpeed + 's');
  prevSpeed = speed;
});

// start stroke drawing
svg.classList.add('animate');
// stop stroke drawing & fill color
setTimeout( () => svg.classList.add('fill'), 3500);

