class TextTyper {
  constructor(el, minTypingTime=30, randomTypingTime=175) {
    this.container = el;
    this.cursorBlinkerTimeoutId;
    this.waitCharacters = '.?!';

    this.minTypingTime = minTypingTime;
    this.randomTypingTime = randomTypingTime;

    this.stopAnimation = false;
    this.currPromiseChain = Promise.resolve();
  }

  type(text) {
    for( let char of text ) { 
      this.typeLetter(char);
      if (this.waitCharacters.includes(char)) this.wait(1000);
    }
    return this;
  }

  typeLetter(char) {
    this.chain( () => new Promise( resolve => {
      if (this.stopAnimation) return resolve();

      setTimeout( () => {
        this.container.innerText += char;
        this.stopCursorBlinking();
        resolve();
      }, this.getRandomTimeout());
    }));
    return this;
  }

  getRandomTimeout() {
    // simulates real person's typing
    return Math.random() * this.randomTypingTime + this.minTypingTime; 
  }

  stopCursorBlinking() {
    this.container.classList.add('typing');
    clearTimeout( this.cursorBlinkerTimeoutId );
    this.cursorBlinkerTimeoutId = setTimeout( () => {
      this.container.classList.remove('typing');
    }, 200);
  }

  remove(num) {
    for( let i = 0; i < num; i++ ) {
      this.removeLetter();
    }
    return this;
  }

  removeLetter() {
    this.chain( () => new Promise( resolve => {
      if (this.stopAnimation) return resolve();

      setTimeout( () => {
        let currText = this.container.innerText;
        this.container.innerText = currText.slice( 0, currText.length - 1);
        this.stopCursorBlinking();
        resolve();
      }, this.getRandomTimeout() / 2.5);
      // removing characters is usually much faster than typing

    }))
    return this;
  }

  chain( callback ) {
    this.currPromiseChain = this.currPromiseChain.then( callback );
    return this;
  }
  wait( time ) {
    this.chain( () => new Promise( resolve => {
      if (this.stopAnimation) return resolve();
      setTimeout(resolve, time)
    }));
    return this;
  }
  clear() {
    this.chain( () => this.container.innerText = '');
    return this;
  }
  stop() {
    this.stopAnimation = true;
    this.chain( () => this.stopAnimation = false );
    return this;
  }
  clearNow() {
    this.stop().clear();
    return this;
  }

}

let typer = new TextTyper( document.getElementById('type-me') );

document.querySelector('.menu').addEventListener('click', (e) => {
  let btnId = e.target.id;
  switch (btnId) {
    case 'stop':
      typer.stop();
      break;
    case 'type':
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
  // typing is devided into a few function calls just to demonstrate flexibility
  typer
    .clearNow()
    .wait(1200)
    .type("I am ven")
    .type("geance!")
    .type(" I am the night! I am ")
    .wait(300)
    .type('Superman')
    .wait(600)
    .remove('Superman'.length)
    .wait(900)
    .type('Captain Ame')
    .wait(200)
    .remove('Captain Ame'.length)
    .wait(1000)
    .type("Batman!")
    .wait(4000)
    .clear();
}
init();
