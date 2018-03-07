'use strict';

import MenuTypes from './types';
/** Creates a slider item for the menu.
	* @constructor
	* @param {number} id - the ID of the menu item.
	* @param {string} name - the displayed name of the slider.
	* @param {number} min - the minimum value of the slider
	* @param {number} max - the maximum value of the slider
	* @param {number} step - the increment step of the slider
	* @param {number} defaultValue - the default value of the slider.
	* @return {object} An object to be plugged into the menu.
	*/
class SliderItem {
	constructor(id, name, min = 0, max = 100, step = 5, defaultValue = 50) {
		this.id = id;
		this.name = name;
		this.minValue = min;
		this.maxValue = max;
		this.stepValue = step;
		this.defaultValue = defaultValue;
		this.onChangeCallback = 0;
		this.onFocusCallback = 0;
		this.element = document.createElement('div');
		this.input = document.createElement('input');
		this.input.type = 'range';
		this.input.min = this.minValue;
		this.input.max = this.maxValue;
		this.input.step = this.stepValue;
		this.input.value = this.defaultValue;
		this.input.id = this.id;
		this.label = document.createElement('label');
		this.labelNode = document.createTextNode(this.name);
		this.label.appendChild(this.labelNode);
		this.label.for = this.id;
		this.element.appendChild(this.label);
		this.element.appendChild(this.input);
		this.type = MenuTypes.SLIDER;
	}

	focus() {
		this.input.focus();
	}

	setCallbacks(focusCallback, changeCallback) {
		this.onFocusCallback = focusCallback;
		this.onChangeCallback = changeCallback;
		this.input.addEventListener('focus', this.focusItem.bind(this));
		this.input.addEventListener('change', this.changeItem.bind(this));
	}

	focusItem(event) {
		console.log('Changed event ' + event);
		if (this.onFocusCallback !== 0) {
			this.onFocusCallback(this.id);
		}
	}

	changeItem(event) {
		console.log('Changed event ' + event);
		if (this.onChangeCallback !== 0) {
			this.onChangeCallback(this.id);
		}
	}
}

export default SliderItem;
