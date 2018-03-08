# AGK-UI

## A quick way to render menus for audio games

Audio games' main focus is audio. However, I still wanted a very quick and easy way to create menus using HTML from JavaScript, without touching the DOM directly. So I wrote a library to do it for me.

The same library contains some JavaScript to split a text by a sign of your choosing (Default is \n) and let you advance through the text with a button. 

The reason this library came into existence was mobile phones. I was writing audio games for the browser, which is why the whole AGK suite started existing. On mobile, it was tedious to create menus using only audio and WebTTS wasn't reliable.

## Installation

Using NPM:
npm install agk-ui

## Modules

All the components are submoduled. Here's a list.
* agk-ui/menu: The main menu runner. This is what you use to plug your menu items into and display the menu to the user.
* agk-ui/menu/items/types: A definition of all the different menu types:
** NORMAL - A simple clickable menu item
** EDIT: An edit box menu item
** SELECTOR: A menu selector item 
** SLIDER: A slider menu item
* agk-ui/menu/items/edititem: The edit box menu item.
* agk-ui/menu/items/menuitem: A normal menu item
* agk-ui/menu/items/scrolleritem: A scroller item
* agk-ui/menu/items/slideritem: A slider item
* agk-ui/text/scrollingtext: The scrolling text

## Usage

### HTML

<html>
<head>
<title>SimpleMenu</title>
<style type="text/css">

	   .interactiveArea {
	position: absolute;
	top:20%;/* Header Height */
	left:0%;
	   bottom:10%;/* Footer Height */
	   width:80%;height:80%;}
	   

</style>

</head>

<body role="application">
<div id="interaction" class="interactiveArea" aria-live="polite"></div>
< script src="script.js"></script>
</body>
</html>

### JavaScript

import SoundObject from "agk-soundobject";
import ScrollingText from "agk-ui/text/scrollingtext"
import EditItem from "agk-ui/menu/items/edititem";
import MenuItem from "agk-ui/menu/items/menuitem";
import SelectorItem from "agk-ui/menu/items/selectoritem";
import SliderItem from "agk-ui/menu/items/slideritem";
import Menu from "agk-ui/menu";

SoundObject.directory = "./sounds/";
SoundObject.extension = ".wav";

let menuSounds = {};
menuSounds.keyChar = SoundObject.create("ui/keyChar");
menuSounds.keyDelete = SoundObject.create("ui/keyDelete");
menuSounds.keyEnter = SoundObject.create("ui/keyEnter");
menuSounds.boundary = SoundObject.create("ui/menuBoundary");
menuSounds.choose = SoundObject.create("ui/menuChoose");
menuSounds.move = SoundObject.create("ui/menuMove");
menuSounds.open = SoundObject.create("ui/menuOpen");
menuSounds.selector = SoundObject.create("ui/menuSelector");
menuSounds.sliderLeft = SoundObject.create("ui/menuSliderLeft");
menuSounds.sliderRight = SoundObject.create("ui/menuSliderRight");
menuSounds.wrap = SoundObject.create("menuWrap");
let textSounds = {};
textSounds.continue = SoundObject.create("ui/textContinue");
textSounds.close = SoundObject.create("ui/textClose");
textSounds.open = SoundObject.create("ui/textOpen");

const item1 = new MenuItem(1, "Meow");
const item2 = new SelectorItem(2, "Male or Female", ["Male","Female"]);
const item3 = new EditItem(3, "Enter your name");
const item4 = new SliderItem(4, "Slide meow", 0, 100, 5);

const menu = new Menu(document.getElementById("interaction"), "Select something", [item1, item2, item3, item4], menuSounds);
menu.run(e => {
	menu.destroy();
	new ScrollingText(document.getElementById("interaction"), "Menu is done, selected item was " + e.selected + ", \n with all the stuff set to " + JSON.stringify(e.items), "\n", textSounds, () => console.log("All done!"));
});

## Contributing

Help me make this better. I'm sure you can! <3

## License

This code is MIT licensed.