import { Sanitizer } from '../lib/sanitizer.js';
import { Settings } from '../lib/settings.js';
import '../imports/startup/accounts-config.js';

Template.resource_video.events({
	'play video'(event)  {Meteor.call('messages.send', FlowRouter.getParam('roomID'), [event.currentTarget.localName, event.type]);},
	'pause video'(event) {Meteor.call('messages.send', FlowRouter.getParam('roomID'), [event.currentTarget.localName, event.type]);},
});

Meteor.saveFileClient = function(blob, name, callback) {
	var fileReader = new FileReader();
	fileReader.onload = (file) => Meteor.call('saveFileServer', file.srcElement.result, name, callback);
	fileReader.readAsBinaryString(blob);
}