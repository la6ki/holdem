var constants = require('./../constants_and_styles/constants').constants;

function HandStrengthCalculator() {

	this.checkIfHandFunctions = [
		{
			hand: 'straightFlush',
			fn: this._checkIfStraightFlush
		},

		{
			hand: 'quads',
			fn: this._checkIfQuads
		},

		{
			hand: 'fullHouse',
			fn: this._checkIfFullHouse
		},

		{
			hand: 'flush',
			fn: this._checkIfFlush
		},

		{
			hand: 'straight',
			fn: this._checkIfStraight
		},

		{
			hand: 'trips',
			fn: this._checkIfTrips
		},

		{
			hand: 'twoPair',
			fn: this._checkIfTwoPair
		},

		{
			hand: 'pair',
			fn: this._checkIfPair
		}
	];

}

HandStrengthCalculator.prototype._sortCardRanks = function (cardRanks) {

	return cardRanks.sort(function (a, b) {
		return a - b
	});

};

HandStrengthCalculator.prototype._copyHand = function (hand) {

	var copyOfHand = [];

	for (var k = 0; k < hand.length; k++) {
		copyOfHand[k] = hand[k];
	}

	return copyOfHand;

};

HandStrengthCalculator.prototype._cardsObjToArr = function (cardsAsObj) {

	var cardsAsArrays = {
		ranks: [],
		suits: []
	};

	for (var k = 0; k < cardsAsObj.length; k++) {
		cardsAsArrays.ranks[k] = cardsAsObj[k].rank;
		cardsAsArrays.suits[k] = cardsAsObj[k].suit;
	}

	return cardsAsArrays;

};

HandStrengthCalculator.prototype.checkIfSameHandInRanks = function (hand1, hand2) {

	var copyHand1 = this._copyHand(hand1);
	var copyHand2 = this._copyHand(hand2);

	var sortedHand1 = this._sortCardRanks(copyHand1);
	var sortedHand2 = this._sortCardRanks(copyHand2);

	for (var k = 0; k < sortedHand1.length; k++) {
		if (sortedHand1[k] !== sortedHand2[k]) {
			return false;
		}
	}

	return true;

};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

HandStrengthCalculator.prototype._checkIfStraightFlush = function (sortedCardRanks, cardSuits) {

	return this._checkIfStraight(sortedCardRanks) && this._checkIfFlush(sortedCardRanks, cardSuits);

};

HandStrengthCalculator.prototype._checkIfQuads = function (sortedCardRanks) {

	var quads = true;

	for (var k = constants.cardParameters.firstCardIndex; k < constants.cardParameters.fourthCardIndex; k++) {
		if (sortedCardRanks[k] !== sortedCardRanks[k + 1]) {
			quads = false;
		}
	}

	if (quads) {
		return true;
	}
	else {
		for (k = constants.cardParameters.secondCardIndex; k < constants.cardParameters.fifthCardIndex; k++) {
			if (sortedCardRanks[k] !== sortedCardRanks[k + 1]) {
				return false;
			}
		}
		return true;
	}

};

HandStrengthCalculator.prototype._checkIfFullHouse = function (sortedCardRanks) {

	if (sortedCardRanks[constants.cardParameters.firstCardIndex] === sortedCardRanks[constants.cardParameters.secondCardIndex] &&
		sortedCardRanks[constants.cardParameters.firstCardIndex] === sortedCardRanks[constants.cardParameters.thirdCardIndex] &&
		sortedCardRanks[constants.cardParameters.fourthCardIndex] === sortedCardRanks[constants.cardParameters.fifthCardIndex]) {
		return true;
	}

	if (sortedCardRanks[constants.cardParameters.firstCardIndex] === sortedCardRanks[constants.cardParameters.secondCardIndex] &&
		sortedCardRanks[constants.cardParameters.thirdCardIndex] === sortedCardRanks[constants.cardParameters.fourthCardIndex] &&
		sortedCardRanks[constants.cardParameters.fourthCardIndex] === sortedCardRanks[constants.cardParameters.fifthCardIndex]) {
		return true;
	}

	return false;

};

HandStrengthCalculator.prototype._checkIfFlush = function (sortedCardRanks, cardSuits) {

	for (var k = constants.cardParameters.firstCardIndex; k < constants.cardParameters.fifthCardIndex; k++) {
		if (cardSuits[k] !== cardSuits[k + 1]) {
			return false;
		}
	}

	return true;
};

