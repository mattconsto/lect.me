import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Messages } from '../imports/api/messages.js';
import { Rooms } from '../imports/api/rooms.js';

Template.slides.onCreated(function() {
	this.state = new ReactiveDict();
	this.state.set('card-number', 0);
	Meteor.subscribe('messages');
	Meteor.subscribe('rooms');

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
	messages() {
		return Messages.find({room: FlowRouter.getParam('roomID')}, {sort: { createdAt: -1 }});
	},
	slide() {
		return Messages.find({room: FlowRouter.getParam('roomID')}, {sort: { createdAt: -1 }, limit: 1, skip: Template.instance().state.get('card-number')});
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
		const instance = Template.instance();
		instance.state.set('card-number', Math.max(instance.state.get('card-number') - 1, 0));
	},
	'submit .next-card'(event) {
		event.preventDefault();
		const instance = Template.instance();
		instance.state.set('card-number', Math.min(instance.state.get('card-number') + 1, Messages.find({}).count() - 1));
	}
});
