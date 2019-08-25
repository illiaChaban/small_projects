
document.body.insertAdjacentHTML('afterbegin','<div id="cursor"></div>');
const cursor = document.getElementById('cursor');

const actionSelectors = 'a, h1'
document.addEventListener('mousemove', e => {
  cursor.style.left = e.pageX + 'px';
  cursor.style.top = e.pageY + 'px';

  // console.log(e);

  if (e.target.matches(actionSelectors)) {
    cursor.classList.add('hover');
  } else {
    cursor.classList.remove('hover');
  }
})