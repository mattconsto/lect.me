import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Messages } from '../imports/api/messages.js';
import { Rooms } from '../imports/api/rooms.js';

Template.slides.onCreated(function() {
	Meteor.subscribe('messages');
	Meteor.subscribe('rooms');

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

Template.slides.helpers({
	messages() {
		return Messages.find({room: FlowRouter.getParam('roomID')}, {sort: { createdAt: -1 }});
	},
	slide() {
		return Messages.find({room: FlowRouter.getParam('roomID')}, {sort: { createdAt: -1 }, limit: 1, skip: Rooms.find({room: FlowRouter.getParam('roomID')}).fetch()[0].slide});
	},
	resourceTemplate() {
		// Fallback to undefined if given an invalid resource.
		return Template["resource_" + this.type] ? Template["resource_" + this.type] : Template["resource_undefined"];
	}
});

Template.slides.events({
	'submit .new-resource'(event) {
		// We don't want to reload!
		event.preventDefault();

		const target = event.target;
		const type   = target.type.value;
		const text   = target.text.value;

		if(type !== undefined) {
			
		}

		Meteor.call('messages.insert', type, text, FlowRouter.getParam('roomID'));

		// Clear
		target.text.value = '';

		$('pre:first code').each(function(i, block) {hljs.highlightBlock(block);});
	},
	'click .delete'() {
		Meteor.call('messages.delete', this._id);
	},
	'submit .previous-card'(event) {
		event.preventDefault();
		Meteor.call('rooms.navigate', FlowRouter.getParam('roomID'), -1);
	},
	'submit .next-card'(event) {
		event.preventDefault();
		Meteor.call('rooms.navigate', FlowRouter.getParam('roomID'), +1);
	}
});
