import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Rooms } from './rooms.js';

export const Messages = new Mongo.Collection('messages');

if(Meteor.isServer) {
	// Runs only on the server
	Meteor.publish('messages', function(roomID, sessionID) {
		check(roomID, String);
		return Messages.find({room: roomID, sessionID: {$ne: sessionID}, timestamp: {$gt: new Date()}});
	});
}

Meteor.methods({
	'messages.send'(roomID, sessionID, message) {
		check(roomID, String);

		try {
			Meteor.call('rooms.isAuthor', roomID, this.userId);
			Messages.insert({room: roomID, sessionID: sessionID, message: message, timestamp: new Date()});
		} catch(exception) {
			// Ignored
		}
	}
});
