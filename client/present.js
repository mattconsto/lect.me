import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Rooms } from '../imports/api/rooms.js';

Template.present.onCreated(function() {
	Meteor.subscribe('rooms');
	$('html').attr('fullscreen', true);

	if(Rooms.find({room: FlowRouter.getParam('roomID')}).count() <= 0) {
		console.log("Creating a new room: " + FlowRouter.getParam('roomID'));
		Meteor.call('rooms.create', FlowRouter.getParam('roomID'), "Untitled");
	}

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
		let results = Rooms.find({room: FlowRouter.getParam('roomID')}).fetch()[0];
		return results.slides.length > 0 ? results.slides[results.slide % (results.slides.length + 1)] : null;
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
