'use strict';
import $ from 'jquery';
import so from 'agk-soundobject';
import MenuTypes from './items/types';

import KeyEvent from 'agk-input/keycodes';

/** Builds simple HTML menus.
	* @constructor
	* @param {object} element - The DOMNode to render on
	* @param {string} name - The menu title
	* @param {array} menuData - the menu items to display
*/
class Menu {
	constructor(element, name, menuData, soundData = null) {
		this.menuData = menuData;
		this.soundData = soundData;
		this.cursor = 0;
		this.oldSlideValue = 0;
		this.name = name;
		if (this.soundData) {
			this.sndKeyChar = this.soundData.keyChar;
			this.sndKeyDelete = this.soundData.keyDelete;
			this.sndSliderLeft = this.soundData.sliderLeft;
			this.sndSliderRight = this.soundData.sliderRight;
			this.sndBoundary = this.soundData.boundary;
			this.sndChoose = this.soundData.choose;
			this.sndMove = this.soundData.move;
			this.sndOpen = this.soundData.open;
			this.sndSelector = this.soundData.selector;
			this.sndWrap = this.soundData.wrap;
		}
		this.selectCallback = null;
		this.interactionElement = element;
	}

	/** Internal callback when an item is clicked. */
	clickItem(event) {
		console.log('Clicked item ' + JSON.stringify(event));
		this.cursor = this.findCursorByID(event);
		console.log('Cursor is at ' + this.cursor);
		console.log('Selecting');
		this.select();
	}

	/** Internal callback  when a slider is moved. */
	slideItem(event) {
		console.log('Slide event ' + event);
		if (this.menuData[this.cursor].input.value < this.oldSlideValue) {
			this.decrease();
		} else {
			this.increase();
		}
		this.oldSlideValue = this.menuData[this.cursor].input.value;
	}

	/** Internal callback when an Item is focused. */
	focusItem(event) {
		console.log('Focused: ' + JSON.stringify(event));
		if (this.sndMove) this.sndMove.play();
		this.cursor = this.findCursorByID(event);
	}

	/** INternal callback when an item is changed. */
	changeItem(event) {
		this.cursor = this.findCursorByID(event);
		this.increase();
	}

	/** Internal function that finds the cursor position of the menu item by it's id. */
	findCursorByID(id) {
		for (let i = 0; i < this.menuData.length; i++) {
			if (this.menuData[i].id === id) {
				return i;
			}
		}
		return -1;
	}

	/**  Focuses the next item from the cursor. */
	nextItem() {
		if (this.cursor < this.menuData.length - 1) {
			this.cursor++;
		}

		this.menuData[this.cursor].focus();
	}

	/** Focuses the previous item from the cursor. */
	previousItem() {
		if (this.cursor > 0) {
			this.cursor--;
		}

		this.menuData[this.cursor].focus();
	}

	increase() {
		if (this.menuData[this.cursor].type === MenuTypes.SLIDER) {
				if (this.sndSliderRight) this.sndSliderRight.play();
		} else {
				if (this.sndSelector) this.sndSelector.play();
		}
	}

	decrease() {
		if (this.menuData[this.cursor].type === MenuTypes.SLIDER) {
				if (this.sndSliderLeft) this.sndSliderLeft.play();
		} else {
				if (this.sndSelector) this.sndSelector.play();
		}
	}

	/** Internal callback when character is inserted. */
	insertCharacter(char) {
			if (this.sndKeyChar) this.sndKeyChar.play();
			console.log('Inserted ' + char);
	}

	/** Internal callback when character is removed. */
	removeCharacter() {
			if (this.sndKeyDelete) this.sndKeyDelete.play();
	}

	/** Internal callback to handle events. */
	handleInput(event) {
			this.insertCharacter(event.which);
	}

