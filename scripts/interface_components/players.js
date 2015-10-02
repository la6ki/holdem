var $ = require('jquery');
var constants = require('./../constants_and_styles/constants').constants;
var styles = require('./../constants_and_styles/css');
var playerStyles = styles.CreatePlayerStyles();
var dynamicStyles = styles.CreateDynamicStyles();
var eventManager = require('./../event_manager');

function Players() {
}

Players.prototype._getPlayerNumberFromCard = function (card) {

    var allPlayerCards = this.playerCards;
    for (var player in allPlayerCards) {
        if (allPlayerCards.hasOwnProperty(player)) {
            var currentPlayerCards = allPlayerCards[player];
            for (var m = 0; m < currentPlayerCards.length; m++) {
                var playerCard = currentPlayerCards[m];
                if (playerCard !== null) {
                    if (card.rank === playerCard.rank && card.suit === playerCard.suit) {
                        return parseInt(player, 10);
                    }
                }
            }
        }
    }

    return null;

};

Players.prototype._getSlotNumberHoldingCard = function (card, playerNumber) {

    var playerCards = this.playerCards[playerNumber];

    for (var k = 0; k < playerCards.length; k++) {
        var playerCard = playerCards[k];
        if (playerCard !== null) {
            if (card.rank === playerCard.rank && card.suit === playerCard.suit) {
                return k;
            }
        }
    }

};

Players.prototype._jQueryFormatPlayerSlotClassFromCard = function (card) {

    var playerNumber = this._getPlayerNumberFromCard(card);
    var playerSlotIndex = this._getSlotNumberHoldingCard(card, playerNumber);

    return '.' + constants.html.playerPrefix + playerNumber + ' .' + constants.html.slotPrefix + (playerSlotIndex + 1);

};

Players.prototype._getLowestOfGamePlayerNumber = function () {

    for (var player in this.playerStates) {
        if (this.playerStates.hasOwnProperty(player)) {
            if (!this.playerStates[player].inGame) {
                return player;
            }
        }
    }

    return null;

};

Players.prototype._getPlayerNumberFromPlayerObject = function (playerObject) {

    var playerClass = playerObject.className;

    return this._getPlayerNumberFromPlayerClass(playerClass);

};

Players.prototype._findActivePlayer = function () {

    for (var player in this.playerStates) {
        if (this.playerStates.hasOwnProperty(player)) {
            if (this.playerStates[player].active) {
                return parseInt(player, 10);
            }
        }
    }

};

Players.prototype._getSlotNumberFromSlotObject = function (slotObject) {

	var slotClass = slotObject.className;
	var slotName = slotClass.split(' ')[constants.html.playerSlotNumberClassIndex];
	var slotNumber = slotName.replace(/[^\d.]/g, '');

	return parseInt(slotNumber, 10);

};

Players.prototype._getCardFromSlot = function (slot) {

	var playerNumber = this._getPlayerNumberFromPlayerObject(slot.parentElement);
	var slotNumber = this._getSlotNumberFromSlotObject(slot);
	var slotIndex = slotNumber - 1;

	return this.playerCards[playerNumber][slotIndex];

};

Players.prototype._getPlayerNumberFromPlayerClass = function(playerClass) {

	var playerName = playerClass.split(' ')[constants.html.playerNumberClassIndex];
	var playerNumber = playerName.replace(/[^\d.]/g, '');

	return parseInt(playerNumber, 10);

};

Players.prototype._getSlotNumberFromSlotClass = function(slotClass) {

	var slotName = slotClass.split(' ')[constants.html.playerSlotNumberClassIndex];
	var slotNumber = slotName.replace(/[^\d.]/g, '');

	return parseInt(slotNumber, 10);

};

