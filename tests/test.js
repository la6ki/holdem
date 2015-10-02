var assert = require("assert");
var should = require('should');

var cons = require('../scripts/constants_and_styles/constants');
var constants = cons.CreateConstants();

var event_manager = require('../scripts/event_manager');
var dealer = require('../scripts/game/dealer').CreateDealer();
var handStrengthCalculator = require('../scripts/game/hand_strength_calculator').CreateHandStrengthCalculator();

var ERRORS = {
    nonExistentEvent: 'Event does not exist.'
};

var generateSequentialIntegers = function (firstInteger, sequenceLength) {
    var integers = [];
    for (var i = firstInteger; i < firstInteger + sequenceLength; i++) {
        integers.push(i);
    }

    return integers;
};

describe('Test event manager', function () {


    describe('Test on method', function () {

        it('Event handler should exist for the corresponding event in events object', function () {
            var testVar = 'not set';

            var eventManager1 = event_manager.CreateEventManager();
            eventManager1.on('event1', function () {
                testVar = 'set';
            });
            eventManager1.eventsHash['event1'][1]();

            testVar.should.equal('set');
        });

    });


    describe('Test un method', function () {

        it('Should throw error if event to be removed does not exist', function () {
            var eventManager2 = event_manager.CreateEventManager();
            (function () {
                eventManager2.un({event: 'event1', key: 1})
            }).should.throw(ERRORS.nonExistentEvent);
        });

        it('Added event handler should be removed after applying the .un method', function () {
            var eventManager2 = event_manager.CreateEventManager();
            var event1Key1 = eventManager2.on('event1', function () {
            });
            var handler = eventManager2.eventsHash.event1[0] ? true : false;
            handler.should.be.ok;
            eventManager2.un(event1Key1);
            handler = eventManager2.eventsHash.event1[0] ? true : false;
            handler.should.not.be.ok;
        });

    });


    describe('Test fire method', function () {

        it('All handlers to an event should be executed', function () {
            var eventManager3 = event_manager.CreateEventManager();

            (function () {
                eventManager3.fire('event1')
            }).should.throw(ERRORS.nonExistentEvent);
        });

        it('All handlers to an event should be executed', function () {
            var eventManager3 = event_manager.CreateEventManager();
            var testVar = 0;

            eventManager3.on('event1', function () {
                testVar++;
            });
            eventManager3.on('event1', function () {
                testVar++;
            });
            eventManager3.on('event1', function () {
                testVar++;
            });

            eventManager3.fire('event1');

            testVar.should.equal(3);
        });

    });

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

describe('Test dealer', function () {

        var generateRandomNumberOfPlayerObjects = function () {

            dealer.numberOfPlayers = Math.floor(constants.holdemProperties.minNumberOfPlayers + (constants.holdemProperties.maxNumberOfPlayers - 1) * Math.random());
            dealer.handState = {};
            dealer.playerObjects = {};
            dealer.bigBlindInDollars = 1;
            dealer.generatePlayerObjects();

        };

        var generateDeck = function () {

            dealer.handState = {};
            dealer.deck = dealer.generateDeckAndCardStatesObjects(false);
            dealer.handState.cardStates = dealer.generateDeckAndCardStatesObjects(true);

        };

        describe('Test new player object generation', function () {

            it('Should generate the same number of player objects as dealer.numberOfPlayers', function () {
                var numberOfTests = 1000;

                for (var k = 1; k <= numberOfTests; k++) {
                    generateRandomNumberOfPlayerObjects();

                    var playerObjects = dealer.playerObjects;
                    var numberOfPlayerObjects = Object.keys(playerObjects).length;

                    numberOfPlayerObjects.should.equal(dealer.numberOfPlayers);
                }
            });

            it('Should generate each player with specific properties', function () {
                var numberOfTests = 1000;

                for (var k = 1; k <= numberOfTests; k++) {
                    generateRandomNumberOfPlayerObjects();

                    var playerObjects = dealer.playerObjects;
                    var playerNumbers = Object.keys(playerObjects);
                    var playerNumbersShould = generateSequentialIntegers(1, dealer.numberOfPlayers);

                    for (var j = 0; j < playerNumbers.length; j++) {
                        playerObjects[playerNumbers[j]].playerNumber.should.equal(playerNumbersShould[j]);
                        assert.equal(null, playerObjects[playerNumbers[j]].cards[0]);
                        assert.equal(null, playerObjects[playerNumbers[j]].cards[1]);
                        playerObjects[playerNumbers[j]].stack.should.equal(constants.STANDARD_GAME_BB * dealer.bigBlindInDollars);
                        playerObjects[playerNumbers[j]].totalBetCurrentRound.should.equal(0);
                        assert.equal(null, playerObjects[playerNumbers[j]].currentAction);
                    }
                }
            });

        });

        describe('Test player bet, call, and raise', function () {

            it('Stack should be reduced and current round bet should be increased by amount placed', function () {
                generateRandomNumberOfPlayerObjects();
                var amount = 1;

                dealer.bigBlindInDollars = 1;
                dealer.playerObjects = {};
                dealer.generatePlayerObjects();

                var playerObject = dealer.playerObjects[1];
                var stack = playerObject.stack;
                var totalBetCurrentRound = playerObject.totalBetCurrentRound;

                dealer.playerBetCallRaise(playerObject, amount);

                playerObject.stack.should.equal(stack - amount);
                playerObject.totalBetCurrentRound.should.equal(totalBetCurrentRound + amount);
            });

        });

        describe('Test dealing cards', function () {

            it('Should deal cards to board on all betting rounds', function () {
                generateDeck();

                dealer.board = [null, null, null, null, null];

                var board = dealer.board;
                var bettingRounds = ['flop', 'turn', 'river'];

                for (var k = 0; k < bettingRounds.length; k++) {
                    dealer.handState.currentBettingRound = bettingRounds[k];
                    dealer.dealCardsToBoard();

                    for (var j = 0; j < bettingRounds.length + k; j++) {
                        assert.equal(true, board[j] !== null);
                    }

                    for (var i = bettingRounds.length + k; i < board.length; i++) {
                        assert.equal(board[i], null);
                    }
                }
            });

            it('Should deal cards to all in-game players', function () {
                var numberOfTests = 100;

                var bettingRounds = constants.BETTING_ROUNDS;
                var bettingRoundsArray = Object.keys(bettingRounds);
                var preflopCardsDealt = [true, false];

                for (var k = 1; k <= numberOfTests; k++) {
                    generateRandomNumberOfPlayerObjects();
                    generateDeck();
                    dealer.firstHandOfGame = true;

                    var bettingRoundInd = Math.floor(Math.random()*bettingRoundsArray.length);
                    dealer.handState.currentBettingRound = bettingRoundsArray[bettingRoundInd];

                    var preflopCardsDealtInd = Math.floor(Math.random()*preflopCardsDealt.length);
                    dealer.preflopCardsDealt = preflopCardsDealt[preflopCardsDealtInd];

                    dealer.setCurrentButtonPlayerNumber();
                    dealer.setFirstAndLastPlayerNumbers();
                    dealer.dealPlayerCards();

                    for (var playerNumber in dealer.playerObjects) {
                        if (dealer.playerObjects.hasOwnProperty(playerNumber)) {
                            var playerObject = dealer.playerObjects[playerNumber];
                            var playerCards = playerObject.cards;
                            for (var j = 0; j < playerCards.length; j++) {
                                assert(playerCards[j] !== null);
                            }
                        }
                    }
                }
            });

        });

        describe('Test deck', function () {

            it('Should consist of 52 cards', function () {
                var deck = dealer.generateDeckAndCardStatesObjects(false);
                var numberOfCards = Object.keys(deck).length;

                numberOfCards.should.equal(constants.holdemProperties.holdemDeckLength);
            });

            it('Each card should be drawn from the deck with equal probability', function () {
                var numberOfRandomDraws = 10000, cardCountPerDeckLength = {};
                for (var k = 1; k <= numberOfRandomDraws; k++) {
                    generateDeck();

                    var card = dealer.drawRandomCardFromDeck();
                    var cardName = card.rank + constants.RANK_SUIT_DIVIDER_DECK + card.suit;
                    cardCountPerDeckLength[cardName] = cardCountPerDeckLength[cardName] ?
                    cardCountPerDeckLength[cardName] + 1 / constants.holdemProperties.holdemDeckLength : 1 / constants.holdemProperties.holdemDeckLength;
                }

                var minCardPerDeckLengthCount = Math.floor(numberOfRandomDraws / Math.pow(constants.holdemProperties.holdemDeckLength, 2));

                for (var cardName in cardCountPerDeckLength) {
                    if (cardCountPerDeckLength.hasOwnProperty(cardName)) {
                        var cardCountPerDeckLengthRounded = Math.round(cardCountPerDeckLength[cardName]);
                        cardCountPerDeckLengthRounded.should.not.be.below(minCardPerDeckLengthCount);
                    }
                }
            });

            it('Should not have duplicate cards', function () {
                generateDeck();

                var drawnCards = [];
                for (var k = 1; k <= constants.holdemProperties.holdemDeckLength; k++) {
                    var card = dealer.drawRandomCardFromDeck();

                    for (var j = 0; j < drawnCards.length; j++) {
                        var drawnCard = drawnCards[j];
                        var sameCard = card.rank === drawnCard.rank && card.suit === drawnCard.suit;
                        sameCard.should.not.equal(true);
                    }

                    drawnCards.push(card);
                }
            });

        });

        describe('Test player role assignment', function() {

            it('Should assign proper roles for all possible number of players', function() {
                var numberOfTests = 100;

                for (var k=1; k<=numberOfTests; k++) {
                    generateRandomNumberOfPlayerObjects();
                    dealer.firstHandOfGame = true;
                    dealer.assignRolesToPlayers();

                    var numberOfPlayers = dealer.numberOfPlayers;
                    var testRoles = constants.PLAYER_ROLES[numberOfPlayers];
                    var testRolesArray = Object.keys(testRoles);

                    var playerRoles = {};
                    for (var playerNumber in dealer.playerObjects) {
                        if (dealer.playerObjects.hasOwnProperty(playerNumber)) {
                            playerRoles[playerNumber] = dealer.playerObjects[playerNumber].role;
                        }
                    }

                    var playerRolesArray = Object.keys(playerRoles);
                    var currentButtonPlayerNumber = dealer.handState.currentButtonPlayerNumber;

                    for (var i=0; i<playerRolesArray.length; i++) {
                        var ind = (i + currentButtonPlayerNumber - 1) % playerRolesArray.length;
                        var playerRole = playerRoles[playerRolesArray[ind]];
                        var testRole = testRoles[testRolesArray[i]];
                        playerRole.should.equal(testRole);
                    }
                }
            });

        });

        describe('Test pre-flop forced bets', function () {

            it('Should take antes from all players', function () {
                dealer.ante = true;
                dealer.bigBlindInDollars = 1;

                var numberOfTests = 100;

                for (var k = 1; k <= numberOfTests; k++) {
                    generateRandomNumberOfPlayerObjects();
                    generateDeck();

                    var numberOfPlayers = dealer.numberOfPlayers;
                    var numberOfIntervals = numberOfPlayers - 1;
                    var anteStep = 1 / numberOfIntervals;
                    var antePercentageOfBB = constants.MAX_ANTE_PERCENTAGE - (constants.MAX_ANTE_PERCENTAGE - constants.MIN_ANTE_PERCENTAGE) * anteStep * (numberOfPlayers - 1);
                    var anteInDollars = antePercentageOfBB * dealer.bigBlindInDollars;

                    dealer.getAntesFromPlayers();

                    for (var playerObject in dealer.playerObjects) {
                        if (dealer.playerObjects.hasOwnProperty(playerObject)) {
                            var anteTaken = dealer.playerObjects[playerObject].totalBetCurrentRound;
                            anteTaken.should.equal(anteInDollars);
                        }
                    }
                }
            });

            it('Should take SB only from appropriate player', function () {
                dealer.ante = true;
                dealer.bigBlindInDollars = 1;
                dealer.firstHandOfGame = true;

                var numberOfTests = 100;

                for (var k = 1; k <= numberOfTests; k++) {
                    generateRandomNumberOfPlayerObjects();
                    generateDeck();
                    dealer.setCurrentButtonPlayerNumber();
                    dealer.getSmallBlindFromPlayers();

                    var playerAtSB;
                    if (dealer.numberOfPlayers === constants.holdemProperties.minNumberOfPlayers) {
                        playerAtSB = dealer.handState.currentButtonPlayerNumber;
                    }
                    else {
                        playerAtSB = dealer.getPlayerNumberNseatsAway(dealer.handState.currentButtonPlayerNumber, 1);
                    }

                    for (var playerObject in dealer.playerObjects) {
                        if (dealer.playerObjects.hasOwnProperty(playerObject)) {
                            var SBTaken = dealer.playerObjects[playerObject].totalBetCurrentRound;
                            if (dealer.playerObjects[playerObject].playerNumber === playerAtSB) {
                                SBTaken.should.equal(dealer.bigBlindInDollars / 2);
                            }
                            else {
                                SBTaken.should.equal(0);
                            }
                        }
                    }
                }
            });

        });


    }
)
;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

describe('Test getting value of a 5-card hand', function () {


    describe('Test with straight flush hands', function () {

        var numberOfTests = 10000;

        Array.prototype.max = function (array) {
            return Math.max.apply(Math, array);
        };

        var shuffle = function (array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        };

        var getRanksFromCardsArray = function (cards) {
            var cardRanks = [];
            for (var m = 0; m < cards.length; m++) {
                cardRanks.push(cards[m].rank);
            }

            return cardRanks;
        };

        var generateRandomStraightHand = function () {
            var randNumBetween1and10 = Math.floor(1 + 10 * Math.random());

            var cardRanks;
            if (randNumBetween1and10 === 1) {
                cardRanks = shuffle(constants.holdemProperties.fiveHighStraight);
            }
            else {
                cardRanks = shuffle(generateSequentialIntegers(randNumBetween1and10, constants.holdemProperties.standardPokerHandLength));
            }

            return cardRanks;
        };

        var generateRandomStraightFlushHand = function () {

            var straightHand = generateRandomStraightHand();

            var cards = [], suit = Math.floor(1 + 4 * Math.random());
            for (var j = 0; j < straightHand.length; j++) {
                var card = {rank: straightHand[j], suit: suit};
                cards.push(card);
            }

            return cards;

        };

        it('Should return an object with property "rank": 9 and property parameter equal to the highest card rank',
            function () {
                for (var l = 1; l <= numberOfTests; l++) {

                    var cards = generateRandomStraightFlushHand();
                    var cardRanks = getRanksFromCardsArray(cards);

                    var highestCardRank;
                    if (handStrengthCalculator.checkIfSameHandInRanks(cardRanks, constants.holdemProperties.fiveHighStraight)) {
                        highestCardRank = constants.holdemProperties.fiveHighStraightRank;
                    }
                    else {
                        highestCardRank = Math.max.apply(Math, cardRanks);
                    }

                    var handStrength = handStrengthCalculator.getStrongestHand(cards);

                    handStrength.rank.should.equal(constants.holdemProperties.straightFlushRank);
                    handStrength.parameters[0].should.equal(highestCardRank);
                }

            });

    });


});
