'use strict';
import $ from 'jquery';
import KeyEvent from 'agk-input/keycodes';
import so from 'agk-soundobject';
import TTS from 'agk-tts';
/** Creates a text view with text that can be scrolled, split by a set delimiter.
	* @param {object} element - the DOM Node to render on
	* @param {string} text - the text to be displayed.
	* @param {string} delimiter - the character to split the text at. Default is \n
	* @param {function} callback - A function to call when the text has been advanced to it's end.
*/
class ScrollingText {
	constructor(element, text, delimiter = '\n', callback = 0) {
		this.id = element;
		this.id.hidden = false;
		this.container = document.createElement('div');
		this.textDiv = document.createElement('div');
		this.textDiv.innerHTML = 'Meow';
		this.container.appendChild(this.textDiv);
		this.continueButton = document.createElement('input');
		this.continueButton.type = 'button';
		this.continueButton.value = 'Scroll';
		const that = this;
		this.continueButton.addEventListener('click', () => this.advance());
		this.container.appendChild(this.continueButton);
		this.id.appendChild(this.container);
		this.text = text;
		this.delimiter = delimiter;
		this.splitText = this.text.split(delimiter);
		this.currentLine = 0;
		this.sndOpen = so.create('ui/textOpen');
		this.sndContinue = so.create('ui/textScroll');
		this.sndClose = so.create('ui/textClose');
		this.callback = callback;
		const id = document.getElementById('touchArea');
		// This.hammer = new Hammer(id);
		this.init();
	}

	init() {
		const that = this;
		runningText = this;

		this.sndOpen.play();
		this.currentLine = 0;
		this.readCurrentLine();
	}

	handleKeys(event) {
		switch (event.which) {
			case KeyEvent.DOM_VK_UP:
			case KeyEvent.DOM_VK_DOWN:
			case KeyEvent.DOM_VK_LEFT:
			case KeyEvent.DOM_VK_RIGHT:
				runningText.readCurrentLine();
				break;
			case KeyEvent.DOM_VK_RETURN:
				runningText.advance();
				break;
		}
	}

	handleTap(action) {
		if (action === 0) {
			this.readCurrentLine();
		}

		if (action === 1) {
			this.advance();
		}
	}

	readCurrentLine() {
		this.textDiv.innerHTML = this.splitText[this.currentLine];
	}

	advance() {
		if (this.currentLine < this.splitText.length - 1) {
			this.currentLine++;
			this.sndContinue.play();
			this.readCurrentLine();
		} else {
			this.sndClose.play();

			this.id.hidden = true;

			//			This.hammer.destroy();
			if (this.callback !== 0) {
this.callback();
			}
			this.container.innerHTML = '';
		}
	}
}
export default ScrollingText;
