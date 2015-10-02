var constants = require('./constants_and_styles/constants').constants;
var eventManager = require('./event_manager');

function Controller() {

	this.deck = require('./interface_components/deck').CreateDeck();
	this.board = require('./interface_components/board').CreateBoard();
	this.players = require('./interface_components/players').CreatePlayers();
	this.toolbar = require('./interface_components/toolbar').CreateToolbar();
	this.playerEquityCalculator = require('./game/player_equity_calculator').CreatePlayerEquityCalculator();
	this.dragDrop = require('./drag_drop').CreateDragDrop();

	this.errors = {
		'dropObjectNotFound': 'Drop object not found.',
		'invalidBoard': 'Invalid board.'
	};

	this.messages = {
		'resetConfirmation': 'Are you sure you want to reset everything?',
		'resetPlayersConfirmation': 'This is going to resent all in-game players. Continue?',
		'resetBoardConfirmation': 'Are you sure you want to reset the board?'
	};

}

Controller.prototype._checkIfCardInBoardOrPlayers = function (card) {

	var board = this.board;
	var players = this.players;

	for (var k = 0; k < board.cards.length; k++) {
		var boardCard = board.cards[k];
		if (boardCard !== null) {
			if (card.rank === boardCard.rank && card.suit === boardCard.suit) {
				return constants.dragDrop.boardObject;
			}
		}
	}

	var allPlayerCards = players.playerCards;
	for (var player in allPlayerCards) {
		if (allPlayerCards.hasOwnProperty(player)) {
			var currentPlayerCards = allPlayerCards[player];
			for (var m = 0; m < currentPlayerCards.length; m++) {
				var playerCard = currentPlayerCards[m];
				if (playerCard !== null) {
					if (card.rank === playerCard.rank && card.suit === playerCard.suit) {
						return constants.dragDrop.playersObject;
					}
				}
			}
		}
	}

};

Controller.prototype._activateLowestInGameObject = function () {

	var board = this.board;
	var players = this.players;

	for (var player in players.playerCards) {
		if (players.playerCards.hasOwnProperty(player)) {
			if (players.playerStates[player].inGame && !players.playerStates[player].full) {
				var playerObject = players.getPlayerObjectFromPlayerNumber(player);
				this._processPlayerActivation(playerObject);
				return;
			}
		}
	}

	if (!board.full) {
		this._processBoardActivation();
		return;
	}

	this.activeObject = null;

};

Controller.prototype._replaceNullSlotsActiveObject = function (draggedCardSlotIndex) {

	var board = this.board;
	var players = this.players;

	var slots;
	if (this.activeObject === board.boardNumber) {
		slots = board.cards;

		for (var k = 0; k < slots.length; k++) {
			if (slots[k] === null) {
				slots[k] = constants.dragDrop.tempNullReplacement;
			}
		}
	}
	else {
		var allPlayers = players.playerCards;
		slots = allPlayers[this.activeObject];

		for (var j = 0; j < slots.length; j++) {
			if (slots[j] === null) {
				slots[j] = constants.dragDrop.tempNullReplacement;
			}
		}
	}

	slots[draggedCardSlotIndex] = null;

};

Controller.prototype._returnNullSlotsActiveObject = function () {

	var board = this.board;
	var players = this.players;

	var activeObjectIsBoard = this.activeObject === board.boardNumber;

	var slots;
	if (activeObjectIsBoard || board.full) {
		slots = board.cards;

		for (var k = 0; k < slots.length; k++) {
			if (slots[k] === constants.dragDrop.tempNullReplacement) {
				slots[k] = null;
			}
		}
	}
	else {
		var allPlayers = players.playerCards;
		slots = allPlayers[this.activeObject];

		for (var j = 0; j < slots.length; j++) {
			if (slots[j] === constants.dragDrop.tempNullReplacement) {
				slots[j] = null;
			}
		}
	}

};

Controller.prototype._removeBordersFromFullSlots = function () {

	var board = this.board;
	var players = this.players;

	board.removeBordersFromNonEmptySlots();
	players.removeBordersFromNonEmptySlots()

};

Controller.prototype._processNewPlayerGeneration = function () {

	var players = this.players;

	var playerObject = players.generateNewPlayer();
	this._processPlayerActivation(playerObject);

};

