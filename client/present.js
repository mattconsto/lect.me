import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Messages } from '../imports/api/messages.js';

Template.present.onCreated(function() {
	this.state = new ReactiveDict();
	this.state.set('card-number', 0);
	Meteor.subscribe('messages');
	$('html').attr('fullscreen', true);

	let instance = this;
	$(document).on('keyup', function(event) {
		switch(event.which) {
			case 37: instance.state.set('card-number', Math.max(instance.state.get('card-number') - 1, 0)); break;
			case 39: instance.state.set('card-number', Math.min(instance.state.get('card-number') + 1, Messages.find({}).count() - 1)); break;
			case 27: instance.state.set('card-layout', !instance.state.get('card-layout')); $('html').attr('fullscreen', instance.state.get('card-layout')); break;
		}
	});
});

Template.present.helpers({
	slide(roomID) {
		return Messages.find({room: roomID}, {sort: { createdAt: -1 }, limit: 1, skip: Template.instance().state.get('card-number')});
	},
	resourceTemplate() {
		// Fallback to undefined if given an invalid resource.
		return Template["resource_" + this.type] ? Template["resource_" + this.type] : Template["resource_undefined"];
	}
});

Template.present.events({
	'change .card-layout input'(event) {
		const instance = Template.instance();
		$('html').attr('fullscreen', event.target.checked);
		instance.state.set('card-layout', event.target.checked);
	},
	'submit .previous-card'(event) {
		event.preventDefault();
		const instance = Template.instance();
		instance.state.set('card-number', Math.max(instance.state.get('card-number') - 1, 0));
	},
	'submit .next-card'(event) {
		event.preventDefault();
		const instance = Template.instance();
		instance.state.set('card-number', Math.min(instance.state.get('card-number') + 1, Messages.find({}).count() - 1));
	}
});
