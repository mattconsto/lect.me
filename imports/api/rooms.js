import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Rooms = new Mongo.Collection('rooms');

if(Meteor.isServer) {
	// Runs only on the server
	Meteor.publish('messages', function() {
		return Messages.find({});
	});
}

Meteor.methods({
	'rooms.set'(roomID, slide) {
		check(roomID, string);
		check(slide, Number);

		// Rooms.update({room: roomID}, {$set: {slide: slide}});
		Rooms.upsert({room: roomID}, {$set: {slide: slide}});
	},
});
