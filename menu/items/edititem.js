'use strict';

import MenuTypes from './types';
/** Creates an edit box item for the menu.
	* @constructor
	* @param {number} id - the ID of the menu item.
	* @param {string} name - The displayed name of the item.
	* @param {string} defaultContents - the default contents of the edit box.
	* @return {object} the item to be plugged into the menu.
	*/
class EditItem {
	constructor(id, name, defaultContents = '') {
		this.id = id;
		this.name = name;
		this.onChangeCallback = 0;
		this.onFocusCallback = 0;
		this.defaultContents = defaultContents;
		this.element = document.createElement('div');
		this.input = document.createElement('input');
		this.input.id = this.id;
		this.input.value = this.defaultContents;
		this.label = document.createElement('label');
		this.labelNode = document.createTextNode(this.name);
		this.label.appendChild(this.labelNode);
		this.label.for = this.id;
		this.element.appendChild(this.label);
		this.element.appendChild(this.input);
		this.type = MenuTypes.EDIT;
	}

	focus() {
		this.input.focus();
	}

	setCallbacks(focusCallback, changeCallback) {
		this.onFocusCallback = focusCallback;
		this.onChangeCallback = changeCallback;
		this.input.addEventListener('focus', this.focusItem.bind(this));
		this.input.addEventListener('keydown', this.changeItem.bind(this));
	}

	focusItem(event) {
		console.log('Focus event: ' + event);
		if (this.onFocusCallback !== 0) {
			this.onFocusCallback(this.id);
		}
	}

	changeItem(event) {
		console.log('Changing event ' + event);
		if (this.onChangeCallback !== 0) {
			this.onChangeCallback(this.id);
		}
	}
}

export default EditItem;
