import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Messages = new Mongo.Collection('messages');

const validTypes = ['text', 'code', 'webpage', 'picture', 'audio', 'video', 'pdf', 'document', 'whiteboard', 'blackboard'];

if(Meteor.isServer) {
	// Runs only on the server
	Meteor.publish('messages', function messagesPublication() {
		return Messages.find({});
	});
}

Meteor.methods({
	'messages.insert'(type, text, room) {
		// Check authorization
		if(!this.userId) throw new Meteor.Error('not-authorized');

		// Check types and values
		check(type, String);
		if(validTypes.indexOf(type) === -1) throw new Meteor.Error('invalid-type');
		check(text, String);

		// Insert
		Messages.insert({
			type,
			text,
			room,
			createdAt: new Date(),
			owner: this.userId,
			username: Meteor.users.findOne(this.userId).username,
		});
	},
});
