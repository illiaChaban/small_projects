class TextTyper {
  constructor(elOrSelector, minTypingTime=30, randomTypingTime=175) {
    this.container = typeof elOrSelector === 'string' ?
      document.querySelector( elOrSelector ) :
      elOrSelector;

    this.waitCharacters = '.?!';

    this.minTypingTime = minTypingTime;
    this.randomTypingTime = randomTypingTime;

    this.actions = new PromiseChain();
    this.typingEvent = new Event('typing');
  }

  chain( callback ) {
    this.actions.next( callback );
    return this;
  }

  type(text) {
    for( let char of text ) { 
      this.typeLetter(char)
          .wait( this.getRandomTime() );
      if (this.waitCharacters.includes(char)) this.wait(1000);
    }
    return this;
  }

  typeLetter(char) {
    this.chain( () => {
      this.container.innerText += char;
      this.container.dispatchEvent( this.typingEvent );
    });
    return this;
  }

  getRandomTime() {
    // simulates real person's typing
    return Math.random() * this.randomTypingTime + this.minTypingTime; 
  }

  remove(num) {
    for( let i = 0; i < num; i++ ) {
      this
        .removeLetter()
        // removing letters usually much faster
        .wait( this.getRandomTime() / 2.5 );
    }
    return this;
  }

  removeLetter() {
    this.chain( () => {
      let currText = this.container.innerText;
      this.container.innerText = currText.slice( 0, currText.length - 1);
      this.container.dispatchEvent( this.typingEvent );
    })
    return this;
  }

  wait( time ) {
    this.chain( () => new Promise( resolve => {
      setTimeout(resolve, time)
    }));
    return this;
  }
  clear() {
    this.chain( () => this.container.innerText = '');
    return this;
  }
  stop() {
    this.actions.cancel();
    return this;
  }
  clearNow() {
    this.stop().clear();
    return this;
  }

}

class PromiseChain {
  constructor() {
    this.chain = Promise.resolve();
    this.cancelChain = false;
  }

  next( callback, cancelable = true ) {
    this.chain = this.chain.then( (...args) => {
      if ( cancelable && this.cancelChain) return;
      return callback(...args);
    });
    return this;
  }

  cancel() {
    this.cancelChain = true;
    this.next( () => { this.cancelChain = false }, false );
    return this;
  }
}


const bindTyperAnimation = () => {
  let cursorBlinkerTimeoutId;
  let container = document.getElementById('type-me');
  container.addEventListener('typing', () => {
    container.classList.add('typing');
    clearTimeout( cursorBlinkerTimeoutId );
    cursorBlinkerTimeoutId = setTimeout( () => {
      container.classList.remove('typing');
    }, 200);
  })
};

const bindTyperMenu = (typer) => {
  const menu = document.querySelector('.menu');
  const input = menu.querySelector('input'); 
  menu.addEventListener('click', (e) => {
    let btnId = e.target.id;
    switch (btnId) {
      case 'stop':
        typer.stop();
        break;
      case 'type':
        let text = input.value;
        typer
          .clearNow()
          .type(text);
        break;
      case 'clear':
        typer.clearNow();
        break;
    }
  });
};


const init = () => {
  const typer = new TextTyper('#type-me');
  bindTyperAnimation();
  bindTyperMenu( typer );

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
