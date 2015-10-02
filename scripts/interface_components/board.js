var $ = require('jquery');
var constants = require('./../constants_and_styles/constants').constants;
var styles = require('./../constants_and_styles/css');
var boardStyles = styles.CreateBoardStyles();
var dynamicStyles = styles.CreateDynamicStyles();
var eventManager = require('./../event_manager');

function Board() {

	this.boardNumber = 0;
	this.cardBeingDragged = false;

}

Board.prototype._jQueryFormatBoardSlotClassFromCard = function (card) {

	var boardSlotIndex = this.cards.indexOf(card);
	var slotName = constants.html.slotPrefix + (boardSlotIndex + 1);
	var jQueryClasses = '.' + slotName + '.' + constants.interfaceClasses.boardCardSlotClass;

	return jQueryClasses;

};

Board.prototype._getCardFromSlot = function (slot) {

	var slotNumber = this._getSlotNumberFromSlotObject(slot);
	var slotIndex = slotNumber - 1;

	return this.cards[slotIndex];

};

Board.prototype._getSlotNumberFromSlotObject = function (slotObject) {

	var slotClass = slotObject.className;

	return this._getSlotNumberFromSlotClass(slotClass);

};


Board.prototype._getSlotNumberFromSlotClass = function (slotClass) {

	var slotName = slotClass.split(' ')[constants.html.boardSlotNumberClassIndex];
	var slotNumber = slotName.replace(/[^\d.]/g, '');

	return parseInt(slotNumber, 10);

};

Board.prototype.reset = function () {

	this.events = eventManager.CreateEventManager();
	this.active = true;
	this.cards = [null, null, null, null, null];
	this.full = false;

	var interfaceContainer = $(constants.interfaceClasses.interfaceContainer);
	var boardWrapper = '<div class="' + constants.interfaceClasses.boardWrapperClass + '"><div class="' + constants.interfaceClasses.boardClass + '"></div></div>';

	interfaceContainer.append(boardWrapper);

	var $boardWrapper = $('.' + constants.interfaceClasses.boardWrapperClass);
	$boardWrapper.css(boardStyles.boardWrapper);

	this.render();

};

Board.prototype.render = function () {

	var boardHTML = '<span class="' + constants.interfaceClasses.boardNameClass + '">' + constants.html.boardName + '</span>';

	for (var k = 1; k < constants.holdemProperties.fullBoardLength + 1; k++) {
		boardHTML = boardHTML + '<div class="' + constants.html.slotPrefix + k + ' ' + constants.interfaceClasses.boardCardSlotClass +
		' ' + constants.interfaceClasses.slotClass + '"></div>';
	}

	var $board = $('.' + constants.interfaceClasses.boardClass);
	$board.empty().append(boardHTML);


	var $boardName = $('.' + constants.interfaceClasses.boardNameClass);
	$boardName.css(boardStyles.boardName);

	var $boardSlot = $('.' + constants.interfaceClasses.boardCardSlotClass);
	$boardSlot.css(boardStyles.boardSlot);

	this.activateBoard();
	this.actions();

};

Board.prototype.actions = function () {

	var self = this;

	var $interfaceContainer = $(constants.interfaceClasses.interfaceContainer);
	$interfaceContainer
		.on('mousedown', '.' + constants.interfaceClasses.boardWrapperClass, function () {

			if (!self.cardBeingDragged) {
				self.events.fire(constants.eventsUI.boardClick, self);
			}

		})
		.on('mousedown', '.' + constants.interfaceClasses.boardImageClass + '.' + constants.interfaceClasses.draggableObjectClass, function (mouseButton) {

			var slot = this.parentElement;
			var card = self._getCardFromSlot(slot);

			if (mouseButton.which === constants.jQueryEvents.leftMouseClick) {
				var slotNumber = self._getSlotNumberFromSlotObject(this.parentElement);
				var parameters = {card: card, slotNumber: slotNumber, objectNumber: self.boardNumber, draggedObject: this};
				self.events.fire(constants.eventsUI.cardReadyToDrag, self, parameters);
				self.cardBeingDragged = true;
			}
			else if (mouseButton.which === constants.jQueryEvents.middleMouseClick) {
				self.events.fire(constants.eventsUI.boardSlotClick, self, card);
			}

		});

};