Controller.prototype._processMultiplePlayersGeneration = function (numberOfPlayers) {

	var deck = this.deck;
	var players = this.players;

	var playerCardsArray = players.removeInGamePlayers();

	for (var i = 0; i < playerCardsArray.length; i++) {
		var cards = playerCardsArray[i];
		for (var j = 0; j < cards.length; j++) {
			if (cards[j] !== null) {
				deck.returnCardToDeck(cards[j]);
				cards[j] = null;
			}
		}
	}

	for (var k = 1; k <= numberOfPlayers; k++) {
		this._processNewPlayerGeneration();
	}

	var firstPlayerObject = players.getPlayerObjectFromPlayerNumber(1);
	this._processPlayerActivation(firstPlayerObject);

};

Controller.prototype._processPlayerRemoval = function ($playerObject) {

	var deck = this.deck;
	var players = this.players;

	var cards = players.removePlayer($playerObject);

	for (var k = 0; k < cards.length; k++) {
		if (cards[k] !== null) {
			deck.returnCardToDeck(cards[k]);
		}
	}

	players.deactivateAllPlayers();
	this._activateLowestInGameObject();

};

Controller.prototype._processBoardActivation = function () {

	var board = this.board;
	var players = this.players;

	this.activeObject = board.activateBoard();
	players.deactivateAllPlayers();

};

Controller.prototype._processPlayerActivation = function (playerObject) {

	var board = this.board;
	var players = this.players;

	players.deactivateAllPlayers();
	this.activeObject = players.activatePlayer(playerObject);
	board.deactivateBoard();

};

Controller.prototype._processCardAdditionAndRemoval = function (card) {


	if (this.deck.cardSelected(card)) {
		this._processCardRemoval(card);
	}
	else {
		this._processCardAddition(card);
	}

};

Controller.prototype._processCardAddition = function (card) {

	var board = this.board;

	if (this.activeObject === board.boardNumber) {
		this._processCardToBoardAddition(card);
	}
	else if (this.activeObject !== null) {
		this._processCardToPlayerAddition(card);
	}

};

Controller.prototype._processCardRemoval = function (card) {

	var board = this.board;

	if (this.deck.cardAddedTo(card) === board.boardNumber) {
		this._processCardFromBoardRemoval(card);
	}
	else {
		this._processCardFromPlayerRemoval(card);
	}

};

Controller.prototype._processCardToBoardAddition = function (card) {

	var deck = this.deck;
	var board = this.board;

	if (!board.full) {
		board.addCard(card);
		var cardState = deck.cardStateObject[card.rank + constants.html.rankSuitDividerDeck + card.suit];
		cardState.selected = true;
		cardState.addedTo = this.activeObject;
		deck.markDeckSlot(card);
	}

	var boardFullCond1 = board.cards.indexOf(null) === -1;
	var boardFullCond2 = board.cards.indexOf(constants.dragDrop.tempNullReplacement) === -1;

	if (boardFullCond1 && boardFullCond2) {
		board.full = true;
		board.unmarkBoard();
		this._activateLowestInGameObject();
	}

};

Controller.prototype._processCardToPlayerAddition = function (card) {

	var deck = this.deck;
	var players = this.players;

	var playerState = players.playerStates[this.activeObject];

	if (!playerState.full) {
		players.addCard(card);
		var cardState = deck.cardStateObject[card.rank + constants.html.rankSuitDividerDeck + card.suit];
		cardState.selected = true;
		cardState.addedTo = this.activeObject;
		deck.markDeckSlot(card);
	}

	var playerFullCond1 = players.playerCards[this.activeObject].indexOf(null) === -1;
	var playerFullCond2 = players.playerCards[this.activeObject].indexOf(constants.dragDrop.tempNullReplacement) === -1;

	if (playerFullCond1 && playerFullCond2) {
		playerState.full = true;
		players.deactivateAllPlayers();
		this._activateLowestInGameObject();
	}

};