HandStrengthCalculator.prototype._checkIfStraight = function (sortedCardRanks) {

	if (this.checkIfSameHandInRanks(sortedCardRanks, constants.holdemProperties.fiveHighStraight)) {
		return true;
	}

	for (var k = constants.cardParameters.firstCardIndex; k < constants.cardParameters.fifthCardIndex; k++) {
		if (sortedCardRanks[k + 1] - sortedCardRanks[k] !== 1) {
			return false;
		}
	}

	return true;

};

HandStrengthCalculator.prototype._checkIfTrips = function (sortedCardRanks) {

	if (sortedCardRanks[constants.cardParameters.firstCardIndex] === sortedCardRanks[constants.cardParameters.secondCardIndex] &&
		sortedCardRanks[constants.cardParameters.firstCardIndex] === sortedCardRanks[constants.cardParameters.thirdCardIndex]) {
		return true;
	}

	if (sortedCardRanks[constants.cardParameters.secondCardIndex] === sortedCardRanks[constants.cardParameters.thirdCardIndex] &&
		sortedCardRanks[constants.cardParameters.secondCardIndex] === sortedCardRanks[constants.cardParameters.fourthCardIndex]) {
		return true;
	}

	if (sortedCardRanks[constants.cardParameters.thirdCardIndex] === sortedCardRanks[constants.cardParameters.fourthCardIndex] &&
		sortedCardRanks[constants.cardParameters.thirdCardIndex] === sortedCardRanks[constants.cardParameters.fifthCardIndex]) {
		return true;
	}

	return false;
};

HandStrengthCalculator.prototype._checkIfTwoPair = function (sortedCardRanks) {

	if (sortedCardRanks[constants.cardParameters.firstCardIndex] === sortedCardRanks[constants.cardParameters.secondCardIndex] &&
		sortedCardRanks[constants.cardParameters.thirdCardIndex] === sortedCardRanks[constants.cardParameters.fourthCardIndex]) {
		return true;
	}
	else if (sortedCardRanks[constants.cardParameters.firstCardIndex] === sortedCardRanks[constants.cardParameters.secondCardIndex] &&
		sortedCardRanks[constants.cardParameters.fourthCardIndex] === sortedCardRanks[constants.cardParameters.fifthCardIndex]) {
		return true;
	}
	else if (sortedCardRanks[constants.cardParameters.secondCardIndex] === sortedCardRanks[constants.cardParameters.thirdCardIndex] &&
		sortedCardRanks[constants.cardParameters.fourthCardIndex] === sortedCardRanks[constants.cardParameters.fifthCardIndex]) {
		return true;
	}
	else {
		return false;
	}

};

HandStrengthCalculator.prototype._checkIfPair = function (sortedCardRanks) {

	if (sortedCardRanks[constants.cardParameters.firstCardIndex] === sortedCardRanks[constants.cardParameters.secondCardIndex]) {
		return true;
	}
	else if (sortedCardRanks[constants.cardParameters.secondCardIndex] === sortedCardRanks[constants.cardParameters.thirdCardIndex]) {
		return true;
	}
	else if (sortedCardRanks[constants.cardParameters.thirdCardIndex] === sortedCardRanks[constants.cardParameters.fourthCardIndex]) {
		return true;
	}
	else if (sortedCardRanks[constants.cardParameters.fourthCardIndex] === sortedCardRanks[constants.cardParameters.fifthCardIndex]) {
		return true;
	}
	else {
		return false;
	}

};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

HandStrengthCalculator.prototype._getStraightFlushRank = function (sortedStraightFlush) {

	if (this.checkIfSameHandInRanks(sortedStraightFlush, constants.holdemProperties.fiveHighStraight)) {
		return constants.holdemProperties.holdemProperties.fiveHighStraightRank;
	}

	return sortedStraightFlush[constants.cardParameters.fifthCardIndex];
};

HandStrengthCalculator.prototype._getQuadsRank = function (sortedQuads) {

	if (sortedQuads[constants.cardParameters.firstCardIndex] === sortedQuads[constants.cardParameters.secondCardIndex]) {
		return sortedQuads[constants.cardParameters.firstCardIndex];
	}
	else {
		return sortedQuads[constants.cardParameters.secondCardIndex];
	}

};

