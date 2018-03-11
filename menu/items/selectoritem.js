'use strict';

import MenuTypes from './types';
/** Creates a selector item for the menu.
	* @constructor
	* @param {number} id - the ID of the menu item.
	* @param {string} name - the title of the menu item.
	* @param {array} options - an Array of strings as options.
	* @param {number} defaultOption - The default option to be selected.
	* @param {function} changeCallback - a callback to be called whenever the value changes. Expects one event parameter which is the number of the newly selected item.
	* @return {object} An object to be plugged into a menu.
*/
class SelectorItem {
	constructor(id, name, options, defaultOption = 0, changeCallback = 0) {
		this.id = id;
		this.name = name;
		this.options = options;
		this.defaultOption = defaultOption;
		this.elements = [];
		this.element = document.createElement('fieldset');
		this.element.class = 'radiogroup';
		this.legendElement = document.createElement('legend');
		this.nameElement = document.createTextNode(this.name);
		this.legendElement.appendChild(this.nameElement);
		this.element.appendChild(this.legendElement);
		this.listElement = document.createElement('ul');
		this.listElement.class = 'radio';
		this.element.appendChild(this.listElement);
		this.onFocusCallback = 0;
		this.onChangeCallback = 0;
		this.customChangeCallback = changeCallback;
		this.type = MenuTypes.SELECTOR;
		this.build();
	}

	focus() {
		this.elements[0].focus();
	}

	setCallbacks(onFocusCallback, onChangeCallback) {
		this.onFocusCallback = onFocusCallback;
		this.onChangeCallback = onChangeCallback;
	}

	build() {
		for (let i = 0; i < this.options.length; i++) {
			const listItem = document.createElement('li');

			const element = document.createElement('input');
			element.type = 'radio';
			element.id = this.id + '_' + i;
			element.name = this.id;
			element.value = i;

			element.addEventListener('focus', this.focusItem.bind(this));
			if (i === this.defaultOption) {
				element.checked = true;

				console.log('Default option: ' + this.defaultOption + ', current option ' + i);
			}

			const label = document.createElement('label');
			const labelNode = document.createTextNode(this.options[i]);
			label.appendChild(labelNode);
			label.for = this.id + '_' + i;
			label.setAttribute('for', this.id + '_' + i);
			listItem.appendChild(element);
			listItem.appendChild(label);

			this.elements.push(element);
			this.elements.push(label);
		}
		for (let i = 0; i < this.elements.length; i++) {
			this.listElement.appendChild(this.elements[i]);
		}
		this.element.addEventListener('focus', this.focusItem.bind(this));
		this.element.addEventListener('click', this.changeItem.bind(this));
	}

	focusItem(event) {
		console.log('Focused event' + event);
		if (this.onFocusCallback !== 0) {
			this.onFocusCallback(this.id);
		}


	}

	changeItem(event) {
		console.log('Change event: ' + event);
		if (this.onChangeCallback !== 0) {
			this.onChangeCallback(this.id);
		}
		
		for (let i = 0; i < this.elements.length; i++) {
			this.elements[i].setAttribute('aria-checked', 'false');
			if (this.elements[i].checked) {
				console.log("Checked: " + this.elements[i].value);
				this.elements[i].setAttribute('aria-checked', 'true');
				if (this.customChangeCallback !== 0) {
this.customChangeCallback(this.elements[i].value);
				}
			}
		}
	}
}

export default SelectorItem;
