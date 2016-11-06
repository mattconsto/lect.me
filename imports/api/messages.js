import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Messages = new Mongo.Collection('messages');

if(Meteor.isServer) {
	// Runs only on the server
	Meteor.publish('messages', function messagesPublication() {
		return Messages.find({});
	});
}

Meteor.methods({
	'messages.insert'(type, text) {
		check(text, String);
		if(!this.userId) throw new Meteor.Error('not-authorized');

		Messages.insert({
			type,
			text,
			createdAt: new Date(),
			owner: this.userId,
			username: Meteor.users.findOne(this.userId).username,
		});
	},
});
