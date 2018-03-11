'use strict';
import MenuTypes from './types';

/** Creates a simple menu item to be clicked.
	* @constructor
	* @param {number} id - the ID of the item.
	* @param {string} name - the displayed name of the item.
	* @return {object} A menu item to be plugged into the menu.
*/
class MenuItem {
	constructor(id, name) {
		this.id = id;
		this.name = name;
		this.type = MenuTypes.NORMAL;
		this.element = document.createElement('input');
		this.element.type = 'button';
		this.element.value = this.name;
		this.element.id = this.id;
		this.element.addEventListener('focus', this.getFocus);
		this.onFocusCallback = 0;
		this.onClickCallback = 0;
	}

	focus() {
		this.element.focus();
	}

	setCallbacks(focusCallback, clickCallback) {
		this.onFocusCallback = focusCallback;
		this.onClickCallback = clickCallback;

		this.element.addEventListener('focus', this.getFocus.bind(this));
		this.element.addEventListener('click', this.getClick.bind(this));
	}

	getClick(event) {
		if (this.onClickCallback !== 0) {
			this.onClickCallback(this.id);
		}
	}

	getFocus(event) {
		console.log(this.onFocusCallback);
		if (this.onFocusCallback) {
			this.onFocusCallback(this.id);
		}
	}
}

export default MenuItem;
