class TextTyper {
  constructor(el, minTypingTime=30, randomTypingTime=175) {
    this.container = el;
    this.cursorBlinkerTimeoutId;
    this.pauseCharacters = '.?!';

    this.minTypingTime = minTypingTime;
    this.randomTypingTime = randomTypingTime;

    this.cancelTyping = false;
    this.currPromiseChain = Promise.resolve();
  }

  type(text) {
    // chaining typing text promises
    this.currPromiseChain = text.split('').reduce( (promiseChain, char) => {
      return promiseChain.then( () => this.typeLetter(char));
    }, this.currPromiseChain );

    return this;
  }

  typeLetter(char) {
    if (this.cancelTyping) return;

    this.container.classList.add('typing');
    this.container.innerText += char;
    clearTimeout( this.cursorBlinkerTimeoutId );
    this.cursorBlinkerTimeoutId = setTimeout( () => {
      this.container.classList.remove('typing');
    }, 200);

    return new Promise( resolve => {
      // simulates real person's typing
      let randomTimeout = Math.floor( Math.random() * this.randomTypingTime) + this.minTypingTime; 
      if (this.pauseCharacters.includes(char)) randomTimeout += 1000;
      setTimeout( resolve, randomTimeout);
    })
  }

  chain( callback ) {
    this.currPromiseChain = this.currPromiseChain.then( callback );
    return this;
  }
  pause( time ) {
    this.chain( () => new Promise( resolve => setTimeout(resolve, time)));
    return this;
  }
  clear() {
    this.chain( () => this.container.innerText = '');
    return this;
  }
  stop() {
    this.cancelTyping = true;
    this.chain( () => this.cancelTyping = false );
    return this;
  }
  clearNow() {
    this.container.innerText = '';
    this.stop();
    return this;
  }

}

let typer = new TextTyper( document.getElementById('type-me') );

document.querySelector('.buttons').addEventListener('click', (e) => {
  let btnId = e.target.id;
  switch (btnId) {
    case 'stop':
      typer.stop();
      break;
    case 'again':
      typer
        .clearNow()
        .type("You liked that animation, didn\'t you? Don't forget to press the like button! NOW!", 1000);
      break;
    case 'clear':
      typer.clearNow();
      break;
  }
});

const init = () => {
  typer
    .clearNow()
    .pause(1200)
    // typing is devided into a few function calls just to demonstrate flexibility
    .type("I am ven")
    .type("geance!")
    .type(" I am the night! I am ")
    .pause(800)
    .type("Batman!")
    .pause(2000)
    .clear();
}
init();
