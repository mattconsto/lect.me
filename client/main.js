import { Random } from 'meteor/random'
import { Sanitizer } from '../lib/sanitizer.js';
import { Settings } from '../lib/settings.js';
import '../imports/startup/accounts-config.js';

// Pick a random sessionID
sessionID = Random.id();

Template.resource.events({
	'mousedown, mouseup' (event) {
		Meteor.call('messages.send', FlowRouter.getParam('roomID'), sessionID, [event.currentTarget.localName, event.type, []]);
	},
	'mousemove' (event) {
		Meteor.call('messages.send', FlowRouter.getParam('roomID'), sessionID, [event.currentTarget.localName, event.type, [event.offsetX/event.currentTarget.width, event.offsetY/event.currentTarget.height]]);
	}
})

Template.resource_audio.events({
	'abort audio, pause audio, play audio, stalled audio, seeked audio' (event) {
		if(event.hasOwnProperty('originalEvent'))
			Meteor.call('messages.send', FlowRouter.getParam('roomID'), sessionID, [event.currentTarget.localName, event.type, event.target.currentTime]);
	},
});

Template.resource_video.events({
	'abort video, pause video, play video, stalled video, seeked video' (event) {
		if(event.hasOwnProperty('originalEvent'))
			Meteor.call('messages.send', FlowRouter.getParam('roomID'), sessionID, [event.currentTarget.localName, event.type, event.target.currentTime]);
	},
});

Meteor.saveFileClient = function(blob, name, callback) {
	var fileReader = new FileReader();
	fileReader.onload = (file) => Meteor.call('saveFileServer', file.srcElement.result, name, callback);
	fileReader.readAsBinaryString(blob);
}