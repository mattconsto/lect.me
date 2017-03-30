import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Messages = new Mongo.Collection('messages');

if(Meteor.isServer) {
	// Runs only on the server
	Meteor.publish('messages', function(roomID) {
		check(roomID, String);
		return Messages.find({room: roomID, timestamp: {$gt: new Date()}});
	});
}

Meteor.methods({
	'messages.send'(roomID, message) {
		check(roomID, String);
		Messages.insert({room: roomID, userID: this.userId, message: message, timestamp: new Date()});
	}
});