Controller.prototype._processCardFromBoardRemoval = function (card) {

	var deck = this.deck;
	var board = this.board;

	deck.unmarkDeckSlot(card);
	board.removeCard(card);
	this._processBoardActivation();

	board.full = false;
	var cardState = deck.cardStateObject[card.rank + constants.html.rankSuitDividerDeck + card.suit];
	cardState.selected = false;
	cardState.addedTo = null;

};

Controller.prototype._processCardFromPlayerRemoval = function (card) {

	var deck = this.deck;
	var players = this.players;

	var cardState = deck.cardStateObject[card.rank + constants.html.rankSuitDividerDeck + card.suit];

	var playerObject = players.getPlayerObjectFromPlayerNumber(cardState.addedTo);
	var playerState = players.playerStates[cardState.addedTo];

	deck.unmarkDeckSlot(card);
	players.removeCard(card, cardState.addedTo);
	this._processPlayerActivation(playerObject);

	playerState.full = false;
	this.activeObject = cardState.addedTo;
	cardState.selected = false;
	cardState.addedTo = null;

};

Controller.prototype._processResettingBoard = function () {

	var deck = this.deck;
	var board = this.board;

	var cards = board.removeAllCards();

	for (var k = 0; k < cards.length; k++) {
		var card = cards[k];
		if (card !== null) {
			deck.returnCardToDeck(cards[k]);
		}
	}

	this._processBoardActivation();

};

Controller.prototype._processCardDrag = function (parameters) {

	var board = this.board;
	var players = this.players;
	var dragDrop = this.dragDrop;

	dragDrop.updateConstantsIfDifferentObject(parameters.objectNumber, parameters.slotNumber);
	dragDrop.startDragging(parameters.draggedObject, event);

	var boardOrPlayers = this._checkIfCardInBoardOrPlayers(parameters.card);
	if (boardOrPlayers === constants.dragDrop.boardObject) {
		board.styleBoardForDragging();
		players.stylePlayersForDragging();
		board.styleDraggedCard(parameters.card);
	}
	else if (boardOrPlayers === constants.dragDrop.playersObject) {
		board.styleBoardForDragging();
		players.stylePlayersForDragging();
		players.styleDraggedCard(parameters.card);
	}

};

Controller.prototype._processDropObjectHighlight = function (dropObject) {

	var board = this.board;
	var players = this.players;
	var dragDrop = this.dragDrop;

	var dropObjectType = dragDrop.getDropObjectType(dropObject);

	switch (dropObjectType) {
		case constants.dragDrop.boardSlotName:
			board.highlightSlotOnMouseOver(dropObject);
			break;
		case constants.dragDrop.playerSlotName:
			players.highlightSlotOnMouseOver(dropObject);
			break;
		default:
			throw new Error(this.errors.dropObjectNotFound);
	}

};

Controller.prototype._processDropObjectHighlightRemoval = function (dropObject) {

	var board = this.board;
	var players = this.players;
	var dragDrop = this.dragDrop;

	var dropObjectType = dragDrop.getDropObjectType(dropObject);

	switch (dropObjectType) {
		case constants.dragDrop.boardSlotName:
			board.removeHighlightOnMouseOver(dropObject);
			break;
		case constants.dragDrop.playerSlotName:
			players.removeHighlightOnMouseOver(dropObject);
			break;
		default:
			throw new Error(this.errors.dropObjectNotFound);
	}

};

Controller.prototype._processBoardToEmptyDragDrop = function () {

	var board = this.board;

	var draggedObject = this.dragDrop.draggedObject;
	var draggedCardBoardSlotIndex = board.getCardSlotIndexFromDraggedObject(draggedObject);
	var draggedBoardCard = board.getCardFromDraggedObject(draggedObject);

	this._processCardFromBoardRemoval(draggedBoardCard);
	this._replaceNullSlotsActiveObject(draggedCardBoardSlotIndex);
	this._processCardAddition(draggedBoardCard);
	this._returnNullSlotsActiveObject();

};

Controller.prototype._processPlayerToEmptyDragDrop = function () {

	var players = this.players;

	var draggedObject = this.dragDrop.draggedObject;
	var draggedPlayerCard = players.getCardFromDraggedObject(draggedObject);
	var draggedCardPlayerSlotIndex = players.getCardSlotIndexFromDraggedObject(draggedObject);

	this._processCardFromPlayerRemoval(draggedPlayerCard);
	this._replaceNullSlotsActiveObject(draggedCardPlayerSlotIndex);
	this._processCardAddition(draggedPlayerCard);
	this._returnNullSlotsActiveObject();

};

