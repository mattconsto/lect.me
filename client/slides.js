import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Rooms } from '../imports/api/rooms.js';

Template.slides.onCreated(function() {
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
		// Get the full list of slides
		return Rooms.find({room: FlowRouter.getParam('roomID')}).fetch()[0].slides;
	},
	slide() {
		// Get the current slide with the stored offset, it loops.
		let results = Rooms.find({room: FlowRouter.getParam('roomID')}).fetch()[0];
		return results.slides.length > 0 ? results.slides[results.slide % (results.slides.length + 1)] : null;
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

		Meteor.call('rooms.insertSlide', FlowRouter.getParam('roomID'), type, text);

		// Clear
		target.text.value = '';

		$('pre:first code').each(function(i, block) {hljs.highlightBlock(block);});
	},
	'click .delete'() {
		Meteor.call('rooms.delete', this._id);
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