Players.prototype.reset = function () {

    this.events = eventManager.CreateEventManager();

    this.playerCards = {
        1: [null, null],
        2: [null, null],
        3: [null, null],
        4: [null, null],
        5: [null, null],
        6: [null, null],
        7: [null, null],
        8: [null, null],
        9: [null, null]
    };

    this.playerStates = {
        1: {inGame: false, active: false, full: false},
        2: {inGame: false, active: false, full: false},
        3: {inGame: false, active: false, full: false},
        4: {inGame: false, active: false, full: false},
        5: {inGame: false, active: false, full: false},
        6: {inGame: false, active: false, full: false},
        7: {inGame: false, active: false, full: false},
        8: {inGame: false, active: false, full: false},
        9: {inGame: false, active: false, full: false}
    };

    this.actions();

};

Players.prototype.getPlayersWithTwoCards = function (allPlayers) {

	var playersWithTwoCards = {};
	for (var player in allPlayers) {
		if (allPlayers.hasOwnProperty(player)) {
			if (this.playerStates[player].full) {
				playersWithTwoCards[player] = allPlayers[player];
			}
		}
	}

	return playersWithTwoCards;

};

Players.prototype.getPlayerObjectFromPlayerNumber = function (playerNumber) {

	return $('.' + constants.html.playerPrefix + playerNumber)[0];

};

Players.prototype.removeBordersFromNonEmptySlots = function() {

    var playerStates = this.playerStates;
	var playerCards = this.playerCards;

    for (var player in playerStates) {
	    if (playerStates.hasOwnProperty(player)) {
		    if (this.playerStates[player].inGame) {
			    var cards = playerCards[player];
			    for (var k=0; k<cards.length; k++) {
				    if (cards[k] !== null) {
					    var slotNumber = k + 1;
					    var $playerSlot = $('.' + constants.html.playerPrefix + player + ' .' + constants.html.slotPrefix + (slotNumber));
					    $playerSlot.css(playerStyles.playerSlotWithCard);
				    }
			    }
		    }
	    }
    }

};

Players.prototype.generateNewPlayer = function () {

    var playerNumber = this._getLowestOfGamePlayerNumber();
    var playerName = constants.slotsNumToNameDictionary[playerNumber] + ' ' + constants.interfaceClasses.playerNameClass;

    var player = '<div class="' + constants.interfaceClasses.playerWrapperClass + ' ' + constants.html.playerPrefix + playerNumber + '">' +
        '<span class="' + playerName + '">' + constants.html.playerName + ' ' + playerNumber + '</span>';

    var slotName;
    for (var k = 1; k < constants.holdemProperties.holdemHandLength + 1; k++) {
        slotName = constants.html.slotPrefix + k + ' ' + constants.interfaceClasses.playerCardSlotClass + ' ' + constants.interfaceClasses.slotClass;
        player = player + '<div class="' + slotName + '"></div>';
    }

    player = player + '</div>';

    this.playerStates[playerNumber].inGame = true;

    var $interfaceContainer = $(constants.interfaceClasses.interfaceContainer);
    $interfaceContainer.append(player);

    var $playerSlot = $('.' + constants.interfaceClasses.playerWrapperClass + '.' + constants.html.playerPrefix + playerNumber + ' .'
        + constants.interfaceClasses.playerCardSlotClass);
    $playerSlot.css(playerStyles.playerSlot);


    playerStyles.setPlayerNameColor(playerNumber);
    var $player = $('.' + constants.html.playerPrefix + playerNumber + ' .' + constants.interfaceClasses.playerNameClass);
    $player.css(playerStyles.playerName);

    var $playerObject = $('.' + constants.html.playerPrefix + playerNumber);
    $playerObject.css(playerStyles.players[playerNumber]);

    return $playerObject[0];

};

