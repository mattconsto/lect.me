import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

const validTypes = ['text', 'webpage', 'picture', 'audio', 'video', 'pdf', 'document', 'whiteboard', 'blackboard'];

export const Rooms = new Mongo.Collection('rooms');

if(Meteor.isServer) {
	// Runs only on the server
	Meteor.publish('rooms', function() {
		return Rooms.find({
			$or: [{private: {$ne: true}}, {authors: this.userId}]
		});
	});
}

Meteor.methods({
	'rooms.exists'(roomID) {
		check(roomID, String);

		if(Rooms.find({room: roomID}).count() <= 0)
			throw new Meteor.Error('room-doesnt-exist');
	},
	'rooms.isAuthor'(roomID, userID) {
		Meteor.call('rooms.exists', roomID);

		if(!Rooms.find({room: roomID}).fetch()[0].authors.includes(this.userId))
			throw new Meteor.Error('not-an-author');
	},
	'rooms.navigate'(roomID, delta) {
		Meteor.call('rooms.isAuthor', roomID, this.userId);

		check(delta, Number);

		Rooms.update({room: roomID}, {$inc: {slide: delta}});
	},
	'rooms.create'(roomID, title) {
		check(roomID, String);
		check(title, String);

		if(Rooms.find({room: roomID}).count() > 0)
			throw new Meteor.Error('room-already-exists');

		Rooms.insert({
			room:         roomID,
			createdTime:  new Date(),
			modifiedTime: new Date(),
			authors:      [this.userId],
			slides:       [],
			slide:        0,
			title:        title,
			description:  "New Presentation",
			status:       "presenting",
			private:      false,
		})
	},
	'rooms.addAuthor'(roomID, authorID) {
		Meteor.call('rooms.isAuthor', roomID, this.userId);

		Rooms.update({room: roomID}, {$set: {modifiedTime: new Date()}});
		Rooms.update({room: roomID}, {$push: {authors: authorID}});
	},
	'rooms.removeAuthor'(roomID, authorID) {
		Meteor.call('rooms.isAuthor', roomID, this.userId);

		Rooms.update({room: roomID}, {$set: {modifiedTime: new Date()}});
		Rooms.update({room: roomID}, {$pop: {authors: authorID}});
	},
	'rooms.updateTitle'(roomID, title) {
		check(title, String);

		Meteor.call('rooms.isAuthor', roomID, this.userId);

		Rooms.update({room: roomID}, {$set: {modifiedTime: new Date()}});
		Rooms.update({room: roomID}, {$set: {title: title}});
	},
	'rooms.updateDescription'(roomID, description) {
		check(description, String);

		Meteor.call('rooms.isAuthor', roomID, this.userId);

		Rooms.update({room: roomID}, {$set: {modifiedTime: new Date()}});
		Rooms.update({room: roomID}, {$set: {description: description}});
	},
	'rooms.updatePrivate'(roomID, value) {
		check(value, Boolean);

		Meteor.call('rooms.isAuthor', roomID, this.userId);

		Rooms.update({room: roomID}, {$set: {modifiedTime: new Date()}});
		Rooms.update({room: roomID}, {$set: {value: value}});
	},
	'rooms.deleteSlide'(roomID, slideNumber) {
		check(slideNumber, Number);

		Meteor.call('rooms.isAuthor', roomID, this.userId);

		// Horrible way to remove by index
		Rooms.update({room: roomID}, {$unset: {["slides." + slideNumber]: 1}})
		Rooms.update({room: roomID}, {$pull: {slides: null}})
	},
	'rooms.insertSlide'(roomID, type, data) {
		// Check types and values
		check(type, String);
		if(validTypes.indexOf(type) === -1) throw new Meteor.Error('invalid-type');

		Meteor.call('rooms.isAuthor', roomID, this.userId);

		Rooms.update({room: roomID}, {$push: {slides: {type: type, data: data}}});
	},
	'rooms.moveSlide'(roomID, slideNumber, delta) {
		check(slideNumber, Number);
		check(delta, number);

		Meteor.call('rooms.isAuthor', roomID, this.userId);

		throw new Meteor.Error('Not implemented!');
	}
});
