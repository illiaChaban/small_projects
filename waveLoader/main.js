
const buildWaveLoader = (waveElement, colors, circleNum, descendingOpacity) => {
  let spans = '';
  for( let i=0; i<circleNum; i++ ) {
    const diagonalToContainerRatio = 100 / circleNum * (i+1);
    const distanceBetweenCircles = i/15; 
    const colorIdx = i % colors.length;
    const color = colors[colorIdx];

    let spanStyle = `
      width: ${diagonalToContainerRatio}%;
      height: ${diagonalToContainerRatio}%;
      animation-delay: ${distanceBetweenCircles}s;
      border-color: ${color};
    `;
    if (descendingOpacity) {
       const opacity = 1 - i / circleNum;
       spanStyle += `opacity: ${opacity};`
    }
    const span = `<span style='${spanStyle}'></span>`;
    spans += span;
  }
  waveElement.innerHTML = spans;
}

const waveContainer = document.querySelector('.loading-wave');
const colors = [  '#FF6138', '#f2f1c6'/* , '#8e2890' */];
const circleNum = 20; 
const makeDescendingOpacity = false;
buildWaveLoader(waveContainer, colors, circleNum, makeDescendingOpacity);