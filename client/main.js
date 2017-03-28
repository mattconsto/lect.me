import { Sanitizer } from '../lib/sanitizer.js';
import { Settings } from '../lib/settings.js';
import '../imports/startup/accounts-config.js';

Template.page_index.events({
	
});

Meteor.saveFileClient = function(blob, name, path, type, callback) {
	var fileReader = new FileReader(), method, encoding = 'binary', type = type || 'binary';
	switch (type) {
		case 'text':
			// TODO Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
			method = 'readAsText';
			encoding = 'utf8';
			break;
		case 'binary': 
			method = 'readAsBinaryString';
			encoding = 'binary';
			break;
		default:
			method = 'readAsBinaryString';
			encoding = 'binary';
			break;
	}
	fileReader.onload = function(file) {
		Meteor.call('saveFileServer', file.srcElement.result, name, path, encoding, callback);
	}
	fileReader[method](blob);
}