Controller.prototype._processBoardToBoardDragDrop = function () {

	var board = this.board;

	var dropObject = this.dragDrop.dropObject;
	var dropBoardCards = board.cards;
	var dropCardBoardSlotIndex = board.getCardSlotIndexFromDropObject(dropObject);
	var dropBoardCard = board.getCardFromDropObject(dropObject);

	var draggedObject = this.dragDrop.draggedObject;
	var draggedCardBoardSlotIndex = board.getCardSlotIndexFromDraggedObject(draggedObject);
	var draggedBoardCard = board.getCardFromDraggedObject(draggedObject);

	this._processCardFromBoardRemoval(draggedBoardCard);

	if (dropBoardCards[dropCardBoardSlotIndex] !== null) {
		this._processCardFromBoardRemoval(dropBoardCard);
		this._processBoardActivation();
		this._replaceNullSlotsActiveObject(draggedCardBoardSlotIndex);
		this._processCardAddition(dropBoardCard);
		this._returnNullSlotsActiveObject();
	}

	this._processBoardActivation();
	this._replaceNullSlotsActiveObject(dropCardBoardSlotIndex);
	this._processCardAddition(draggedBoardCard);
	this._returnNullSlotsActiveObject();

};

Controller.prototype._processPlayerToBoardDragDrop = function () {

	var board = this.board;
	var players = this.players;

	var dropObject = this.dragDrop.dropObject;
	var dropBoardCards = board.cards;
	var dropCardBoardSlotIndex = board.getCardSlotIndexFromDropObject(dropObject);
	var dropBoardCard = board.getCardFromDropObject(dropObject);

	var draggedObject = this.dragDrop.draggedObject;
	var draggedPlayerCard = players.getCardFromDraggedObject(draggedObject);
	var draggedCardPlayerObject = players.getCardObjectFromDraggedObject(this.deck.cardAddedTo(draggedPlayerCard));
	var draggedCardPlayerSlotIndex = players.getCardSlotIndexFromDraggedObject(draggedObject);

	this._processCardFromPlayerRemoval(draggedPlayerCard);

	if (dropBoardCards[dropCardBoardSlotIndex] !== null) {
		this._processCardFromBoardRemoval(dropBoardCard);
		this._processPlayerActivation(draggedCardPlayerObject);
		this._replaceNullSlotsActiveObject(draggedCardPlayerSlotIndex);
		this._processCardAddition(dropBoardCard);
		this._returnNullSlotsActiveObject();
	}

	this._processBoardActivation();
	this._replaceNullSlotsActiveObject(dropCardBoardSlotIndex);
	this._processCardAddition(draggedPlayerCard);
	this._returnNullSlotsActiveObject();

};

Controller.prototype._processBoardToPlayerDragDrop = function () {

	var board = this.board;
	var players = this.players;

	var dropObject = this.dragDrop.dropObject;
	var dropCardPlayerObject = players.getCardObjectFromDropObject(dropObject);
	var dropPlayerCards = players.getPlayerCardsFromDropObject(dropObject);
	var dropCardPlayerSlotIndex = players.getCardSlotIndexFromDropObject(dropObject);
	var dropPlayerCard = players.getCardFromDropObject(dropObject);

	var draggedObject = this.dragDrop.draggedObject;
	var draggedCardBoardSlotIndex = board.getCardSlotIndexFromDraggedObject(draggedObject);
	var draggedBoardCard = board.getCardFromDraggedObject(draggedObject);

	this._processCardFromBoardRemoval(draggedBoardCard);

	if (dropPlayerCards[dropCardPlayerSlotIndex] !== null) {
		this._processCardFromPlayerRemoval(dropPlayerCard);
		this._processBoardActivation();
		this._replaceNullSlotsActiveObject(draggedCardBoardSlotIndex);
		this._processCardAddition(dropPlayerCard);
		this._returnNullSlotsActiveObject();
	}

	this._processPlayerActivation(dropCardPlayerObject);
	this._replaceNullSlotsActiveObject(dropCardPlayerSlotIndex);
	this._processCardAddition(draggedBoardCard);
	this._returnNullSlotsActiveObject();

};