Board.prototype.validateBoard = function() {

	var boardCards = this.cards;

	var firstCardIndex = constants.cardParameters.firstCardIndex;
	var secondCardIndex = constants.cardParameters.secondCardIndex;
	var thirdCardIndex = constants.cardParameters.thirdCardIndex;
	var fourthCardIndex = constants.cardParameters.fourthCardIndex;
	var fifthCardIndex = constants.cardParameters.fifthCardIndex;

	var boardEmpty = true;
	for (var k=0; k<boardCards.length; k++) {
		if (boardCards[k] !== null) {
			boardEmpty = false;
			break;
		}
	}

	var flopDealt =
		boardCards[firstCardIndex] !== null && boardCards[secondCardIndex] !== null && boardCards[thirdCardIndex] !== null;

	if (!boardEmpty && !flopDealt) {
		return false;
	}

	return !(boardCards[fifthCardIndex] !== null && boardCards[fourthCardIndex] === null);

};

Board.prototype.getNullSlotIndices = function () {

	var boardNullIndices = [];
	for (var j = 0; j < this.cards.length; j++) {
		if (this.cards[j] === null) {
			boardNullIndices.push(j);
		}
	}

	return boardNullIndices;

};

Board.prototype.removeBordersFromNonEmptySlots = function () {

	for (var k = 0; k < this.cards.length; k++) {
		if (this.cards[k] !== null) {
			var slotNumber = k + 1;
			var $boardSlot = $('.' + constants.interfaceClasses.boardCardSlotClass + '.' + constants.html.slotPrefix + (slotNumber));
			$boardSlot.css(boardStyles.boardSlotWithCard);
		}
	}

};

Board.prototype.activateBoard = function () {

	this.active = true;
	this.markBoard();

	return this.boardNumber;

};

Board.prototype.deactivateBoard = function () {

	this.active = false;
	this.unmarkBoard();

};

Board.prototype.markBoard = function () {

	var boardSlotsClass = '.' + constants.interfaceClasses.boardCardSlotClass;
	var $boardSlots = $(boardSlotsClass);
	$boardSlots.css(dynamicStyles.markedBoard);

};

Board.prototype.unmarkBoard = function () {

	var boardSlotsClass = '.' + constants.interfaceClasses.boardCardSlotClass;
	var $boardSlots = $(boardSlotsClass);
	$boardSlots.css(dynamicStyles.unmarkedBoard);

};

Board.prototype.addCard = function (card) {

	for (var k = 0; k < this.cards.length; k++) {
		if (this.cards[k] === null) {
			var imageFileName = constants.ranksNumToTxtDictionary[card.rank] + constants.html.rankSuitDividerIImgFiles +
				constants.suitsNumToTxtDictionary[card.suit];
			var slotImageHTML = '<div class="' + constants.interfaceClasses.slotImageContainerClass + ' '
				+ constants.interfaceClasses.boardImageClass + ' ' + constants.interfaceClasses.draggableObjectClass + '"><img draggable="false" src="' +
				constants.html.imagesPath + imageFileName + constants.html.largeCardExtension + '" /></div>';

			var slotClass = '.' + constants.html.slotPrefix + (k + 1) + '.' + constants.interfaceClasses.boardCardSlotClass;
			var $slot = $(slotClass);
			$slot.empty().append(slotImageHTML);
			$slot.css(boardStyles.boardSlotWithCard);

			var $boardImageContainer = $('.' + constants.interfaceClasses.boardCardSlotClass + ' .' + constants.interfaceClasses.boardImageClass);
			$boardImageContainer.css(boardStyles.boardImage);

			var $boardImage = $('.' + constants.interfaceClasses.boardCardSlotClass + ' ' + constants.html.imgTag);
			$boardImage.css(boardStyles.boardSlot_img);

			this.cards[k] = card;

			break;
		}

	}

};

