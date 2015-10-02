var $ = require('jquery');
var controller = require('./controller').CreateController();

$(document).ready(function () {

    controller.initiate();

});

//make equity calculation more efficient

//make it show equity next to each player
//make adding new button easier (using maps). maybe also same for components?
//make objects (not buttons) larger, change positions
//make deck appear next to active object. then you can probably make it slightly larger
//change html from + to ejs
//split css into separate files in a css folder or sth.
//have a separate object which holds the values of the css properties. somehow have css be automatically updated when
// you change values in values object
//make an object whose goal is to position stuff on interface.

//copy the deck to player_equity_calculator's this and draw the cards from there
//fix equity calculation.. there are bugs (see controller, start from there)
//cache combinations when simulating to make it much faster
//make a controller for game folder. make interface controller interact with it only and all game components
// interact with each other through that controller

//fix dealer:
//first make it work as it is. then make a more sophisticated state machine

//write tests

//undo/redo buttons by adding event histoy and execute each of them from an array or something. make controller keep
// track of this

//optimal control?

//Add range functionality. If there are no player cards selected, select from full range. If one is selected,
// select possible hands for second card. When you hover over a slot or sth, the range appears.
//Give board and range as input, function returns probability of types of hands to be made.
//Give board, position, action as input, try to predict range.
//On the river:
//	calculate lowest and highest possible hand (based on board);
//  given a player range, calculate probability of each hand between lowest and highest
//On earlier streets:
//	same, but also calculate draws, where a draw is a possibility of making a hand which isn't already made (can be anything, not just straight/flush)
//report analysis results through popup. this will allow you to make it asynchronous so you can do other stuff in the meantime

//make two real people play against each other using the app. one of them uses its functionality, the other doesn't. compare performance.
//make a bot... play it against real people and against a different version of itself. it has a personality
//make app predict what kind of a player this is based on actions

//git?