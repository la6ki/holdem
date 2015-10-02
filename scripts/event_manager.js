var constants = require('./constants_and_styles/constants').constants;

function EventManager() {

	this.eventsHash = {};
	this.eventKey = 0;

	this.errors = {
		'nonExistentEvent': 'Event does not exist.'
	};

}

EventManager.prototype.on = function(eventName, eventHandlerFn) {

	if (!this.eventsHash[eventName]) {
		this.eventsHash[eventName] = {};
	}

	this.eventKey++;
	this.eventsHash[eventName][this.eventKey] =  eventHandlerFn;

	return {event: eventName, key: this.eventKey};
};

EventManager.prototype.un = function(eventKey) {

	var event = eventKey.event;
	var key = eventKey.key;

	if (this.eventsHash[event]) {
		delete this.eventsHash[event][key];
	}
	else {
		throw new Error(this.errors.nonExistentEvent);
	}

};

EventManager.prototype.fire = function(eventName, sender, eventArgs) {

	var eventHandlers = this.eventsHash[eventName];

	if (eventHandlers) {
		for (var handler in eventHandlers) {
			if (eventHandlers.hasOwnProperty(handler)) {
				eventHandlers[handler](sender, eventArgs);
			}
		}
	}
	else {
		throw new Error(this.errors.nonExistentEvent);
	}

};

exports.CreateEventManager = function() {return new EventManager()};