import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

const Rooms = new Mongo.Collection('rooms');

if(Meteor.isServer) {
	// Runs only on the server
	// Meteor.publish('rooms', function messagesPublication() {
	// 	return Rooms.find({});
	// });
}

Meteor.methods({
	// 'messages.insert'(type, text, room) {
	// 	// Check authorization
	// 	if(!this.userId) throw new Meteor.Error('not-authorized');

	// 	// Check types and values
	// 	check(type, String);
	// 	if(validTypes.indexOf(type) === -1) throw new Meteor.Error('invalid-type');
	// 	check(text, String);

	// 	// Insert
	// 	Messages.insert({
	// 		type,
	// 		text,
	// 		room,
	// 		createdAt: new Date(),
	// 		owner: this.userId,
	// 		username: Meteor.users.findOne(this.userId).username,
	// 	});
	// },
});