	/** Internal function that destroys menu sounds. */
	destroySounds() {
		if (this.sndKeyChar) this.sndKeyChar.destroy();
		if (this.sndKeyDelete) this.sndKeyDelete.destroy();
		if (this.sndSliderLeft) this.sndSliderLeft.destroy();
		if (this.sndSliderRight) this.sndSliderRight.destroy();
		if (this.sndBoundary) this.sndBoundary.destroy();
		if (this.sndChoose) this.sndChoose.destroy();
		if (this.sndMove) this.sndMove.destroy();
		if (this.sndOpen) this.sndOpen.destroy();
		if (this.sndSelector) this.sndSelector.destroy();
		if (this.sndWrap) this.sndWrap.destroy();
	}

	/** Destroys and frees the menu from memory. */
	destroy() {
		this.interactionElement.innerHTML = '';
		setTimeout(() => {
 this.destroySounds();
		}, 1000);
	}

	/** Internal function to handle key events. */
	handleKeys(event) {
		switch (event.which) {
			case KeyEvent.DOM_VK_DOWN:
				event.preventDefault();
					this.nextItem();
				break;
			case KeyEvent.DOM_VK_UP:
				event.preventDefault();
					this.previousItem();
				break;
			default:
				break;
		}
	}

	/** Runs the menu and displays it.
		* @param {function} callback - the callback to be executed when the user selects an item, espects one event parameter.
		*/
	run(callback) {
		this.selectCallback = callback;
		const that = this;

		$(document).on('keydown', event => {
 that.handleKeys(event);
		});


		if (this.sndOpen) this.sndOpen.play();
		const heading = document.createElement('h1');
		const node = document.createTextNode(this.name);
		heading.appendChild(node);
		this.interactionElement.appendChild(heading);
		console.log('Menu length: ' + this.menuData.length);
		for (let i = 0; i < this.menuData.length; i++) {
			if (this.menuData[i].type === MenuTypes.NORMAL) {
			this.menuData[i].setCallbacks(event => {
 this.focusItem(event);
			}, event => {
 this.clickItem(event);
			});
			}
			if (this.menuData[i].type === MenuTypes.SELECTOR) {
			this.menuData[i].setCallbacks(event => {
 this.focusItem(event);
			}, event => {
 this.changeItem(event);
			});
			}

			if (this.menuData[i].type === MenuTypes.EDIT) {
			this.menuData[i].setCallbacks(event => {
 this.focusItem(event);
			}, event => {
 this.insertCharacter(event);
			});
			}

			if (this.menuData[i].type === MenuTypes.SLIDER) {
					this.menuData[i].setCallbacks(event => {
 this.focusItem(event);
					}, event => {
 this.slideItem(event);
					});
			}

			this.interactionElement.appendChild(this.menuData[i].element);
		}
	}

	/** Internal function when an item has been selected. */
	select() {
		console.log('Selected. Yay');
		const selected = this.menuData[this.cursor].id;

		const items = [];
		for (let i = 0; i < this.menuData.length; i++) {
			let addItem = null;
			console.log('Item type ' + this.menuData[i].type);
			if (this.menuData[i].type === MenuTypes.SLIDER) {
				console.log('Evaluating Slider');
				addItem = {
					id: this.menuData[i].id,
					value: this.menuData[i].input.value

				};
			}
			if (this.menuData[i].type === MenuTypes.EDIT) {
				console.log('Evaluating edit item');
				addItem = {
					id: this.menuData[i].id,
					value: this.menuData[i].input.value

				};
			}
			if (this.menuData[i].type === MenuTypes.SELECTOR) {
				console.log('Evaluating selector');
				let selectedID = 0;
				const items = document.getElementsByName(this.menuData[i].id);
				for (let j = 0; j < items.length; j++) {
					if (items[j].checked) {
						selectedID = j;
					}
				}

				addItem = {
					id: this.menuData[i].id,
					value: selectedID,

					name: this.menuData[i].options[selectedID]
				};
			}
			items.push(addItem);
		}

		const toReturn = {
			selected,
			cursor: this.cursor,
			items
		};
		if (this.sndChoose) this.sndChoose.play();

		this.selectCallback(toReturn);
	}
}
export default Menu;