Players.prototype.actions = function () {

    var self = this;

    var $interfaceContainer = $(constants.interfaceClasses.interfaceContainer);
    $interfaceContainer
	    .on('mousedown', '.' + constants.interfaceClasses.playerNameClass, function (mouseButton) {

		    if (mouseButton.which === constants.jQueryEvents.middleMouseClick) {
			    var playerNumber = self._getPlayerNumberFromPlayerObject(this.parentElement);
			    var $playerObject = $('.' + constants.html.playerPrefix + playerNumber);
			    self.events.fire(constants.eventsUI.playerObjectNameClick, self, $playerObject);
		    }

	    })
        .on('mousedown', '.' + constants.interfaceClasses.playerWrapperClass, function () {

            if (!self.cardBeingDragged) {
                self.events.fire(constants.eventsUI.playerClick, self, this);
            }

        })
        .on('mousedown', '.' + constants.interfaceClasses.playerImageClass + '.' +
        constants.interfaceClasses.draggableObjectClass, function (mouseButton) {

            var slot = this.parentElement;
            var card = self._getCardFromSlot(slot);

            if (mouseButton.which === constants.jQueryEvents.leftMouseClick) {
                var playerNumber = self._getPlayerNumberFromPlayerObject(this.parentElement.parentElement);
                var slotNumber = self._getSlotNumberFromSlotObject(this.parentElement);
                var parameters = {card: card, objectNumber: playerNumber, slotNumber: slotNumber, draggedObject: this};
                self.events.fire(constants.eventsUI.cardReadyToDrag, self, parameters);
                self.cardBeingDragged = true;
            }
            else if (mouseButton.which === constants.jQueryEvents.middleMouseClick) {
                self.events.fire(constants.eventsUI.playerSlotClick, self, card);
            }

        });

};

Players.prototype.removePlayer = function ($player) {

    var playerNumber = this._getPlayerNumberFromPlayerObject($player[0]);
    var playerState = this.playerStates[playerNumber];

	playerState.inGame = false;
	playerState.active = false;
	playerState.full = false;

	$player.remove();

    return this.playerCards[playerNumber];

};

Players.prototype.removeInGamePlayers = function () {

    var playerCardsArray = [];

    for (var player in this.playerStates) {
        if (this.playerStates.hasOwnProperty(player)) {
            if (this.playerStates[player].inGame) {
                var $player = $('.' + constants.html.playerPrefix + player);
                var playerCards = this.removePlayer($player);
                playerCardsArray.push(playerCards);
            }
        }
    }

    return playerCardsArray;

};

Players.prototype.activatePlayer = function (playerObject) {

    var playerNumber = this._getPlayerNumberFromPlayerObject(playerObject);

    this.playerStates[playerNumber].active = true;
    this.markPlayer(playerObject);

    return playerNumber;

};

Players.prototype.deactivatePlayer = function (playerObject) {

    var playerNumber = this._getPlayerNumberFromPlayerObject(playerObject);

    this.playerStates[playerNumber].active = false;
    this.unmarkPlayer(playerObject);

};

Players.prototype.deactivateAllPlayers = function () {

    for (var player in this.playerStates) {
        if (this.playerStates.hasOwnProperty(player)) {
            if (this.playerStates[player].active) {
                var playerObject = this.getPlayerObjectFromPlayerNumber(parseInt(player, 10));
                this.deactivatePlayer(playerObject);
            }
        }
    }

};

Players.prototype.markPlayer = function (playerObject) {

    var playerNumber = this._getPlayerNumberFromPlayerObject(playerObject);

    var playerCardSlotsClass = '.' + constants.html.playerPrefix + playerNumber + ' .' + constants.interfaceClasses.playerCardSlotClass;
    var $playerCardSlots = $(playerCardSlotsClass);
    dynamicStyles.setMarkedPlayerSlot(playerNumber);
    $playerCardSlots.css(dynamicStyles.markedPlayerSlot);

};

Players.prototype.unmarkPlayer = function (playerObject) {

    var playerNumber = this._getPlayerNumberFromPlayerObject(playerObject);

    var playerCardSlotsClass = '.' + constants.html.playerPrefix + playerNumber + ' .' + constants.interfaceClasses.playerCardSlotClass;
    var $playerCardSlots = $(playerCardSlotsClass);
    $playerCardSlots.css(dynamicStyles.unmarkedPlayerSlot);

};

