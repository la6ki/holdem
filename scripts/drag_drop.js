var $ = require('jquery');
var constants = require('./constants_and_styles/constants').constants;
var eventManager = require('./event_manager');

function DragDrop() {
}

DragDrop.prototype.events = eventManager.CreateEventManager();

DragDrop.prototype.getDraggedObjectType = function(draggedObject) {

    var draggedObjectParent = draggedObject.parentElement;
    var parentClasses = draggedObjectParent.className;
    var parentSecondClass = parentClasses.split(' ')[1];
    var objectType;

    switch(parentSecondClass) {
        case constants.interfaceClasses.boardCardSlotClass:
            objectType = constants.dragDrop.boardSlotName;
            break;
        case constants.interfaceClasses.playerCardSlotClass:
            objectType = constants.dragDrop.playerSlotName;
            break;
        default:
            objectType = constants.dragDrop.unknownDropObjectType;
    }

    return objectType;
};

DragDrop.prototype.getDropObjectType = function(dropObject) {

    if (dropObject !== null) {
        var dropObjectParentClasses = dropObject.objectParentClasses.parentClasses;
        var parentFirstClass = dropObjectParentClasses.split(' ')[0];
        var objectType;

        switch(parentFirstClass) {
            case constants.dragDrop.boardObject:
                objectType = constants.dragDrop.boardSlotName;
                break;
            case constants.dragDrop.playersObject:
                objectType = constants.dragDrop.playerSlotName;
                break;
            default:
                objectType = constants.dragDrop.unknownDropObjectType;
        }

        return objectType;
    }

    return null;

};

DragDrop.prototype._getReferentPosition = function (draggedObject, event) {

    if (this.firstDrag) {
        var referentPosition = {
            top: event.pageY - $(draggedObject).position().top,
            left: event.pageX - $(draggedObject).position().left
        };
        this.firstDrag = false;

        return referentPosition;
    }

    return this.referentPosition;

};

DragDrop.prototype._getTargetObjectCoordinates = function ($object) {

    var objectOffset = $object.offset();
    var objectHeight = $object.height();
    var objectWidth = $object.width();

    var topmost = objectOffset.top;
    var bottommost = objectOffset.top + objectHeight;
    var leftmost = objectOffset.left;
    var rightmost = objectOffset.left + objectWidth;

    return {
        topmost: topmost,
        bottommost: bottommost,
        leftmost: leftmost,
        rightmost: rightmost
    };

};

DragDrop.prototype._getTargetObjectAndParentClasses = function (targetObject) {

    var targetObjectClasses = targetObject.className;
    var targetObjectParentClasses = targetObject.parentElement.className;

    return {objectClasses: targetObjectClasses, parentClasses: targetObjectParentClasses};

};

DragDrop.prototype._createDroppingAreas = function (dropTargetObjectsClasses) {

    var processedTargetObjects = [];
    for (var k = 0; k < dropTargetObjectsClasses.length; k++) {
        var dropTargetObjectsClass = dropTargetObjectsClasses[k];
        var $targetObjects = $('.' + dropTargetObjectsClass);

        for (var j = 0; j < $targetObjects.length; j++) {
            var targetObject = $targetObjects[j];
            var targetObjectParentClasses = this._getTargetObjectAndParentClasses(targetObject);
            var targetObjectCoordinates = this._getTargetObjectCoordinates($(targetObject));
            var processedTargetObject = {
                objectParentClasses: targetObjectParentClasses,
                coordinates: targetObjectCoordinates
            };
            processedTargetObjects.push(processedTargetObject);
        }
    }

    this.dropTargetObjects = processedTargetObjects;

};

DragDrop.prototype._getTargetUnderCursor = function (cursorCoordinates) {

    var targetObjects = this.dropTargetObjects;

    for (var k = 0; k < targetObjects.length; k++) {
        var targetObject = targetObjects[k];

        var targetTopmostCoordinate = targetObject.coordinates.topmost;
        var targetBottommostCoordinate = targetObject.coordinates.bottommost;
        var targetLeftmostCoordinate = targetObject.coordinates.leftmost;
        var targetRightmostCoordinate = targetObject.coordinates.rightmost;

        var cursorY = cursorCoordinates.top;
        var cursorX = cursorCoordinates.left;

        var verticalMatch = cursorY >= targetTopmostCoordinate && cursorY <= targetBottommostCoordinate;
        var horizontalMatch = cursorX >= targetLeftmostCoordinate && cursorX <= targetRightmostCoordinate;

        if (verticalMatch && horizontalMatch) {
            return targetObject;
        }
    }

    return null;

};

