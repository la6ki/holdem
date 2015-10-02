var $ = require('jquery');
var constants = require('./../constants_and_styles/constants').constants;
var styles = require('./../constants_and_styles/css');
var deckStyles = styles.CreateDeckStyles();
var dynamicStyles = styles.CreateDynamicStyles();
var eventManager = require('./../event_manager');

function Deck() {}

Deck.prototype._getCardFromDeckSlot = function (deckSlot) {

    var rankClass = deckSlot.parentElement.className;
    var suitClass = deckSlot.className.split(' ')[constants.html.deckSuitClassIndex];

	var allRanks = constants.cardParameters.allRanks;
	var allSuits = constants.cardParameters.allSuits;

    var rankInd = constants.ranksNameToIndexDictionary[rankClass];
    var suitInd = constants.suitsNameToIndexDictionary[suitClass];

    return this.deck[allRanks[rankInd] + constants.html.rankSuitDividerDeck + allSuits[suitInd]];

};

Deck.prototype._getCardSlotClassesFromCard = function (card) {

    return {rankClass: constants.ranksNumToNameDictionary[card.rank], suitClass: constants.suitsNumToNameDictionary[card.suit]};

};

Deck.prototype._generateRenderDeckObject = function() {

    var allRanks = constants.cardParameters.allRanks;
    var allSuits = constants.cardParameters.allSuits;

    var renderDeckObject = {};

    for (var k = 0; k < allRanks.length; k++) {

        var currentRankAllSuits = {};
        for (var i = 0; i < allSuits.length; i++) {
            var card = {};
            card.rank = allRanks[k];
            card.suit = allSuits[i];
            currentRankAllSuits[allSuits[i]] = card;
        }

        renderDeckObject[allRanks[k]] = currentRankAllSuits;
    }

    return renderDeckObject;

};

Deck.prototype.generateDeck = function() {

    var allRanks = constants.cardParameters.allRanks;
    var allSuits = constants.cardParameters.allSuits;

    var deck = {};

    for (var k = 0; k < allRanks.length; k++) {
        for (var i = 0; i < allSuits.length; i++) {
            var card = {};
            card.rank = allRanks[k];
            card.suit = allSuits[i];
            deck[allRanks[k] + constants.html.rankSuitDividerDeck + allSuits[i]] = card;
        }
    }

    return deck;

};

Deck.prototype.generateCardStateObject = function() {

    var allRanks = constants.cardParameters.allRanks;
    var allSuits = constants.cardParameters.allSuits;

    var cardStateObject = {};

    for (var k = 0; k < allRanks.length; k++) {
        for (var i = 0; i < allSuits.length; i++) {
            var card = {};
            card.rank = allRanks[k];
            card.suit = allSuits[i];
            card.selected = false;
            card.addedTo = null;
            cardStateObject[allRanks[k] + constants.html.rankSuitDividerDeck + allSuits[i]] = card;
        }
    }

    return cardStateObject;

};

Deck.prototype.drawRandomCardFromDeck = function () {

    var remainingCards = [];

    for (var card in this.deck) {
        if (this.deck.hasOwnProperty(card)) {
            if (!this.cardStateObject[card].selected) {
                remainingCards.push(this.deck[card]);
            }
        }
    }

    var randInd = Math.floor(remainingCards.length * Math.random());
    var selectedCard = remainingCards[randInd];
    var cardName = selectedCard.rank + constants.html.rankSuitDividerDeck + selectedCard.suit;
    this.cardStateObject[cardName].selected = true;

    return selectedCard;

};

Deck.prototype.cardSelected = function(card) {

	return this.cardStateObject[card.rank + constants.html.rankSuitDividerDeck + card.suit].selected;

};

Deck.prototype.cardAddedTo = function(card) {

    return this.cardStateObject[card.rank + constants.html.rankSuitDividerDeck + card.suit].addedTo;

};

Deck.prototype.reset = function() {

    this.events = eventManager.CreateEventManager();
    this.deck = this.generateDeck();
	this.cardStateObject = this.generateCardStateObject();

    var interfaceContainer = $(constants.interfaceClasses.interfaceContainer);
    var deckWrapper = '<div class="' + constants.interfaceClasses.deckWrapperClass + '"></div>';

    interfaceContainer.empty().append(deckWrapper);

    var $deckWrapper = $('.' + constants.interfaceClasses.deckWrapperClass);
    $deckWrapper.css(deckStyles.deckWrapper);

    this.render();

};

