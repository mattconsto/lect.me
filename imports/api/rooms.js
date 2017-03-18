import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Rooms = new Mongo.Collection('rooms');

if(Meteor.isServer) {
	// Runs only on the server
	Meteor.publish('rooms', function() {
		return Rooms.find({});
	});
}

Meteor.methods({
	'rooms.navigate'(roomID, delta) {
		check(roomID, String);
		check(delta, Number);

		Rooms.upsert({room: roomID}, {$inc: {slide: delta}});
	},
});
