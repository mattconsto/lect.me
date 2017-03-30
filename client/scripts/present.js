import { Rooms } from '/imports/api/rooms.js';
import { Messages } from '/imports/api/messages.js';

Template.present.onCreated(function() {
	console.log(sessionID);
	Meteor.subscribe('rooms');
	Meteor.subscribe('messages', FlowRouter.getParam('roomID'), sessionID);
	$('html').attr('fullscreen', true);

	if(Rooms.find({room: FlowRouter.getParam('roomID')}).count() <= 0) {
		console.log("Creating a new room: " + FlowRouter.getParam('roomID'));
		Meteor.call('rooms.create', FlowRouter.getParam('roomID'), "Untitled");
	}

	// Subscribe to changes
	Messages.find({room: FlowRouter.getParam('roomID'), sessionID: {$ne: sessionID}}).observeChanges({
		added: function(id, entry) {
			console.log(entry);
			switch(entry.message[0] + "-" + entry.message[1]) {
				case "audio-seeked":
				case "video-seeked":
					$(entry.message[0])[0].currentTime = entry.message[2];
					break;
				default:
					$(entry.message[0]).trigger(entry.message[1]);
			}
		}
	});

	$(document).on('keyup', function(event) {
		switch(event.which) {
			case 37: Meteor.call('rooms.delta', FlowRouter.getParam('roomID'), -1); break;
			case 39: Meteor.call('rooms.delta', FlowRouter.getParam('roomID'), +1); break;
		}
	});
});

Template.present.helpers({
	slide() {
		let results = Rooms.find({room: FlowRouter.getParam('roomID')}).fetch()[0];
		return results !== undefined && results.slides.length > 0 ? results.slides[results.slide % (results.slides.length + 1)] : null;
	}
});

Template.present.events({
	'click .previous-card'(event) {
		event.preventDefault();
		Meteor.call('rooms.delta', FlowRouter.getParam('roomID'), -1);
	},
	'click .next-card'(event) {
		event.preventDefault();
		Meteor.call('rooms.delta', FlowRouter.getParam('roomID'), +1);
	}
});