Controller.prototype._processPlayerToPlayerDragDrop = function () {

	var players = this.players;

	var dropObject = this.dragDrop.dropObject;
	var dropCardPlayerObject = players.getCardObjectFromDropObject(dropObject);
	var dropPlayerCards = players.getPlayerCardsFromDropObject(dropObject);
	var dropCardPlayerSlotIndex = players.getCardSlotIndexFromDropObject(dropObject);
	var dropPlayerCard = players.getCardFromDropObject(dropObject);

	var draggedObject = this.dragDrop.draggedObject;
	var draggedPlayerCard = players.getCardFromDraggedObject(draggedObject);
	var draggedCardPlayerObject = players.getCardObjectFromDraggedObject(this.deck.cardAddedTo(draggedPlayerCard));
	var draggedCardPlayerSlotIndex = players.getCardSlotIndexFromDraggedObject(draggedObject);

	this._processCardFromPlayerRemoval(draggedPlayerCard);

	if (dropPlayerCards[dropCardPlayerSlotIndex] !== null) {
		this._processCardFromPlayerRemoval(dropPlayerCard);
		this._processPlayerActivation(draggedCardPlayerObject);
		this._replaceNullSlotsActiveObject(draggedCardPlayerSlotIndex);
		this._processCardAddition(dropPlayerCard);
		this._returnNullSlotsActiveObject();
	}

	this._processPlayerActivation(dropCardPlayerObject);
	this._replaceNullSlotsActiveObject(dropCardPlayerSlotIndex);
	this._processCardAddition(draggedPlayerCard);
	this._returnNullSlotsActiveObject();

};

Controller.prototype._processDraggedObjectDrop = function () {

	this.board.cardBeingDragged = false;
	this.players.cardBeingDragged = false;

	this._removeBordersFromFullSlots();

	var draggedObject = this.dragDrop.draggedObject;
	var dropObject = this.dragDrop.dropObject;
	var draggedObjectType = this.dragDrop.getDraggedObjectType(draggedObject);
	var dropObjectType = this.dragDrop.getDropObjectType(dropObject);

	switch (dropObjectType) {
		case null:
			if (draggedObjectType === constants.dragDrop.boardSlotName) {
				this._processBoardToEmptyDragDrop();
			}
			else if (draggedObjectType === constants.dragDrop.playerSlotName) {
				this._processPlayerToEmptyDragDrop();
			}
			break;
		case constants.dragDrop.boardSlotName:
			if (draggedObjectType === constants.dragDrop.boardSlotName) {
				this._processBoardToBoardDragDrop();
			}
			else if (draggedObjectType === constants.dragDrop.playerSlotName) {
				this._processPlayerToBoardDragDrop();
			}
			break;
		case constants.dragDrop.playerSlotName:
			if (draggedObjectType === constants.dragDrop.boardSlotName) {
				this._processBoardToPlayerDragDrop();
			}
			else if (draggedObjectType === constants.dragDrop.playerSlotName) {
				this._processPlayerToPlayerDragDrop();
			}
			break;
		default:
			throw new Error(this.errors.dropObjectNotFound);
	}

};

Controller.prototype.initiate = function () {

	this.events = eventManager.CreateEventManager();
	this.activeObject = this.board.boardNumber;

	this.deck.reset();
	this.board.reset();
	this.players.reset();
	this.toolbar.reset();
	this.dragDrop.reset();
	this.playerEquityCalculator.reset();

	this.manageEvents();

};

