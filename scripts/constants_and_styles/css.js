var constants = require('./constants').constants;

var boardAndPlayerColors = {
	0: 'black',
	1: 'red',
	2: 'blue',
	3: 'green',
	4: 'purple',
	5: 'burlywood',
	6: 'orange',
	7: 'magenta',
	8: 'brown',
	9: 'cyan'
};

var locations = {

	'deck': {
		'top': 50,
		'left': 75
	},

	'board': {
		'top': 275,
		'left': 550
	},

	'boardName': {
		'top': -35,
		'left': 150
	},

	'player1': {
		'top': 450,
		'left': 686
	},

	'player2': {
		'top': 400,
		'left': 500
	},

	'player3': {
		'top': 290,
		'left': 355
	},

	'player4': {
		'top': 180,
		'left': 500
	},

	'player5': {
		'top': 127,
		'left': 624
	},

	'player6': {
		'top': 127,
		'left': 747
	},

	'player7': {
		'top': 180,
		'left': 870
	},

	'player8': {
		'top': 290,
		'left': 1020
	},

	'player9': {
		'top': 400,
		'left': 870
	},

	'playerName': {
		'top': -21,
		'left': 24
	},

	'newPlayersButton': {
		'top': 370,
		'left': 75
	},

	'newPlayersDropdown': {
		'top': 373,
		'left': 260
	},

	'newPlayerButton': {
		'top': 420,
		'left': 75
	},

	'compareHandsButton': {
		'top': 50,
		'left': 670
	},

	'resetBoardButton': {
		'top': 380,
		'left': 677
	},

	'resetButton': {
		'top': 470,
		'left': 75
	}

};

var positions = {

	'boardName': 'absolute',
	'boardSlotImg': 'absolute',
	'playerName': 'absolute',
	'playerSlotImg': 'absolute',
	'imageContainer': 'absolute'

};

var displays = {

	'boardSlot': 'inline-block',
	'playerSlot': 'inline-block'

};

var dimensions = {

	'deckSlotImg': {
		'height': 20,
		'width': 15
	},

	'boardSlot': {
		'height': 93,
		'width': 64
	},

	'playerName': {
		'height': 19,
		'width': 50
	},

	'playerSlot': {
		'height': 60,
		'width': 40
	},

	'draggedImg': {
		'height': 60,
		'width': 40
	}

};

var borders = {

	'deckTable': {
		'borderWidth': 1,
		'borderStyle': 'solid',
		'borderColor': 'black'
	},

	'boardSlot': {
		'borderWidth': 1,
		'borderStyle': 'solid',
		'borderColor': 'black'
	},

	'boardSlotWithCard': {
		'border': 'none'
	},

	'playerSlot': {
		'borderWidth': 1,
		'borderStyle': 'solid',
		'borderColor': 'black'
	},

	'playerSlotWithCard': {
		'border': 'none'
	},

	'button': {
		'borderWidth': 2,
		'borderStyle': 'solid',
		'borderColor': 'darkgray'
	}

};

var borderRadiuses = {

	'button': 3

};

var outlines = {

	markedBoard: {
		'outlineWidth': 2,
		'outlineStyle': 'solid',
		'outlineColor': boardAndPlayerColors[0]
	},

	unmarkedBoard: {
		'outline': 'none'
	},

	markedDeckSlot: {
		'outlineWidth': 3,
		'outlineStyle': 'solid',
		'outlineColor': boardAndPlayerColors
	},

	unmarkedDeckSlot: {
		'outline': 'none'
	},

	markedPlayerSlot: {
		'outlineWidth': 2,
		'outlineStyle': 'solid',
		'outlineColor': boardAndPlayerColors
	},

	unmarkedPlayerSlot: {
		'outline': 'none'
	},


	markedPlayer: {
		'outlineWidth': 3,
		'outlineStyle': 'solid',
		'outlineColor': boardAndPlayerColors
	},

    highlightedObject: {
        'outlineWidth': 2,
        'outlineStyle': 'solid',
        'outlineColor': '#0086b3'
    },

    unmarkedPlayer: {
        'outline': 'none'
    }

};

var fontSizes = {

	'boardName': 26,
	'playerName': 12,
	'button': 15

};

var fontWeights = {

	'playerName': 'bold'

};

var fontFamilies = {

	'button': "'Verdana', sans-serif"

};

var colors = {

	'button': '#6A6868'

};

var textAligns = {

	'playerName': 'center',
	'buttonP': 'center'

};