DragDrop.prototype._toggleTargetObjectHighlight = function (cursorCoordinates) {

    var targetUnderCursor = this._getTargetUnderCursor(cursorCoordinates);

    if (targetUnderCursor !== null) {
        if (!this.insideTargetObjectArea) {
            this.insideTargetObjectArea = true;
            this.justEnteredTargetArea = true;
        }

        if (this.justEnteredTargetArea) {
            this.lastTargetObject = targetUnderCursor;
            this.events.fire(constants.eventsUI.enteredDropZone, this, targetUnderCursor);
        }
        this.justEnteredTargetArea = false;
    }
    else {
        if (this.insideTargetObjectArea) {
            this.insideTargetObjectArea = false;
            this.justLeftTargetArea = true;
        }

        if (this.justLeftTargetArea) {
            this.events.fire(constants.eventsUI.leftDropZone, this, this.lastTargetObject);
            this.lastTargetObject = null;
        }
        this.justLeftTargetArea = false;
    }

};

DragDrop.prototype.reset = function () {

    this.readyToDrag = false;
    this.moving = false;
    this.firstDrag = true;
    this.insideTargetObjectArea = false;
    this.justEnteredTargetArea = false;
    this.justLeftTargetArea = false;
    this.lastDraggedObjectProperties = {
        objectNumber: null,
        slotNumber: null
    };
    this.lastTargetObject = null;
    this.draggedObject = null;
    this.referentPosition = {};
    this.dropTargetObjects = null;
    this.dropTargetObjectsClasses = [constants.interfaceClasses.boardCardSlotClass, constants.interfaceClasses.playerCardSlotClass];

    var self = this;

    var interfaceContainer = $(constants.interfaceClasses.interfaceContainer);
    interfaceContainer
        .on('mousemove', function () {
            if (self.readyToDrag) {
                self.moving = true;

                var newPosition = {
                    top: event.pageY - self.referentPosition.top,
                    left: event.pageX - self.referentPosition.left
                };

                $(self.draggedObject).css(newPosition);

                var cursorCoordinates = {
                    top: event.pageY,
                    left: event.pageX
                };

                self._toggleTargetObjectHighlight(cursorCoordinates);

            }
        })
        .on('mouseup', function () {

            if (self.readyToDrag) {
                self.readyToDrag = false;
                self.moving = false;

                var cursorCoordinates = {
                    top: event.pageY,
                    left: event.pageX
                };

                self.drop(cursorCoordinates);
            }
        });

};

DragDrop.prototype.updateConstantsIfDifferentObject = function (objectNumber, slotNumber) {

    var sameObjectNumber = objectNumber === this.lastDraggedObjectProperties.objectNumber;
    var sameSlotNumber = slotNumber === this.lastDraggedObjectProperties.slotNumber;
    var differentObject = !(sameSlotNumber && sameObjectNumber);

    if (differentObject) {
        this.firstDrag = true;
        this.lastDraggedObjectProperties.objectNumber = objectNumber;
        this.lastDraggedObjectProperties.slotNumber = slotNumber;
    }

};

DragDrop.prototype.startDragging = function (draggedObject, event) {

    this._createDroppingAreas(this.dropTargetObjectsClasses);

    this.draggedObject = draggedObject;
    this.referentPosition = this._getReferentPosition(draggedObject, event);
    this.readyToDrag = true;

};

DragDrop.prototype.drop = function (cursorCoordinates) {

    this.dropObject = this._getTargetUnderCursor(cursorCoordinates);
    this.events.fire(constants.eventsUI.draggedObjectDropped, this);

};

exports.CreateDragDrop = function () {return new DragDrop()};