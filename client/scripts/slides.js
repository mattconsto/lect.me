import { ReactiveVar } from 'meteor/reactive-var'

import { Rooms } from '/imports/api/rooms.js';
import { Messages } from '/imports/api/messages.js';
import { Connections } from '/imports/api/connections.js';

import { extensionBlacklist } from '/imports/blacklist.js';
import { urlReplacements } from './replacements.js';

connections = new ReactiveVar(0);
rating = new ReactiveVar(0);
ratings = new ReactiveVar(0);

Template.slides.onCreated(function() {
	Meteor.subscribe('rooms');
	Meteor.subscribe('messages', FlowRouter.getParam('roomID'), sessionID);
	Meteor.subscribe('connections');
	Meteor.call('connections.register', sessionID, FlowRouter.getParam('roomID'));
	$('html').attr('fullscreen', false);

	Meteor.call('rooms.create', FlowRouter.getParam('roomID'), "Untitled");
	
	// Subscribe to changes
	Messages.find({room: FlowRouter.getParam('roomID'), sessionID: {$ne: sessionID}}).observeChanges({
		added: function(id, entry) {
			console.log(entry);
		}
	});

	Connections.find({room: FlowRouter.getParam('roomID')}).observeChanges({
		added: function (id, fields) {
			connections.set(Connections.find({room: FlowRouter.getParam('roomID')}).count());
			var count = 0, total = 0, results = Connections.find({room: FlowRouter.getParam('roomID')}).fetch();
			for(result in results) {
				if(results[result].rating != 0) {
					count++;
					total += results[result].rating;
				}
			}
			ratings.set(count);
			rating.set(count > 0 ? total/count*50 + 50 : 100);
		},
		changed: function (id, fields) {
			connections.set(Connections.find({room: FlowRouter.getParam('roomID')}).count());
			var count = 0, total = 0, results = Connections.find({room: FlowRouter.getParam('roomID')}).fetch();
			for(result in results) {
				if(results[result].rating != 0) {
					count++;
					total += results[result].rating;
				}
			}
			ratings.set(count);
			rating.set(count > 0 ? total/count*50 + 50 : 100);
		},
		removed: function (id, fields) {
			connections.set(Connections.find({room: FlowRouter.getParam('roomID')}).count());
			var count = 0, total = 0, results = Connections.find({room: FlowRouter.getParam('roomID')}).fetch();
			for(result in results) {
				if(results[result].rating != 0) {
					count++;
					total += results[result].rating;
				}
			}
			ratings.set(count);
			rating.set(count > 0 ? total/count*50 + 50 : 100);
		},
	});

	$(document).on('keyup', function(event) {
		switch(event.which) {
			case 37:
				Meteor.call('rooms.delta', FlowRouter.getParam('roomID'), -1);
				break;
			case 39:
				Meteor.call('rooms.delta', FlowRouter.getParam('roomID'), +1);
				break;
		}
	});
});

let sortableIndex = -1;

Template.slides.rendered = function() {
	this.$(".sortable").sortable({
		start: (e, ui) => {
			sortableIndex = parseInt(ui.item.get(0).dataset.index);
		},
		stop: (e, ui) => {
			var before = ui.item.prev().get(0);
			var after = ui.item.next().get(0);

			if(before === undefined && after === undefined) return;

			let newIndex = after !== undefined ? parseInt(after.dataset.index) : parseInt(before.dataset.index) + 1;

			Meteor.call('rooms.moveSlide', FlowRouter.getParam('roomID'), sortableIndex, newIndex);

			return false;
		}
	});
};

Template.slides.helpers({
	messages: () => {
		// Get the full list of slides
		return Rooms.find({room: FlowRouter.getParam('roomID')}).fetch()[0].slides;
	},
	slide: () => {
		// Get the current slide with the stored offset, it loops.
		let results = Rooms.find({room: FlowRouter.getParam('roomID')}).fetch()[0];
		return results !== undefined && results.slides.length > 0 ? results.slides[results.slide % (results.slides.length + 1)] : null;
	},
	connections() {
		switch(connections.get()) {
			case 1:  return connections.get() + " connection";
			default: return connections.get() + " connections";
		}
	},
	rating() {
		switch(ratings.get()) {
			case 0:  return "No ratings";
			case 1:  return rating.get() + "% (1 rating)";
			default: return rating.get() + "%(" + ratings.get() + " ratings)";
		}
	}
});

Template.slides.events({
	'submit #new-hyperlink': (event) => {
		event.preventDefault();

		// Ensure the url has a protocol
		let temp = event.target.hyperlink.value;
		if(!temp.startsWith("http:") && !temp.startsWith("https:")) temp = "http://" + temp.replace(/^[a-zA-Z]+:(\\\/)*/, "");
		let url = require('url').parse(temp);

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
			console.log(url);
			let parsed = url.pathname.split('/').pop().split('.');
			if(parsed.length > 1 && extensionBlacklist[parsed[parsed.length-1]].toLowerCase()) {
				extension = extensionBlacklist[parsed[parsed.length-1]].toLowerCase();
				console.log('Found extension: ' + extension);
			}
		}

		Meteor.call('rooms.insertSlide', FlowRouter.getParam('roomID'), extension, url.href);

		event.target.hyperlink.value = '';
	},
	'change #new-upload input[type="file"]': (event) => {
		event.preventDefault();
		for(var i = 0; i < event.target.files.length; i++) {
			Meteor.saveFileClient(event.target.files[0], event.target.files[0].name, function(error, result) {
				for(r in result) {
					let found = false;
					let url = require('url').parse(result[r]);

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
				}
			});
		}
	},
	'submit #new-titlecard': (event) => {
		event.preventDefault();
		Meteor.call('rooms.insertSlide', FlowRouter.getParam('roomID'), 'title', []);
	},
	'submit #new-whiteboard': (event) => {
		event.preventDefault();
		Meteor.call('rooms.insertSlide', FlowRouter.getParam('roomID'), 'whiteboard', []);
	},
	'submit #new-blackboard': (event) => {
		event.preventDefault();
		Meteor.call('rooms.insertSlide', FlowRouter.getParam('roomID'), 'blackboard', []);
	},
	'submit #new-content': (event) => {
		event.preventDefault();

		Meteor.call('rooms.insertSlide', FlowRouter.getParam('roomID'), 'text', event.target.content.value);

		event.target.content.value = '';
	},
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
		Meteor.call('rooms.navigate', FlowRouter.getParam('roomID'), parseInt(event.currentTarget.dataset.index));
	}
});
