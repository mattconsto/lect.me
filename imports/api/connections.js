import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Rooms } from './rooms.js';

export const Connections = new Mongo.Collection('connections');

if(Meteor.isServer) {
	// Runs only on the server
	Meteor.publish('connections', function() {
		return Connections.find({state: {$ne: 'idle'}});
	});

	Meteor.setInterval(function () {
		var now = (new Date()).getTime();
		var idleThreshold = now - 2*60*1000; // 3 mins
		var removeThreshold = now - 10*60*1000; // 10 mins

		Connections.remove({timestamp: {$lt: removeThreshold}});
		Connections.update({timestamp: {$lt: idleThreshold}}, {$set: {status: 'idle'}});
	}, 30*1000);
}

Meteor.methods({
	'connections.heartbeat'(sessionID) {
		Connections.upsert({sessionID: sessionID}, {$set: {timestamp: new Date()}, $setOnInsert: {state: 'idle', room: null}});
	},
	'connections.register'(sessionID, roomID) {
		check(roomID, String);

		Connections.upsert({sessionID: sessionID}, {$set: {state: 'alive', room: roomID, timestamp: new Date()}});
	}
});