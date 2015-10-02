var handStrengthCalculator = require('./hand_strength_calculator').CreateHandStrengthCalculator();
var constants = require('./../constants_and_styles/constants').constants;
var eventManager = require('./../event_manager');

Array.prototype.clean = function(deleteValue) {

	for (var i=0; i<this.length; i++) {
		if (this[i] == deleteValue) {
			this.splice(i, 1);
			i--;
		}
	}

	return this;

};

function PlayerEquityCalculator() {}

PlayerEquityCalculator.prototype._copyHand = function (hand) {

	var copyOfHand = [];

	for (var k = 0; k < hand.length; k++) {
		copyOfHand[k] = hand[k];
	}

	return copyOfHand;

};

PlayerEquityCalculator.prototype._setStrengthHands = function (hand1object,hand2object) {

    var hand1best = handStrengthCalculator.getStrongestHand(hand1object.cards);
    var hand2best = handStrengthCalculator.getStrongestHand(hand2object.cards);

    if (hand1best.rank > hand2best.rank) {
        hand1object.strength.best = true;
        hand2object.strength.best = false;
        return hand1object;
    }

    if (hand1best.rank < hand2best.rank) {
        hand1object.strength.best = false;
        hand2object.strength.best = true;
        return hand2object;
    }

    return this._setStrengthForEqualRanks(hand1object,hand2object);

};

PlayerEquityCalculator.prototype._setStrengthForEqualRanks = function (hand1object,hand2object) {

	var hand1best = handStrengthCalculator.getStrongestHand(hand1object.cards);
	var hand2best = handStrengthCalculator.getStrongestHand(hand2object.cards);

	var hand1parameters = hand1best.parameters;
	var hand2parameters = hand2best.parameters;

	for (var k=0; k<hand1parameters.length; k++) {
		if (hand1parameters[k] > hand2parameters[k]) {
			hand1object.strength.best = true;
			hand2object.strength.best = false;
			return hand1object;
		}
		if (hand2parameters[k] > hand1parameters[k]) {
			hand1object.strength.best = false;
			hand2object.strength.best = true;
			return hand2object;
		}
	}

	hand2object.strength = hand1object.strength;
	hand1object.strength.best = true;
	return hand2object;

};

PlayerEquityCalculator.prototype.reset = function() {

	this.events = eventManager.CreateEventManager();

	this.playersWinFrequencies = {
		1: 0,
		2: 0,
		3: 0,
		4: 0,
		5: 0,
		6: 0,
		7: 0,
		8: 0,
		9: 0
	};

	this.numberRandomDrawsFromDeck = constants.equityCalculator.numberOfRandomDrawsFromDeck;

};

PlayerEquityCalculator.prototype.allPlayersBestHandsWithBoard = function(board, playerCards) {

	//takes board and array consisting of 2-card arrays (hands of 2+ players), returns an array containing the best
	//possible combination for each player

	var playerBestHands = [];
	for (var player in playerCards) {
		if (playerCards.hasOwnProperty(player)) {
			playerBestHands.push(this.playerBestHandWithBoard(board, playerCards[player], player));
		}
	}

	return playerBestHands;

};

PlayerEquityCalculator.prototype.playerBestHandWithBoard = function(board, playerCards, player) {

	//gets board and player 2-card hand as input, returns the best of all combinations

	var comboInd = 0;
	var cards;
	var boardPart;

	//when no card is used
	var allPossibleCombinations = [board];

	//when only one card is used
	for (var i=0; i<playerCards.length; i++) {
		for (var j=0; j<board.length; j++) {
			cards = [playerCards[i]];
			boardPart = this._copyHand(board);
			boardPart.splice(j,1);
			cards = cards.concat(boardPart);
			comboInd++;
			allPossibleCombinations[comboInd] = cards;
		}
	}

	//when both cards are used
	for (i=0; i<board.length-1; i++) {
		for (j=i+1; j<board.length; j++) {
			cards = playerCards;
			boardPart = this._copyHand(board);
			delete boardPart[i];
			delete boardPart[j];
			boardPart.clean(undefined);
			cards = cards.concat(boardPart);
			comboInd++;
			allPossibleCombinations[comboInd] = cards;
		}
	}

	var bestHandIndices = this.compareFiveCardHands.apply(this, allPossibleCombinations);
	var bestHandObject = {
		player: player,
		cards: allPossibleCombinations[bestHandIndices[0]]
	};

	return bestHandObject;

};