Controller.prototype.manageEvents = function () {

	var controller = this;
	var deck = this.deck;
	var board = this.board;
	var players = this.players;
	var toolbar = this.toolbar;
	var dragDrop = this.dragDrop;
	var playerEquityCalculator = this.playerEquityCalculator;

	deck.events.on(constants.eventsUI.deckSlotClick, function (deck, card) {

		controller._processCardAdditionAndRemoval(card);

	});

	board.events.on(constants.eventsUI.boardClick, function () {

		controller._processBoardActivation();

	});

	board.events.on(constants.eventsUI.boardSlotClick, function (board, card) {

		if (card !== null) {
			controller._processCardFromBoardRemoval(card);
		}

	});

	board.events.on(constants.eventsUI.cardReadyToDrag, function (board, parameters) {

		controller._processCardDrag(parameters);

	});

	players.events.on(constants.eventsUI.playerClick, function (players, playerObject) {

		controller._processPlayerActivation(playerObject);

	});

	players.events.on(constants.eventsUI.playerObjectNameClick, function (players, $playerObject) {

		controller._processPlayerRemoval($playerObject);

	});

	players.events.on(constants.eventsUI.playerSlotClick, function (players, card) {

		if (card !== null) {
			controller._processCardFromPlayerRemoval(card);
		}

	});

	players.events.on(constants.eventsUI.cardReadyToDrag, function (players, parameters) {

		controller._processCardDrag(parameters);

	});

	toolbar.events.on(constants.eventsUI.newPlayersButtonClick, function (toolbar, numberOfPlayers) {

		if (confirm(controller.messages.resetPlayersConfirmation)) {
			controller._processMultiplePlayersGeneration(numberOfPlayers);
		}

	});

	toolbar.events.on(constants.eventsUI.newPlayerButtonClick, function () {

		var playerNumber = players._getLowestOfGamePlayerNumber();
		if (playerNumber <= constants.holdemProperties.maxNumberOfPlayers) {
			controller._processNewPlayerGeneration();
		}

	});

	toolbar.events.on(constants.eventsUI.resetBoardButtonClick, function () {

		if (confirm(controller.messages.resetBoardConfirmation)) {
			controller._processResettingBoard();
		}

	});

	toolbar.events.on(constants.eventsUI.resetButtonClick, function () {

		if (confirm(controller.messages.resetConfirmation)) {
			controller.initiate();
		}

	});

	toolbar.events.on(constants.eventsUI.compareHandsButtonClick, function () {
		debugger;

		var boardValid = board.validateBoard();

		if (!boardValid) {
			alert(controller.errors.invalidBoard);
			return;
		}

		var boardCards = board.cards;
		var playerCards = players.getPlayersWithTwoCards(players.playerCards);

		playerEquityCalculator.resetWinFrequencies();
		var boardNullIndices = board.getNullSlotIndices();

		if (boardNullIndices.length > 0) {
			playerEquityCalculator.numberRandomDrawsFromDeck = constants.equityCalculator.numberOfRandomDrawsFromDeck;
		}
		else {
			playerEquityCalculator.numberRandomDrawsFromDeck = 1;
		}

		for (var k = 1; k <= playerEquityCalculator.numberRandomDrawsFromDeck; k++) {

			var drawnRandomCards = [];
			for (var i = 0; i < boardNullIndices.length; i++) {
				var randomCard = deck.drawRandomCardFromDeck();
				drawnRandomCards.push(randomCard);
				boardCards[boardNullIndices[i]] = randomCard;
			}

			playerEquityCalculator.updatePlayersWinFrequencies(boardCards, playerCards);


			for (var l = 0; l < boardNullIndices.length; l++) {
				var card = boardCards[boardNullIndices[l]];
				var cardState = deck.cardStateObject[card.rank + constants.html.rankSuitDividerDeck + card.suit];
				cardState.selected = false;
				cardState.addedTo = null;
				boardCards[boardNullIndices[l]] = null
			}
		}

		playerEquityCalculator.convertWinFrequenciesDecimalToPercentage();

		players.unmarkInGameWinnerPlayers();
		players.markWinnerPlayers(playerEquityCalculator.playersWinFrequencies);

	});

	dragDrop.events.on(constants.eventsUI.enteredDropZone, function (dragDrop, dropObject) {

		controller._processDropObjectHighlight(dropObject);

	});

	dragDrop.events.on(constants.eventsUI.leftDropZone, function (dragDrop, dropObject) {

		controller._processDropObjectHighlightRemoval(dropObject);

	});

	dragDrop.events.on(constants.eventsUI.draggedObjectDropped, function () {

		controller._processDraggedObjectDrop();

	});

};

exports.CreateController = function () {
	return new Controller()
};