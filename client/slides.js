import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Rooms } from '../imports/api/rooms.js';
import '../imports/api/messages.js';
import { extensionBlacklist } from './blacklist.js';
import { urlReplacements } from './replacements.js';

let lastTimestamp = new Date();

let messagelist = {};

Template.slides.onCreated(function() {
	Meteor.subscribe('rooms');

	// // this.autorun(() => {
	// 	messagelist = Meteor.subscribe('messages.retrieve', FlowRouter.getParam('roomID'), lastTimestamp);
	// // });
	// console.log(messagelist);

	// messagelist.find().observeChanges({
	// 	added: function (newDoc) {
	// 		console.log("doc added: " + newDoc);
	// 	}
	// });

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

	// 	video.addEventListener('ratechange', function(event) {
	// 	video.addEventListener('seeked', function(event) {

Template.resource_video.events({
	'video play'(event) {
		Meteor.call('messages.send', FlowRouter.getParam('roomID'), 'play');
	},
	'video pause'(event) {
		Meteor.call('messages.send', FlowRouter.getParam('roomID'), 'pause');
	}
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
	'submit #new-hyperlink'(event) {
		event.preventDefault();

		let url = require('url').parse(event.target.hyperlink.value);
		let found = false;

		// See if the url is in the database
		for(var regexp in urlReplacements) {
			let match = new RegExp(regexp).exec(url.href);
			if(match) {
				url = url.parse(require('sprintf-js').vsprintf(urlReplacements[regexp], match));
				found = true;
				break;
			}
		}

		// Identify the correct extension
		let extension = 'webpage';
		if(!found) {
			let parsed = url.pathname.split('/').pop().split('.');
			if(parsed.length > 1 && extensionBlacklist[parsed[parsed.length-1]].toLowerCase()) {
				extension = extensionBlacklist[parsed[parsed.length-1]].toLowerCase();
				console.log('Found extension: ' + extension);
			}
		}

		Meteor.call('rooms.insertSlide', FlowRouter.getParam('roomID'), extension, url.href);

		event.target.hyperlink.value = '';
	},
	'change #new-upload input[type="file"]'(event) {
		event.preventDefault();
		console.log("Uploading");

		console.log(event.target.files);

		for(var i = 0; i < event.target.files.length; i++) {
			Meteor.saveFileClient(event.target.files[0], event.target.files[0].name, undefined, undefined/*, function(error, result) {
				console.log(arguments);
				let url = require('url').parse(result);

				// See if the url is in the database
				for(var regexp in urlReplacements) {
					let match = new RegExp(regexp).exec(url.href);
					if(match) {
						url = url.parse(require('sprintf-js').vsprintf(urlReplacements[regexp], match));
						found = true;
						break;
					}
				}

				// Identify the correct extension
				let extension = 'webpage';
				if(!found) {
					let parsed = url.pathname.split('/').pop().split('.');
					if(parsed.length > 1 && extensionBlacklist[parsed[parsed.length-1]].toLowerCase()) {
						extension = extensionBlacklist[parsed[parsed.length-1]].toLowerCase();
						console.log('Found extension: ' + extension);
					}
				}

				Meteor.call('rooms.insertSlide', FlowRouter.getParam('roomID'), extension, url.href);
			}*/);
		}
	},
	'submit #new-content'(event) {
		event.preventDefault();

		Meteor.call('rooms.insertSlide', FlowRouter.getParam('roomID'), 'text', event.target.content.value);

		event.target.content.value = '';
	},
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
	'click .delete'(event) {
		event.preventDefault();
		Meteor.call('rooms.deleteSlide', FlowRouter.getParam('roomID'), parseInt(event.target.dataset.index));
	},
	'click .previous-card'(event) {
		event.preventDefault();
		Meteor.call('rooms.navigate', FlowRouter.getParam('roomID'), -1);
	},
	'click .next-card'(event) {
		event.preventDefault();
		Meteor.call('rooms.navigate', FlowRouter.getParam('roomID'), +1);
	}
});