Players.prototype.addCard = function (card) {

    var playerNumber = this._findActivePlayer();
    var playerCards = this.playerCards[playerNumber];

    for (var k = 0; k < playerCards.length; k++) {
        if (playerCards[k] === null) {
            var imageFileName = constants.ranksNumToTxtDictionary[card.rank] + constants.html.rankSuitDividerIImgFiles
                + constants.suitsNumToTxtDictionary[card.suit];
            var slotImageHTML = '<div class="' + constants.html.playerPrefix + playerNumber + ' ' + constants.html.slotPrefix +
                (k + 1) + ' ' + constants.interfaceClasses.slotImageContainerClass + ' ' +
                constants.interfaceClasses.playerImageClass + ' ' + constants.interfaceClasses.draggableObjectClass + '">' +
                '<img draggable="false" class="' + constants.html.playerPrefix + playerNumber + ' ' + constants.html.slotPrefix +
                (k + 1) + '" ' + 'src="' + constants.html.imagesPath + imageFileName + constants.html.largeCardExtension + '" /></div>';

            var slotClass = '.' + constants.html.playerPrefix + (playerNumber) + ' .' +
                constants.html.slotPrefix + (k + 1) + '.' + constants.interfaceClasses.playerCardSlotClass;
            var $slot = $(slotClass);

            $slot.empty().append(slotImageHTML);
            $slot.css(playerStyles.playerSlotWithCard);

            var $playerImageContainer = $('.' + constants.interfaceClasses.playerCardSlotClass + ' .' + constants.interfaceClasses.playerImageClass);
            $playerImageContainer.css(playerStyles.playerImage);

            var $playerImage = $('.' + constants.interfaceClasses.playerCardSlotClass + ' ' + constants.html.imgTag);
            $playerImage.css(playerStyles.playerSlot_img);

	        playerCards[k] = card;

            break;
        }
    }

};

Players.prototype.removeCard = function (card, playerNumber) {

    var playerCards = this.playerCards[playerNumber];

    for (var k = 0; k < playerCards.length; k++) {
        if (playerCards[k] === card) {
            var slotClass = '.' + constants.html.playerPrefix + playerNumber + ' .' + constants.html.slotPrefix + (k + 1);
            var $slot = $(slotClass);
            $slot.empty();
            $slot.css(playerStyles.playerSlot);

            playerCards[k] = null;

            break;
        }
    }

};

Players.prototype.markWinnerPlayers = function (playersWinFrequencies) {

    for (var playerNumber in playersWinFrequencies) {
        if (playersWinFrequencies.hasOwnProperty(playerNumber)) {
            if (playersWinFrequencies[playerNumber] > 0) {
                dynamicStyles.setMarkedPlayer(parseInt(playerNumber, 10));
                var $player = $('.' + constants.html.playerPrefix + parseInt(playerNumber, 10) + ' .' + constants.interfaceClasses.playerNameClass);
                $player.css(dynamicStyles.markedPlayer);
            }
        }
    }

};

Players.prototype.unmarkWinnerPlayer = function (playerObject) {

    var playerNumber = this._getPlayerNumberFromPlayerObject(playerObject);
    var $player = $('.' + constants.html.playerPrefix + playerNumber + ' .' + constants.interfaceClasses.playerNameClass);
    $player.css(dynamicStyles.unmarkedPlayer);

};

Players.prototype.unmarkInGameWinnerPlayers = function () {

    for (var player in this.playerStates) {
        if (this.playerStates.hasOwnProperty(player)) {
            if (this.playerStates[player].inGame) {
                var playerObject = this.getPlayerObjectFromPlayerNumber(player);
                this.unmarkWinnerPlayer(playerObject);
            }
        }
    }

};

Players.prototype.styleDraggedCard = function (card) {

    var slotClasses = this._jQueryFormatPlayerSlotClassFromCard(card);
    var $slot = $(slotClasses);
    var $draggedCard = $slot.children();

    $draggedCard.css(dynamicStyles.draggedImg);

};

