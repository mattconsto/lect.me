import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Messages } from '../imports/api/messages.js';
import { Rooms } from '../imports/api/rooms.js';

Template.present.onCreated(function() {
	Meteor.subscribe('messages');
	Meteor.subscribe('rooms');
	$('html').attr('fullscreen', true);

	// Create if not exists
	Meteor.call('rooms.navigate', FlowRouter.getParam('roomID'), 0);

	console.log(FlowRouter.getParam('roomID'));
	console.log(Rooms.find({room: FlowRouter.getParam('roomID')}).fetch());
	console.log("Slide number: " + Rooms.find({room: FlowRouter.getParam('roomID')}).fetch()[0].slide);

	$(document).on('keyup', function(event) {
		switch(event.which) {
			case 37:
				Meteor.call('rooms.navigate', FlowRouter.getParam('roomID'), -1);
				break;
			case 39:
				Meteor.call('rooms.navigate', FlowRouter.getParam('roomID'), +1);
				break;
		}
	});
});

Template.present.helpers({
	slide() {
		return Messages.find({room: FlowRouter.getParam('roomID')}, {sort: { createdAt: -1 }, limit: 1, skip: Rooms.find({room: FlowRouter.getParam('roomID')}).fetch()[0].slide});
	},
	resourceTemplate() {
		// Fallback to undefined if given an invalid resource.
		return Template["resource_" + this.type] ? Template["resource_" + this.type] : Template["resource_undefined"];
	}
});

Template.present.events({
	'submit .previous-card'(event) {
		event.preventDefault();
		Meteor.call('rooms.navigate', FlowRouter.getParam('roomID'), -1);
	},
	'submit .next-card'(event) {
		event.preventDefault();
		Meteor.call('rooms.navigate', FlowRouter.getParam('roomID'), +1);
	}
});