PlayerEquityCalculator.prototype.winnerHandIndices = function() {

	var playerHands = arguments;

	var playerCards = [];
	for (var k=0; k<playerHands.length; k++) {
		playerCards[k] = playerHands[k].cards;
	}

	var bestHandIndices = this.compareFiveCardHands.apply(this, playerCards);

	return bestHandIndices;

};

PlayerEquityCalculator.prototype.compareFiveCardHands = function () {

	//takes arbitrary number of arrays of 5 cards, returns the best ones

	var hands = {};
	for (var handInd=0; handInd<arguments.length; handInd++) {
		hands[handInd] = {
			cards: arguments[handInd],
			strength: {best: false}
		};
	}

	var hand1object, hand2object, bestHandObject;
	for (handInd=1; handInd<arguments.length; handInd++) {
		hand1object = bestHandObject ? bestHandObject : hands[0];
		hand2object = hands[handInd];
		bestHandObject = this._setStrengthHands(hand1object,hand2object);
	}

	var bestHandIndices = [];
	for (handInd in hands) {
		if (hands.hasOwnProperty(handInd) && hands[handInd].strength.best) {
			bestHandIndices.push(parseInt(handInd));
		}
	}

	return bestHandIndices;

};



PlayerEquityCalculator.prototype.getPlayerEquities = function(winnerPlayers) {




	var numberOfWinnerPlayers = winnerPlayers.length;
    var playerEquities = {};
    for (var j=0; j<numberOfWinnerPlayers; j++) {
        var playerNumber = winnerPlayers[j];
        playerEquities[playerNumber] = 1/numberOfWinnerPlayers;
    }

    return playerEquities;

};

PlayerEquityCalculator.prototype.getWinnerPlayerNumbers = function(board, playerCards) {

	var allPlayerBestHands = this.allPlayersBestHandsWithBoard(board, playerCards);
	var winnerBestHandIndices = this.winnerHandIndices.apply(this, allPlayerBestHands);
	var playerNumbers = Object.keys(playerCards);

	var winnerPlayers = [];
	for (var k=0; k<winnerBestHandIndices.length; k++) {
		var winnerPlayer = playerNumbers[winnerBestHandIndices[k]];
		winnerPlayers.push(winnerPlayer);
	}

	return winnerPlayers;

};

PlayerEquityCalculator.prototype.resetWinFrequencies = function() {

	this.playersWinFrequencies = {
		1: 0,
		2: 0,
		3: 0,
		4: 0,
		5: 0,
		6: 0,
		7: 0,
		8: 0,
		9: 0
	};

};

PlayerEquityCalculator.prototype.convertWinFrequenciesDecimalToPercentage = function() {

	for (var playerNumber in this.playersWinFrequencies) {
		if (this.playersWinFrequencies.hasOwnProperty(playerNumber)) {
			var playerWinFrequency = this.playersWinFrequencies[playerNumber];
			if (playerWinFrequency > 0) {
				var playerWinPercentage = Math.round((playerWinFrequency+0.000001)*10000)/100;
				this.playersWinFrequencies[playerNumber] = playerWinPercentage;
			}
		}
	}

};

PlayerEquityCalculator.prototype.updatePlayersWinFrequencies = function(boardCards, playerCards) {

	var playersWinFrequencies = this.playersWinFrequencies;
	var winnerPlayerNumbers = this.getWinnerPlayerNumbers(boardCards, playerCards);

	for (var m=0; m<winnerPlayerNumbers.length; m++) {
		var playerWinFrequency = playersWinFrequencies[winnerPlayerNumbers[m]];
		playerWinFrequency = playerWinFrequency + 1/this.numberRandomDrawsFromDeck;
		playersWinFrequencies[winnerPlayerNumbers[m]] = playerWinFrequency;
	}

};

exports.CreatePlayerEquityCalculator = function() {return new PlayerEquityCalculator()};