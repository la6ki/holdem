var $ = require('jquery');
var constants = require('./../constants_and_styles/constants').constants;
var styles = require('./../constants_and_styles/css');
var toolStyles = styles.CreateToolStyles();
var eventManager = require('./../event_manager');

function Toolbar() {}

Toolbar.prototype.reset = function() {

	this.events = eventManager.CreateEventManager();

	var interfaceContainer = $(constants.interfaceClasses.interfaceContainer);
    var buttonWrappers = '<div class="' + constants.buttons.newPlayerButtonWrapperClass + '"></div>' +
        '<div class="' + constants.buttons.newPlayersButtonWrapperClass + '"></div>' +
        '<div class="' + constants.buttons.newPlayersDropdownWrapperClass + '"></div>' +
        '<div class="' + constants.buttons.compareHandsButtonWrapperClass + '"></div>' +
        '<div class="' + constants.buttons.resetBoardButtonWrapperClass + '"></div>' +
        '<div class="' + constants.buttons.resetButtonWrapperClass + '"></div>';

    interfaceContainer.append(buttonWrappers);

    this.renderNewPlayerButton();
    this.renderNewPlayersButton();
    this.renderNewPlayersDropdown();
    this.renderCompareHandsButton();
    this.renderResetBoardButton();
    this.renderResetButton();
    this.styles();
    this.actions();

};

Toolbar.prototype.renderNewPlayerButton = function() {

    var button = '<div class="' + constants.buttons.newPlayerButtonClass + ' ' + constants.buttons.buttonClass + '"><p>'
        + constants.buttons.newPlayerButtonName + '</p></div>';

    var $newPlayerButtonWrapper = $('.' + constants.buttons.newPlayerButtonWrapperClass);
    $newPlayerButtonWrapper.empty().append(button);

};

Toolbar.prototype.renderNewPlayersButton = function() {

	var button = '<div class="' + constants.buttons.newPlayersButtonClass + ' ' + constants.buttons.buttonClass + '"><p>'
        + constants.buttons.newPlayersButtonName + '</p></div>';

	var $newPlayersButtonWrapper = $('.' + constants.buttons.newPlayersButtonWrapperClass);
    $newPlayersButtonWrapper.empty().append(button);

};

Toolbar.prototype.renderNewPlayersDropdown = function() {

	var dropdown = '<select>';
	
	for (var player=1; player<=constants.holdemProperties.maxNumberOfPlayers; player++) {
		dropdown += '<option value="' + player + '">' + player + '</option>';
	}

	dropdown += '</select>';

	var $dropdownWrapper = $('.' + constants.buttons.newPlayersDropdownWrapperClass);
	$dropdownWrapper.empty().append(dropdown);
	$dropdownWrapper.css(toolStyles.newPlayersDropdownWrapper);

};

Toolbar.prototype.renderCompareHandsButton = function() {

    var button = '<div class="' + constants.buttons.compareHandsButtonClass + ' ' + constants.buttons.buttonClass + '"><p>'
        + constants.buttons.compareHandsButtonName + '</p></div>';

    var $compareHandsButtonWrapper = $('.' + constants.buttons.compareHandsButtonWrapperClass);
    $compareHandsButtonWrapper.empty().append(button);

};

Toolbar.prototype.renderResetBoardButton = function() {

	var button = '<div class="' + constants.buttons.resetBoardButtonClass + ' ' + constants.buttons.buttonClass + '"><p>'
        + constants.buttons.resetBoardButtonName + '</p></div>';

    var $resetBoardButtonWrapper = $('.' + constants.buttons.resetBoardButtonWrapperClass);
	$resetBoardButtonWrapper.empty().append(button);

};

Toolbar.prototype.renderResetButton = function() {

    var button = '<div class="' + constants.buttons.resetButtonClass + ' ' + constants.buttons.buttonClass + '"><p>' +
        constants.buttons.resetButtonName + '</p></div>';

    var $resetButtonWrapper = $('.' + constants.buttons.resetButtonWrapperClass);
    $resetButtonWrapper.empty().append(button);

};

Toolbar.prototype.styles = function() {

    var $button = $('.' + constants.buttons.buttonClass);
	$button.css(toolStyles.button);
	var $buttonP = $('.' + constants.buttons.buttonClass + ' > ' + constants.html.pTag);
    $buttonP.css(toolStyles.button_p);

    var $newPlayerButtonWrapper = $('.' + constants.buttons.newPlayerButtonWrapperClass);
    $newPlayerButtonWrapper.css(toolStyles.newPlayerButtonWrapper);

    var $newPlayersButtonWrapper = $('.' + constants.buttons.newPlayersButtonWrapperClass);
    $newPlayersButtonWrapper.css(toolStyles.newPlayersButtonWrapper);

    var $compareHandsButtonWrapper = $('.' + constants.buttons.compareHandsButtonWrapperClass);
    $compareHandsButtonWrapper.css(toolStyles.compareHandsButtonWrapper);

    var $resetBoardButtonWrapper = $('.' + constants.buttons.resetBoardButtonWrapperClass);
    $resetBoardButtonWrapper.css(toolStyles.resetBoardButtonWrapper);

    var $resetButtonWrapper = $('.' + constants.buttons.resetButtonWrapperClass);
    $resetButtonWrapper.css(toolStyles.resetButtonWrapper);

};

Toolbar.prototype.actions = function() {

	var self = this;

    var $newPlayerButton = $('.' + constants.buttons.newPlayerButtonClass);
    $newPlayerButton.on('click', function(mouseButton) {

        if (mouseButton.which === constants.jQueryEvents.leftMouseClick) {
            self.events.fire(constants.eventsUI.newPlayerButtonClick, self);
        }

    });

	var $newPlayersButton = $('.' + constants.buttons.newPlayersButtonClass);
	$newPlayersButton.on('click', function(mouseButton) {

        if (mouseButton.which === constants.jQueryEvents.leftMouseClick) {
            var $newPlayersDropDown = $('.' + constants.buttons.newPlayersDropdownWrapperClass + ' > ' + constants.html.selectTag);

            var numberOfPlayersStr = $newPlayersDropDown.val();
            var numberOfPlayers = parseInt(numberOfPlayersStr, 10);
	        self.events.fire(constants.eventsUI.newPlayersButtonClick, self, numberOfPlayers);
        }

	});

    var $compareHandsButton = $('.' + constants.buttons.compareHandsButtonClass);
    $compareHandsButton.on('click', function(mouseButton) {

        if (mouseButton.which === constants.jQueryEvents.leftMouseClick) {
            self.events.fire(constants.eventsUI.compareHandsButtonClick, self);
        }

    });

	var $resetBoardButton = $('.' + constants.buttons.resetBoardButtonClass);
	$resetBoardButton.on('click', function(mouseButton) {

        if (mouseButton.which === constants.jQueryEvents.leftMouseClick) {
            self.events.fire(constants.eventsUI.resetBoardButtonClick, self);
        }

	});

    var $resetButton = $('.' + constants.buttons.resetButtonClass);
    $resetButton.on('click', function(mouseButton) {

        if (mouseButton.which === constants.jQueryEvents.leftMouseClick) {
            self.events.fire(constants.eventsUI.resetButtonClick, self);
        }

    });

};

var CreateToolbar = function() {return new Toolbar()};
exports.CreateToolbar = CreateToolbar;