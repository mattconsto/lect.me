import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Messages } from '../imports/api/messages.js';

import '../imports/startup/accounts-config.js';

Template.slides.onCreated(function() {
	this.state = new ReactiveDict();
	this.state.set('card-number', 0);
	Meteor.subscribe('messages');

	let instance = this;
	$(document).on('keyup', function(event) {
		switch(event.which) {
			case 37: instance.state.set('card-number', Math.max(instance.state.get('card-number') - 1, 0)); break;
			case 39: instance.state.set('card-number', Math.min(instance.state.get('card-number') + 1, Messages.find({}).count() - 1)); break;
			case 27: instance.state.set('card-layout', !instance.state.get('card-layout')); $('html').attr('fullscreen', instance.state.get('card-layout')); break;
		}
	});
});

Template.slides.helpers({
	messages(roomID) {
		const instance = Template.instance();
		if(instance.state.get('card-layout')) {
			return Messages.find({room: roomID}, {sort: { createdAt: -1 }, limit: 1, skip: instance.state.get('card-number')});
		} else {
			return Messages.find({room: roomID}, {sort: { createdAt: -1 }});
		}
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
		const room   = target.room.value;

		Meteor.call('messages.insert', type, text, room);

		// Clear
		target.text.value = '';
	},
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