var margins = {

	'boardSlot': {
		'top': 0,
		'right': 10,
		'bottom': 0,
		'left': 0
	},

	'playerSlot': {
		'top': 0,
		'right': 10,
		'bottom': 0,
		'left': 0
	}

};

var paddings = {

	'buttonP': {
		'top': 1,
		'right': 5,
		'bottom': 1,
		'left': 5
	}

};

var backgroundColors = {

	'button': '#E8E8E8'

};

var zIndices = {
	'draggedImg': 1
};

var opacities = {
	'draggedImg': 0.5
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function DeckStyles() {

	this.deckWrapper = {
		"top": locations.deck.top + "px",
		"left": locations.deck.left + "px"
	};

	this.deckTable = {
		"border": borders.deckTable.borderWidth + "px " + borders.deckTable.borderStyle + " " +
        borders.deckTable.borderColor
	};

	this.deckSlot_img = {
		"height": dimensions.deckSlotImg.height + "px",
		"width": dimensions.deckSlotImg.width + "px"
	};

}

var CreateDeckStyles = function () {return new DeckStyles()};
exports.CreateDeckStyles = CreateDeckStyles;


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function BoardStyles() {

	this.boardWrapper = {
		"top": locations.board.top + "px",
		"left": locations.board.left + "px"
	};

	this.boardName = {
		"position": positions.boardName,
		"font-size": fontSizes.boardName + "px",
		"top": locations.boardName.top + "px",
		"left": locations.boardName.left + "px"
	};

	this.boardSlot = {
		"width": dimensions.boardSlot.width + "px",
		"height": dimensions.boardSlot.height + "px",
		"display": displays.boardSlot,
		"margin": margins.boardSlot.top + "px " + margins.boardSlot.right + "px " + margins.boardSlot.bottom + "px "
        + margins.boardSlot.left + "px",
		"border": borders.boardSlot.borderWidth + "px " + borders.boardSlot.borderStyle + " "
        + borders.boardSlot.borderColor
	};

    this.boardImage = {
        "position": positions.imageContainer,
        "width": dimensions.boardSlot.width + "px",
        "height": dimensions.boardSlot.height + "px"
    };

	this.boardSlot_img = {
		"position": positions.boardSlotImg,
		"width": dimensions.boardSlot.width + "px",
		"height": dimensions.boardSlot.height + "px"
	};

	this.boardSlotWithCard = {
		'border': borders.boardSlotWithCard.border
	};

}

var CreateBoardStyles = function () {return new BoardStyles()};
exports.CreateBoardStyles = CreateBoardStyles;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function PlayerStyles() {

	this.playerName = {
		"font-size": fontSizes.playerName + "px",
		"font-weight": fontWeights.playerName,
		"position": positions.playerName,
		"text-align": textAligns.playerName,
		"top": locations.playerName.top + "px",
		"left": locations.playerName.left + "px",
		"width": dimensions.playerName.width + "px",
		"height": dimensions.playerName.height + "px"
	};
	this.setPlayerNameColor = function(playerNumber) {
		this.playerName.color = boardAndPlayerColors[playerNumber];
	};

	this.playerSlot = {
		"width": dimensions.playerSlot.width + "px",
		"height": dimensions.playerSlot.height + "px",
		"display": displays.playerSlot,
		"margin": margins.playerSlot.top + "px " + margins.playerSlot.right + "px " + margins.playerSlot.bottom
        + "px " + margins.playerSlot.left + "px",
		"border": borders.playerSlot.borderWidth + "px " + borders.playerSlot.borderStyle + " " +
        borders.playerSlot.borderColor
	};

    this.playerImage = {
        "position": positions.imageContainer
    };

	this.playerSlot_img = {
		"position": positions.playerSlotImg,
		"width": dimensions.playerSlot.width + "px",
		"height": dimensions.playerSlot.height + "px"
	};

	this.playerSlotWithCard = {
		'border': borders.playerSlotWithCard.border
	};

	this.players = {
		1: {
			"top": locations.player1.top + "px",
			"left": locations.player1.left + "px"
		},

		2: {
			"top": locations.player2.top + "px",
			"left": locations.player2.left + "px"
		},

		3: {
			"top": locations.player3.top + "px",
			"left": locations.player3.left + "px"
		},


		4: {
			"top": locations.player4.top + "px",
			"left": locations.player4.left + "px"
		},


		5: {
			"top": locations.player5.top + "px",
			"left": locations.player5.left + "px"
		},


		6: {
			"top": locations.player6.top + "px",
			"left": locations.player6.left + "px"
		},


		7: {
			"top": locations.player7.top + "px",
			"left": locations.player7.left + "px"
		},


		8: {
			"top": locations.player8.top + "px",
			"left": locations.player8.left + "px"
		},

		9: {
			"top": locations.player9.top + "px",
			"left": locations.player9.left + "px"
		}

	};
}

var CreatePlayerStyles = function () {return new PlayerStyles()};

exports.CreatePlayerStyles = CreatePlayerStyles;


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function ToolStyles() {

	this.newPlayerButtonWrapper = {
		"top": locations.newPlayerButton.top + "px",
		"left": locations.newPlayerButton.left + "px"
	};

	this.newPlayersButtonWrapper = {
		"top": locations.newPlayersButton.top + "px",
		"left": locations.newPlayersButton.left + "px"
	};

	this.newPlayersDropdownWrapper = {
		"top": locations.newPlayersDropdown.top + "px",
		"left": locations.newPlayersDropdown.left + "px"
	};

	this.compareHandsButtonWrapper = {
		"top": locations.compareHandsButton.top + "px",
		"left": locations.compareHandsButton.left + "px"
	};

	this.resetBoardButtonWrapper = {
		"top": locations.resetBoardButton.top + "px",
		"left": locations.resetBoardButton.left + "px"
	};

	this.resetButtonWrapper = {
		"top": locations.resetButton.top + "px",
		"left": locations.resetButton.left + "px"
	};

	this.button = {
		"border-radius": borderRadiuses.button + "px",
		"font-size": fontSizes.button + "px",
		"font-family": fontFamilies.button,
		"color": colors.button,
		"background-color": backgroundColors.button,
		"border": borders.button.borderWidth + "px " + borders.button.borderStyle + " " + borders.button.borderColor
	};

	this.button_p = {
		"text-align": textAligns.buttonP,
		"padding": paddings.buttonP.top + "px " + paddings.buttonP.right + "px " + paddings.buttonP.bottom + "px "
        + paddings.buttonP.left + "px"
	};
}

var CreateToolStyles = function () {return new ToolStyles()};
exports.CreateToolStyles = CreateToolStyles;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function DynamicStyles() {

	this.markedBoard = {
		"outline": outlines.markedBoard.outlineWidth + "px " + outlines.markedBoard.outlineStyle + " "
        + outlines.markedBoard.outlineColor
	};

	this.unmarkedBoard = {
		"outline": outlines.unmarkedBoard.outline
	};

	this.markedDeckSlot = {};
	this.setMarkedDeckSlot = function(playerNumber) {
		this.markedDeckSlot.outline  = outlines.markedDeckSlot.outlineWidth + "px "
            + outlines.markedDeckSlot.outlineStyle + " " + outlines.markedDeckSlot.outlineColor[playerNumber];
	};

	this.unmarkedDeckSlot = {
		"outline": outlines.unmarkedDeckSlot.outline
	};

	this.markedPlayerSlot = {};
	this.setMarkedPlayerSlot = function(playerNumber) {
		this.markedPlayerSlot.outline  = outlines.markedPlayerSlot.outlineWidth + "px "
            + outlines.markedPlayerSlot.outlineStyle + " " + outlines.markedPlayerSlot.outlineColor[playerNumber];
	};

	this.unmarkedPlayerSlot = {
		"outline": outlines.unmarkedPlayerSlot.outline
	};

	this.markedPlayer = {};
	this.setMarkedPlayer = function(playerNumber) {
		this.markedPlayer.outline  = outlines.markedPlayer.outlineWidth + "px "
            + outlines.markedPlayer.outlineStyle + " " + outlines.markedPlayer.outlineColor[playerNumber];
	};

	this.unmarkedPlayer = {
		"outline": outlines.unmarkedPlayer.outline
	};

	this.draggedImg = {
		"height": dimensions.draggedImg.height + "px",
		"width": dimensions.draggedImg.width + "px",
		"z-index": zIndices.draggedImg,
		"opacity": opacities.draggedImg
	};

    this.highlightedObject = {
        "outline": outlines.highlightedObject.outlineWidth + "px " + outlines.highlightedObject.outlineStyle + " "
        + outlines.highlightedObject.outlineColor
    };

    this.notHighlightedObject = {
        "outline": "none"
    };

}

var CreateDynamicStyles = function() {return new DynamicStyles()};
exports.CreateDynamicStyles = CreateDynamicStyles;