document.querySelector('button').addEventListener('mousemove', e => {
  let btn = e.target;
  btn.setAttribute('style', `--mouse-pos-x: ${e.offsetX}px; --mouse-pos-y: ${e.offsetY}px;`)
});