HandStrengthCalculator.prototype._getFullHousePairRank = function (sortedFullHouse) {

	if (sortedFullHouse[constants.cardParameters.thirdCardIndex] !== sortedFullHouse[constants.cardParameters.fourthCardIndex]) {
		return sortedFullHouse[constants.cardParameters.fourthCardIndex];
	}
	else {
		return sortedFullHouse[constants.cardParameters.secondCardIndex]
	}

};

HandStrengthCalculator.prototype._getStraightRank = function (sortedStraight) {

	if (this.checkIfSameHandInRanks(sortedStraight, constants.holdemProperties.fiveHighStraight)) {
		return constants.holdemProperties.holdemProperties.fiveHighStraightRank;
	}

	return sortedStraight[constants.cardParameters.fifthCardIndex];

};

HandStrengthCalculator.prototype._getTripsRank = function (sortedTrips) {

	if (sortedTrips[constants.cardParameters.firstCardIndex] === sortedTrips[constants.cardParameters.secondCardIndex]) {
		return sortedTrips[constants.cardParameters.firstCardIndex];
	}

	if (sortedTrips[constants.cardParameters.fourthCardIndex] === sortedTrips[constants.cardParameters.fifthCardIndex]) {
		return sortedTrips[constants.cardParameters.fourthCardIndex];
	}

	return sortedTrips[constants.cardParameters.thirdCardIndex];

};

HandStrengthCalculator.prototype._getTripsKickerRanks = function (sortedTrips) {

	if (sortedTrips[constants.cardParameters.thirdCardIndex] !== sortedTrips[constants.cardParameters.fourthCardIndex]) {
		return [sortedTrips[constants.cardParameters.fourthCardIndex], sortedTrips[constants.cardParameters.fifthCardIndex]];
	}
	else if (sortedTrips[constants.cardParameters.secondCardIndex] !== sortedTrips[constants.cardParameters.thirdCardIndex]) {
		return [sortedTrips[constants.cardParameters.firstCardIndex], sortedTrips[constants.cardParameters.secondCardIndex]];
	}
	else {
		return [sortedTrips[constants.cardParameters.firstCardIndex], sortedTrips[constants.cardParameters.fifthCardIndex]];
	}

};

HandStrengthCalculator.prototype._getTwoPairRanks = function (sortedTwoPair) {

	if (sortedTwoPair[constants.cardParameters.firstCardIndex] === sortedTwoPair[constants.cardParameters.secondCardIndex] &&
		sortedTwoPair[constants.cardParameters.fourthCardIndex] === sortedTwoPair[constants.cardParameters.fifthCardIndex]) {
		return [sortedTwoPair[constants.cardParameters.firstCardIndex], sortedTwoPair[constants.cardParameters.fourthCardIndex]];
	}
	else if (sortedTwoPair[constants.cardParameters.secondCardIndex] === sortedTwoPair[constants.cardParameters.thirdCardIndex] &&
		sortedTwoPair[constants.cardParameters.fourthCardIndex] === sortedTwoPair[constants.cardParameters.fifthCardIndex]) {
		return [sortedTwoPair[constants.cardParameters.secondCardIndex], sortedTwoPair[constants.cardParameters.fourthCardIndex]];
	}
	else if (sortedTwoPair[constants.cardParameters.firstCardIndex] === sortedTwoPair[constants.cardParameters.secondCardIndex] &&
		sortedTwoPair[constants.cardParameters.thirdCardIndex] === sortedTwoPair[constants.cardParameters.fourthCardIndex]) {
		return [sortedTwoPair[constants.cardParameters.firstCardIndex], sortedTwoPair[constants.cardParameters.thirdCardIndex]];
	}

};

HandStrengthCalculator.prototype._getTwoPairKickerRank = function (sortedTwoPair) {

	if (sortedTwoPair[constants.cardParameters.firstCardIndex] === sortedTwoPair[constants.cardParameters.secondCardIndex] &&
		sortedTwoPair[constants.cardParameters.fourthCardIndex] === sortedTwoPair[constants.cardParameters.fifthCardIndex]) {
		return sortedTwoPair[constants.cardParameters.thirdCardIndex];
	}
	else if (sortedTwoPair[constants.cardParameters.secondCardIndex] === sortedTwoPair[constants.cardParameters.thirdCardIndex] &&
		sortedTwoPair[constants.cardParameters.fourthCardIndex] === sortedTwoPair[constants.cardParameters.fifthCardIndex]) {
		return sortedTwoPair[constants.cardParameters.firstCardIndex];
	}
	else if (sortedTwoPair[constants.cardParameters.firstCardIndex] === sortedTwoPair[constants.cardParameters.secondCardIndex] &&
		sortedTwoPair[constants.cardParameters.thirdCardIndex] === sortedTwoPair[constants.cardParameters.fourthCardIndex]) {
		return sortedTwoPair[constants.cardParameters.fifthCardIndex];
	}

};

