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
	constructor(element, name, menuData) {
		this.menuData = menuData;
		this.cursor = 0;
		this.oldSlideValue = 0;
		this.name = name;
		this.sndKeyChar = so.create('ui/keyChar');
		this.sndKeyDelete = so.create('ui/keyDelete');
		this.sndSliderLeft = so.create('ui/menuSliderLeft');
		this.sndSliderRight = so.create('ui/menuSliderRight');
		this.sndBoundary = so.create('ui/menuBoundary');
		this.sndChoose = so.create('ui/menuChoose');
		this.sndMove = so.create('ui/menuMove');
		this.sndOpen = so.create('ui/menuOpen');
		this.sndSelector = so.create('ui/menuSelector');
		this.sndWrap = so.create('ui/menuWrap');
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
		this.sndMove.play();
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
				this.sndSliderRight.play();
		} else {
				this.sndSelector.play();
		}
	}

	decrease() {
		if (this.menuData[this.cursor].type === MenuTypes.SLIDER) {
				this.sndSliderLeft.play();
		} else {
				this.sndSelector.play();
		}
	}

	/** Internal callback when character is inserted. */
	insertCharacter(char) {
			this.sndKeyChar.play();
			console.log('Inserted ' + char);
	}

	/** Internal callback when character is removed. */
	removeCharacter() {
			this.sndKeyDelete.play();
	}

	/** Internal callback to handle events. */
	handleInput(event) {
			this.insertCharacter(event.which);
	}

	/** Internal function that destroys menu sounds. */
	destroySounds() {
		this.sndKeyChar.destroy();
		this.sndKeyDelete.destroy();
		this.sndSliderLeft.destroy();
		this.sndSliderRight.destroy();
		this.sndBoundary.destroy();
		this.sndChoose.destroy();
		this.sndMove.destroy();
		this.sndOpen.destroy();
		this.sndSelector.destroy();
		this.sndWrap.destroy();
	}

	/** Destroys and frees the menu from memory. */
	destroy() {
		this.interactionElement.innerHTML = '';
		const that = this;
		setTimeout(() => {
 that.destroySounds();
		}, 500);
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


		this.sndOpen.play();
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
		this.sndChoose.play();

		this.selectCallback(toReturn);
	}
}
export default Menu;
