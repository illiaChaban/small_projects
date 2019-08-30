
function toggleSub() {
  try {
    document.querySelector('.imageButton.subtitlesAndAudioButton').click();
    // console.log(document.querySelectorAll('.tooltip .subtitles .radioButtonGroup .checkbox'));
    document.querySelector('.tooltip .subtitles .radioButtonGroup .checkbox:not(.checked)').click()
  } catch(e) {
    console.error('custom script error', e);
  }
}

function handleToggleSub(e) {
  if (e.key === '/') toggleSub();
}

document.addEventListener('keyup', handleToggleSub);
  