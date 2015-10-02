function Constants() {

	this.ranksNumToTxtDictionary = {
		'2': '2',
		'3': '3',
		'4': '4',
		'5': '5',
		'6': '6',
		'7': '7',
		'8': '8',
		'9': '9',
		'10': '10',
		'11': 'jack',
		'12': 'queen',
		'13': 'king',
		'14': 'ace'
	};

	this.suitsNumToTxtDictionary = {
		'1': 'clubs',
		'2': 'diamonds',
		'3': 'hearts',
		'4': 'spades'
	};

	this.ranksNumToNameDictionary = {
		'2': 'deuce',
		'3': 'trey',
		'4': 'four',
		'5': 'five',
		'6': 'six',
		'7': 'seven',
		'8': 'eight',
		'9': 'nine',
		'10': 'ten',
		'11': 'jack',
		'12': 'queen',
		'13': 'king',
		'14': 'ace'
	};

	this.suitsNumToNameDictionary = {
		'1': 'clubs',
		'2': 'diamonds',
		'3': 'hearts',
		'4': 'spades'
	};

	this.slotsNumToNameDictionary = {
		'1': 'first',
		'2': 'second',
		'3': 'third',
		'4': 'fourth',
		'5': 'fifth',
		'6': 'sixth',
		'7': 'seventh',
		'8': 'eighth',
		'9': 'ninth'
	};

	this.ranksNameToIndexDictionary = {
		'deuce': 0,
		'trey': 1,
		'four': 2,
		'five': 3,
		'six': 4,
		'seven': 5,
		'eight': 6,
		'nine': 7,
		'ten': 8,
		'jack': 9,
		'queen': 10,
		'king': 11,
		'ace': 12
	};

	this.suitsNameToIndexDictionary = {
		'clubs': 0,
		'diamonds': 1,
		'hearts': 2,
		'spades': 3
	};

	this.eventsUI = {
		'playerClick': 'player-click',
		'playerObjectNameClick': 'player-object-name-click',
		'boardClick': 'board-click',
		'deckSlotClick': 'deck-slot-click',
		'boardSlotClick': 'board-slot-click',
		'playerSlotClick': 'player-slot-click',
		'newPlayerButtonClick': 'new-player-button-click',
		'newPlayersButtonClick': 'new-players-button-click',
		'compareHandsButtonClick': 'compare-hands-button-click',
		'resetBoardButtonClick': 'reset-board-button-click',
		'resetButtonClick': 'reset-button-click',
		'cardReadyToDrag': 'card-ready-to-drag',
		'enteredDropZone': 'entered-drop-zone',
		'leftDropZone': 'left-drop-zone',
		'draggedObjectDropped': 'dragged-object-dropped'
	};

	this.buttons = {
		compareHandsButtonWrapperClass: 'compare-hands-button-wrapper',
		compareHandsButtonClass: 'compare-hands-button',
		compareHandsButtonName: 'Compare hands',
		newPlayerButtonWrapperClass: 'new-player-button-wrapper',
		newPlayerButtonClass: 'new-player-button',
		newPlayerButtonName: 'New player',
		resetButtonWrapperClass: 'reset-button-wrapper',
		resetButtonClass: 'reset-button',
		resetButtonName: 'Reset',
		newPlayersButtonWrapperClass: 'new-players-button-wrapper',
		newPlayersButtonClass: 'new-players-button',
		newPlayersButtonName: 'Generate new players',
		newPlayersDropdownWrapperClass: 'new-player-dropdown-wrapper',
		resetBoardButtonWrapperClass: 'reset-board-button-wrapper',
		resetBoardButtonClass: 'reset-board-button',
		resetBoardButtonName: 'Reset board',
		buttonClass: 'button'
	};

	this.interfaceClasses = {
		interfaceContainer: 'main',
		deckWrapperClass: 'deck-wrapper',
		deckTableClass: 'deck-table',
		deckSlotClass: 'deck-slot',
		boardWrapperClass: 'board-wrapper',
		boardCardSlotClass: 'board-slot',
		boardClass: 'board',
		boardNameClass: 'board-name',
		boardImageClass: 'board-image',
		playerWrapperClass: 'player',
		playerCardSlotClass: 'player-slot',
		playerNameClass: 'player-name',
		playerImageClass: 'player-image',
		slotClass: 'slot',
		slotImageContainerClass: 'image-container',
		draggableObjectClass: 'draggable-object'
	};

	this.dragDrop = {
		boardSlotName: 'board slot',
		playerSlotName: 'player slot',
		unknownDropObjectType: 'unknown',
		boardObject: 'board',
		playersObject: 'player',
		tempNullReplacement: ''
	};

	this.jQueryEvents = {
		leftMouseClick: 1,
		middleMouseClick: 2
	};

	this.html = {
		imgTag: 'img',
		pTag: 'p',
		selectTag: 'select',
		boardName: 'Board',
		playerPrefix: 'player-',
		playerName: 'Player',
		slotPrefix: 'slot-',
		imagesPath: 'images/cards/',
		iconsPath: 'images/cardicons/',
		iconImageExtension: '.gif',
		largeCardExtension: '.png',
		rankSuitDividerIImgFiles: '_of_',
		rankSuitDividerDeck: '_',
		deckSuitClassIndex: 0,
		boardSlotNumberClassIndex: 0,
		playerSlotNumberClassIndex: 0,
		playerNumberClassIndex: 1
	};

	this.equityCalculator = {
		numberOfRandomDrawsFromDeck: 10000
	};

	this.cardParameters = {
		firstCardIndex: 0,
		secondCardIndex: 1,
		thirdCardIndex: 2,
		fourthCardIndex: 3,
		fifthCardIndex: 4,
		allRanks: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
		allSuits: [1, 2, 3, 4],
		ranks: 'ranks',
		suits: 'suits'
	};

	this.holdemProperties = {
		fiveHighStraight: [2, 3, 4, 5, 14],
		fiveHighStraightRank: 5,
		fullBoardLength: 5,
		holdemHandLength: 2,
		holdemDeckLength: 52,
		minNumberOfPlayers: 2,
		maxNumberOfPlayers: 9,
		standardPokerHandLength: 5,
		straightFlushRank: 9,
		quadsRank: 8,
		fullHouseRank: 7,
		flushRank: 6,
		straightRank: 5,
		tripsRank: 4,
		twoPairRank: 3,
		pairRank: 2,
		highCardRank: 1
	};

}

exports.constants = new Constants();