import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Messages } from '../imports/api/messages.js';

import '../imports/startup/accounts-config.js';
import './main.html';

Template.body.onCreated(function bodyOnCreated() {
	this.state = new ReactiveDict();
	Meteor.subscribe('messages');
});

Template.registerHelper("equals", function (a, b) {
  return (a == b);
});


	// <select name="type">
	// 	<option value="text">Text</option>
	// 	<option value="webpage">Webpage</option>
	// 	<option value="picture">Picture</option>
	// 	<option value="audio">Audio</option>
	// 	<option value="video">Video</option>
	// 	<option value="pdf">PDF</option>
	// 	<option value="document">Document</option>
	// 	<option value="sheet">Sheet</option>
	// 	<option value="presentation">Presentation</option>
	// 	<option value="hangman">Hangman</option>

Template.body.helpers({
	messages() {
		const instance = Template.instance();

		return Messages.find({}, { sort: { createdAt: -1 } });
	},
	resourceTemplate() {
		return Template["resource_" + this.type];
	}

	// rsvpButtonTemplate: function(rsvp) {
  //       switch(rsvp){
  //           case 'yes':   return Template.buttonYes;
  //           case 'maybe': return Template.buttonMaybe;
  //           case 'no':    return Template.buttonNo;
  //           case 'none':  return Template.buttonNone;
  //       }
  //   }
});

Template.body.events({
	'submit .new-resource'(event) {
		// We don't want to reload!
		event.preventDefault();

		const target = event.target;
		const type   = target.type.value;
		const text   = target.text.value;

		Meteor.call('messages.insert', type, text);

		// Clear
		target.text.value = '';
	}
});