HandStrengthCalculator.prototype._getPairRank = function (sortedPair) {

	for (var k = constants.cardParameters.firstCardIndex; k < constants.cardParameters.fifthCardIndex; k++) {
		if (sortedPair[k] === sortedPair[k + 1]) {
			return sortedPair[k];
		}
	}

};

HandStrengthCalculator.prototype._getPairKickerRanks = function (sortedPair) {

	if (sortedPair[constants.cardParameters.firstCardIndex] === sortedPair[constants.cardParameters.secondCardIndex]) {
		return [sortedPair[constants.cardParameters.thirdCardIndex], sortedPair[constants.cardParameters.fourthCardIndex],
			sortedPair[constants.cardParameters.fifthCardIndex]];
	}
	else if (sortedPair[constants.cardParameters.secondCardIndex] === sortedPair[constants.cardParameters.thirdCardIndex]) {
		return [sortedPair[constants.cardParameters.firstCardIndex], sortedPair[constants.cardParameters.fourthCardIndex],
			sortedPair[constants.cardParameters.fifthCardIndex]];
	}
	else if (sortedPair[constants.cardParameters.thirdCardIndex] === sortedPair[constants.cardParameters.fourthCardIndex]) {
		return [sortedPair[constants.cardParameters.firstCardIndex], sortedPair[constants.cardParameters.secondCardIndex],
			sortedPair[constants.cardParameters.fifthCardIndex]];
	}
	else if (sortedPair[constants.cardParameters.fourthCardIndex] === sortedPair[constants.cardParameters.fifthCardIndex]) {
		return [sortedPair[constants.cardParameters.firstCardIndex], sortedPair[constants.cardParameters.secondCardIndex],
			sortedPair[constants.cardParameters.thirdCardIndex]];
	}

};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

HandStrengthCalculator.prototype._setMadeHandObject = function (cards) {

	var sortedCardRanks = this._sortCardRanks(this._copyHand(cards[constants.cardParameters.ranks]));
	var cardSuits = cards[constants.cardParameters.suits];

	for (var k=0; k<this.checkIfHandFunctions.length; k++) {
		var handFunction = this.checkIfHandFunctions[k].fn;
		var playerHas = handFunction.call(this, sortedCardRanks, cardSuits);

		if (playerHas) {
			this.madeHandObject[this.checkIfHandFunctions[k].hand] = true;
			return;
		}

	}

	this.madeHandObject.highCard = true;

};

HandStrengthCalculator.prototype._generateStraightFlushObject = function (sortedCardRanks) {

	var straightFlushRank = this._getStraightFlushRank(sortedCardRanks);
	var parameters = [straightFlushRank];

	var straightFlushObject = {
		rank: constants.holdemProperties.straightFlushRank,
		parameters: parameters
	};

	return straightFlushObject;

};

HandStrengthCalculator.prototype._generateQuadsObject = function (sortedCardRanks) {

	var quadsRank = this._getQuadsRank(sortedCardRanks);
	var parameters = [quadsRank];

	var quadsObject = {
		rank: constants.holdemProperties.quadsRank,
		parameters: parameters
	};

	return quadsObject;

};

HandStrengthCalculator.prototype._generateFullHouseObject = function (sortedCardRanks) {

	var tripsRank = sortedCardRanks[constants.cardParameters.thirdCardIndex];
	var pairRank = this._getFullHousePairRank(sortedCardRanks);
	var parameters = [tripsRank, pairRank];

	var fullHouseObject = {
		rank: constants.holdemProperties.fullHouseRank,
		parameters: parameters
	};

	return fullHouseObject;

};