Board.prototype.removeCard = function (card) {

	var slotClass = this._jQueryFormatBoardSlotClassFromCard(card);
	var $slot = $(slotClass);
	$slot.empty();
	$slot.css(boardStyles.boardSlot);

	var boardIndex = this._getSlotNumberFromSlotObject($slot[0]) - 1;
	this.cards[boardIndex] = null;

};

Board.prototype.removeAllCards = function () {

	var cardsArray = [];

	for (var k = 0; k < this.cards.length; k++) {
		var card = this.cards[k];
		cardsArray.push(card);
		this.removeCard(card);
	}

	return cardsArray;

};

Board.prototype.styleDraggedCard = function (card) {

	var slotClasses = this._jQueryFormatBoardSlotClassFromCard(card);
	var $slot = $(slotClasses);
	var $draggedCard = $slot.children();
	$draggedCard.css(dynamicStyles.draggedImg);

};

Board.prototype.styleBoardForDragging = function () {

	var $boardSlots = $('.' + constants.interfaceClasses.boardCardSlotClass);
	$boardSlots.css(boardStyles.boardSlot);
	this.deactivateBoard();

};

Board.prototype.highlightSlotOnMouseOver = function (dropObject) {

	var boardSlotClasses = dropObject.objectParentClasses.objectClasses;
	var boardSlotName = boardSlotClasses.split(' ')[constants.html.boardSlotNumberClassIndex];
	var boardSlotNumber = this._getSlotNumberFromSlotClass(boardSlotName);
	var $boardSlot = $('.' + constants.interfaceClasses.boardCardSlotClass + '.' + constants.html.slotPrefix + boardSlotNumber);

	$boardSlot.css(dynamicStyles.highlightedObject);

};

Board.prototype.removeHighlightOnMouseOver = function (dropObject) {

	var boardSlotClasses = dropObject.objectParentClasses.objectClasses;
	var boardSlotName = boardSlotClasses.split(' ')[constants.html.boardSlotNumberClassIndex];
	var boardSlotNumber = this._getSlotNumberFromSlotClass(boardSlotName);
	var $boardSlot = $('.' + constants.interfaceClasses.boardCardSlotClass + '.' + constants.html.slotPrefix + boardSlotNumber);

	$boardSlot.css(dynamicStyles.notHighlightedObject);

};

Board.prototype.getCardSlotIndexFromDraggedObject = function (draggedObject) {

	var draggedCardSlot = draggedObject.parentElement;
	var draggedCardBoardSlotNumber = this._getSlotNumberFromSlotObject(draggedCardSlot);

	return draggedCardBoardSlotNumber - 1;

};

Board.prototype.getCardFromDropObject = function (dropObject) {

	var dropObjectClasses = dropObject.objectParentClasses.objectClasses;
	var dropCardBoardSlotNumber = this._getSlotNumberFromSlotClass(dropObjectClasses);
	var dropCardBoardSlot = $('.' + constants.html.slotPrefix + dropCardBoardSlotNumber + '.' + constants.interfaceClasses.boardCardSlotClass)[0];

	return this._getCardFromSlot(dropCardBoardSlot);

};

Board.prototype.getCardSlotIndexFromDropObject = function (dropObject) {

	var dropObjectClasses = dropObject.objectParentClasses.objectClasses;
	var dropCardBoardSlotNumber = this._getSlotNumberFromSlotClass(dropObjectClasses);

	return dropCardBoardSlotNumber - 1;

};

Board.prototype.getCardFromDraggedObject = function (draggedObject) {

	var draggedCardBoardSlot = draggedObject.parentElement;

	return this._getCardFromSlot(draggedCardBoardSlot);

};

var CreateBoard = function () {
	return new Board()
};

exports.CreateBoard = CreateBoard;