import { Random } from 'meteor/random'
import { Connections } from '/imports/api/connections.js';
import { Sanitizer } from '../lib/sanitizer.js';
import { Settings } from '../lib/settings.js';
import '../imports/startup/accounts-config.js';

// Pick a random sessionID, and send a heartbeat every 60 seconds
if(localStorage.getItem("sessionID") != null) {
	sessionID = localStorage.getItem("sessionID");
} else {
	sessionID = Random.id();
	localStorage.setItem("sessionID", sessionID);
}

Meteor.subscribe('connections');
Meteor.call('connections.heartbeat', sessionID);
Meteor.setInterval(() => Meteor.call('connections.heartbeat', sessionID), 60*1000);

Meteor.saveFileClient = function(blob, name, callback) {
	var fileReader = new FileReader();
	fileReader.onload = (file) => Meteor.call('saveFileServer', file.srcElement.result, name, callback);
	fileReader.readAsBinaryString(blob);
}