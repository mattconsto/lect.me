import { ReactiveVar } from 'meteor/reactive-var'

import { Rooms } from '/imports/api/rooms.js';
import { Messages } from '/imports/api/messages.js';
import { Connections } from '/imports/api/connections.js';

import { extensionBlacklist } from '/imports/blacklist.js';
import { urlReplacements } from './replacements.js';

connections = new ReactiveVar(0);
slideNumber = new ReactiveVar(0);

Template.revise.onCreated(function() {
	console.log(sessionID);
	Meteor.subscribe('rooms');
	Meteor.subscribe('messages', FlowRouter.getParam('roomID'), sessionID);
	Meteor.subscribe('connections');
	Meteor.call('connections.register', sessionID, FlowRouter.getParam('roomID'));
	$('html').attr('fullscreen', false);

	Meteor.call('rooms.create', FlowRouter.getParam('roomID'), "Untitled");
	// Meteor.call('rooms.create', FlowRouter.getParam('roomID'), "Untitled", (error, result) => {
	// 	Meteor.call('rooms.isAuthor', FlowRouter.getParam('roomID'), (error, result) => {
	// 		console.log(error);
	// 		console.log(result);
	// 	});
	// });
	
	// Subscribe to changes
	Messages.find({room: FlowRouter.getParam('roomID'), sessionID: {$ne: sessionID}}).observeChanges({
		added: function(id, entry) {
			console.log(entry);
		}
	});

	Connections.find({room: FlowRouter.getParam('roomID')}).observeChanges({
		added: function (id, fields) {
			connections.set(Connections.find({room: FlowRouter.getParam('roomID')}).count());
		},
		changed: function (id, fields) {
			connections.set(Connections.find({room: FlowRouter.getParam('roomID')}).count());
		},
		removed: function (id, fields) {
			connections.set(Connections.find({room: FlowRouter.getParam('roomID')}).count());
		},
	});

	$(document).on('keyup', function(event) {
		switch(event.which) {
			case 37:
				slideNumber.set(slideNumber.get()-1);
				break;
			case 39:
				slideNumber.set(slideNumber.get()+1);
				break;
		}
	});
});

let sortableIndex = -1;

Template.revise.helpers({
	messages: () => {
		// Get the full list of slides
		return Rooms.find({room: FlowRouter.getParam('roomID')}).fetch()[0].slides;
	},
	slide: () => {
		// Get the current slide with the stored offset, it loops.
		let results = Rooms.find({room: FlowRouter.getParam('roomID')}).fetch()[0];
		return results !== undefined && results.slides.length > 0 ? results.slides[slideNumber.get() % (results.slides.length + 1)] : null;
	},
	connections() {
		switch(connections.get()) {
			case 1:  return connections.get() + " connection";
			default: return connections.get() + " connections";
		}
	}
});

Template.revise.events({
	'click .delete': (event) => {
		event.preventDefault();
		Meteor.call('rooms.deleteSlide', FlowRouter.getParam('roomID'), parseInt(event.currentTarget.dataset.index));
	},
	'click .previous-card': (event) => {
		event.preventDefault();
		Meteor.call('rooms.delta', FlowRouter.getParam('roomID'), -1);
	},
	'click .next-card': (event) => {
		event.preventDefault();
		Meteor.call('rooms.delta', FlowRouter.getParam('roomID'), +1);
	},
	'click #card-container .card': (event) => {
		event.preventDefault();
		slideNumber.set(parseInt(event.currentTarget.dataset.index));
	}
});