Players.prototype.stylePlayersForDragging = function() {

    var $playerSlots = $('.' + constants.interfaceClasses.playerCardSlotClass);
    $playerSlots.css(playerStyles.playerSlot);
    this.deactivateAllPlayers();

};

Players.prototype.highlightSlotOnMouseOver = function(dropObject) {

	var playerClasses = dropObject.objectParentClasses.parentClasses;
	var playerSlotClasses = dropObject.objectParentClasses.objectClasses;
    var playerNumber = this._getPlayerNumberFromPlayerClass(playerClasses);
    var playerSlotNumber = this._getSlotNumberFromSlotClass(playerSlotClasses);
    var $playerSlot = $('.' + constants.html.playerPrefix + playerNumber + ' .' + constants.html.slotPrefix + playerSlotNumber);

    $playerSlot.css(dynamicStyles.highlightedObject);

};

Players.prototype.removeHighlightOnMouseOver = function(dropObject) {

	var playerClasses  = dropObject.objectParentClasses.parentClasses;
	var playerSlotClasses= dropObject.objectParentClasses.objectClasses;
	var playerNumber = this._getPlayerNumberFromPlayerClass(playerClasses);
	var playerSlotNumber = this._getSlotNumberFromSlotClass(playerSlotClasses);
	var $playerSlot = $('.' + constants.html.playerPrefix + playerNumber + ' .' + constants.html.slotPrefix + playerSlotNumber);

    $playerSlot.css(dynamicStyles.notHighlightedObject);

};

Players.prototype.getCardFromDraggedObject = function(draggedObject) {

	var draggedCardPlayerSlot = draggedObject.parentElement;

	return this._getCardFromSlot(draggedCardPlayerSlot);

};

Players.prototype.getCardFromDropObject = function(dropObject) {

    var dropObjectParentClasses = dropObject.objectParentClasses.parentClasses;
    var dropObjectClasses = dropObject.objectParentClasses.objectClasses;
    var dropCardPlayerNumber = this._getPlayerNumberFromPlayerClass(dropObjectParentClasses);
    var dropCardPlayerSlotNumber = this._getSlotNumberFromSlotClass(dropObjectClasses);
    var dropCardPlayerSlot = $('.' + constants.html.playerPrefix + dropCardPlayerNumber + ' .' + constants.html.slotPrefix + dropCardPlayerSlotNumber + '.' + constants.interfaceClasses.playerCardSlotClass)[0];

    return this._getCardFromSlot(dropCardPlayerSlot);

};

Players.prototype.getCardObjectFromDropObject = function(dropObject) {

    var dropObjectParentClasses = dropObject.objectParentClasses.parentClasses;
    var dropCardPlayerNumber = this._getPlayerNumberFromPlayerClass(dropObjectParentClasses);

    return $('.' + constants.html.playerPrefix + dropCardPlayerNumber)[0];

};

Players.prototype.getPlayerCardsFromDropObject = function(dropObject) {

	var dropObjectParentClasses = dropObject.objectParentClasses.parentClasses;
	var dropCardPlayerNumber = this._getPlayerNumberFromPlayerClass(dropObjectParentClasses);

	return this.playerCards[dropCardPlayerNumber];

};

Players.prototype.getCardSlotIndexFromDropObject = function(dropObject) {

	var dropObjectClasses = dropObject.objectParentClasses.objectClasses;
	var dropCardPlayerSlotNumber = this._getSlotNumberFromSlotClass(dropObjectClasses);

	return dropCardPlayerSlotNumber - 1;

};

Players.prototype.getCardSlotIndexFromDraggedObject = function(draggedObject) {

	var draggedCardSlot = draggedObject.parentElement;
	var draggedCardPlayerSlotNumber = this._getSlotNumberFromSlotObject(draggedCardSlot);

	return draggedCardPlayerSlotNumber - 1;

};

Players.prototype.getCardObjectFromDraggedObject = function(draggedCardPlayerNumber) {

	return $('.' + constants.html.playerPrefix + draggedCardPlayerNumber)[0];

};

exports.CreatePlayers = function () {return new Players()};