Deck.prototype.render = function() {

    var renderDeckObject = this._generateRenderDeckObject();

    var table = '<table class="' + constants.interfaceClasses.deckTableClass + '">';

    for (var rank in renderDeckObject) {
	    if (renderDeckObject.hasOwnProperty(rank)) {
		    var tableRowName = constants.ranksNumToNameDictionary[rank];

		    var tableRow = '<tr class="' + tableRowName + '">';
		    for (var suit in renderDeckObject[rank]) {
			    if (renderDeckObject[rank].hasOwnProperty(suit)) {
				    var tableColumn = '';
				    var tableColumnName = constants.suitsNumToNameDictionary[suit];
				    var imageFileName = constants.ranksNumToTxtDictionary[rank] + constants.html.rankSuitDividerIImgFiles +
                        constants.suitsNumToTxtDictionary[suit];

				    tableColumn = '<td class="' + tableColumnName + ' ' + constants.interfaceClasses.deckSlotClass +
				    '"><img src="' + constants.html.iconsPath + imageFileName + constants.html.iconImageExtension + '" /></td>';

				    tableRow = tableRow + tableColumn;
			    }
		    }

		    table = table + tableRow + '</tr>';
	    }
    }

    table = table + '</table>';

    var $deckWrapper = $('.' + constants.interfaceClasses.deckWrapperClass);
    $deckWrapper.empty().append(table);

    var $deckTable = $('.' + constants.interfaceClasses.deckTableClass);
    $deckTable.css(deckStyles.deckTable);

    var $deckSlotImg = $('.' + constants.interfaceClasses.deckSlotClass + ' > ' + constants.html.imgTag);
    $deckSlotImg.css(deckStyles.deckSlot_img);

    this.actions();

};

Deck.prototype.actions = function() {

    var self = this;

    var $deckSlot = $('.' + constants.interfaceClasses.deckSlotClass);
    $deckSlot.off().on('click', function (mouseButton) {

        if (mouseButton.which === constants.jQueryEvents.leftMouseClick) {
            var slot = this;

            var card = self._getCardFromDeckSlot(slot);
            self.events.fire(constants.eventsUI.deckSlotClick, self, card);
        }

    });

};

Deck.prototype.markDeckSlot = function (card) {

	var cardState = this.cardStateObject[card.rank + constants.html.rankSuitDividerDeck + card.suit];
    var objectNumber = cardState.addedTo;

    var cardSlotClasses = this._getCardSlotClassesFromCard(card);
    var rankClass = cardSlotClasses.rankClass;
    var suitClass = cardSlotClasses.suitClass;

    dynamicStyles.setMarkedDeckSlot(objectNumber);

    var $deckSlot = $('.' + rankClass + ' .' + suitClass);
    $deckSlot.css(dynamicStyles.markedDeckSlot);

};

Deck.prototype.unmarkDeckSlot = function (card) {

    var cardSlotClasses = this._getCardSlotClassesFromCard(card);
    var rankClass = cardSlotClasses.rankClass;
    var suitClass = cardSlotClasses.suitClass;

    var $deckSlot = $('.' + rankClass + ' .' + suitClass);
    $deckSlot.css(dynamicStyles.unmarkedDeckSlot);

};

Deck.prototype.returnCardToDeck = function(card) {

	this.unmarkDeckSlot(card);
	var cardState = this.cardStateObject[card.rank + constants.html.rankSuitDividerDeck + card.suit];
	cardState.selected = false;
	cardState.addedTo = null;

};

Deck.prototype.highlightOnMouseOver = function() {

    var $deck = $('.' + constants.interfaceClasses.deckWrapperClass);
    $deck.css(dynamicStyles.highlightedObject);

};

Deck.prototype.removeHighlightOnMouseOver = function() {

    var $deck = $('.' + constants.interfaceClasses.deckWrapperClass);
    $deck.css(dynamicStyles.notHighlightedObject);

};

var CreateDeck = function() {return new Deck()};
exports.CreateDeck = CreateDeck;