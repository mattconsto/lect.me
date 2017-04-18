import { Random } from 'meteor/random'
import { Sanitizer } from '../lib/sanitizer.js';
import { Settings } from '../lib/settings.js';
import '../imports/startup/accounts-config.js';

// Pick a random sessionID
sessionID = Random.id();

Meteor.saveFileClient = function(blob, name, callback) {
	var fileReader = new FileReader();
	fileReader.onload = (file) => Meteor.call('saveFileServer', file.srcElement.result, name, callback);
	fileReader.readAsBinaryString(blob);
}