HandStrengthCalculator.prototype._generateFlushObject = function (sortedCardRanks) {

	var kickersRanks = sortedCardRanks;
	var parameters = this._copyHand(kickersRanks).sort(function (a, b) {
		return b - a
	});

	var flushObject = {
		rank: constants.holdemProperties.flushRank,
		parameters: parameters
	};

	return flushObject;

};

HandStrengthCalculator.prototype._generateStraightObject = function (sortedCardRanks) {

	var straightRank = this._getStraightRank(sortedCardRanks);
	var parameters = [straightRank];

	var straightObject = {
		rank: constants.holdemProperties.straightRank,
		parameters: parameters
	};

	return straightObject;

};

HandStrengthCalculator.prototype._generateTripsObject = function (sortedCardRanks) {

	var tripsRank = this._getTripsRank(sortedCardRanks);
	var kickerRanks = this._getTripsKickerRanks(sortedCardRanks);
	var parameters = [tripsRank].concat(this._copyHand(kickerRanks).sort(function (a, b) {
		return b - a
	}));

	var tripsObject = {
		rank: constants.holdemProperties.tripsRank,
		parameters: parameters
	};

	return tripsObject;

};

HandStrengthCalculator.prototype._generateTwoPairObject = function (sortedCardRanks) {

	var pairRanks = this._getTwoPairRanks(sortedCardRanks);
	var kickerRank = this._getTwoPairKickerRank(sortedCardRanks);
	var parameters = this._copyHand(pairRanks).sort(function (a, b) {
		return b - a
	}).concat(kickerRank);

	var twoPairObject = {
		rank: constants.holdemProperties.twoPairRank,
		parameters: parameters
	};

	return twoPairObject;

};

HandStrengthCalculator.prototype._generatePairObject = function (sortedCardRanks) {

	var pairRank = this._getPairRank(sortedCardRanks);
	var kickerRanks = this._getPairKickerRanks(sortedCardRanks);
	var parameters = [pairRank].concat(this._copyHand(kickerRanks).sort(function (a, b) {
		return b - a
	}));

	var pairObject = {
		rank: constants.holdemProperties.pairRank,
		parameters: parameters
	};

	return pairObject;

};

HandStrengthCalculator.prototype._generateHighCardObject = function (sortedCardRanks) {

	var kickerRanks = sortedCardRanks;
	var parameters = this._copyHand(kickerRanks).sort(function (a, b) {
		return b - a
	});

	var highCardObject = {
		rank: constants.holdemProperties.highCardRank,
		parameters: parameters
	};

	return highCardObject;

};

HandStrengthCalculator.prototype._generateHandObject = function (madeHandObject, sortedCardRanks) {

	if (madeHandObject.straightFlush) {
		return this._generateStraightFlushObject(sortedCardRanks);
	}

	if (madeHandObject.quads) {
		return this._generateQuadsObject(sortedCardRanks);
	}

	if (madeHandObject.fullHouse) {
		return this._generateFullHouseObject(sortedCardRanks);
	}

	if (madeHandObject.flush) {
		return this._generateFlushObject(sortedCardRanks);
	}

	if (madeHandObject.straight) {
		return this._generateStraightObject(sortedCardRanks);
	}

	if (madeHandObject.trips) {
		return this._generateTripsObject(sortedCardRanks);
	}

	if (madeHandObject.twoPair) {
		return this._generateTwoPairObject(sortedCardRanks);
	}

	if (madeHandObject.pair) {
		return this._generatePairObject(sortedCardRanks);
	}

	if (madeHandObject.highCard) {
		return this._generateHighCardObject(sortedCardRanks);
	}

};

HandStrengthCalculator.prototype.reset = function () {

	this.madeHandObject = {
		straightFlush: false,
		quads: false,
		fullHouse: false,
		flush: false,
		straight: false,
		trips: false,
		twoPair: false,
		pair: false,
		highCard: false
	};

};

HandStrengthCalculator.prototype.getStrongestHand = function (cards) {

	this.reset();

	var cardsArrayFormat = this._cardsObjToArr(cards);

	this._setMadeHandObject(cardsArrayFormat);
	var sortedCardRanks = this._sortCardRanks(cardsArrayFormat[constants.cardParameters.ranks]);
	var strongestHand = this._generateHandObject(this.madeHandObject, sortedCardRanks);

	return strongestHand;

};

exports.CreateHandStrengthCalculator = function () {
	return new HandStrengthCalculator()
};