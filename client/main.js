import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Sanitizer } from '../lib/sanitizer.js';
import { Settings } from '../lib/settings.js';
import '../imports/startup/accounts-config.js';
import './slides.js';

Template.page_index.events({
	
});

Template.registerHelper('concat', function() {
	return Array.prototype.slice.call(arguments, 0, -1).join('');
});

Template.registerHelper('qr', function(text) {
	return require("qr-image").imageSync(text, {ec_level: 'L', type: 'svg'});
});

Template.registerHelper('param', function(param) {
	return FlowRouter.getParam(param);
});

Template.registerHelper('clean', function(type, text) {
	if(Sanitizer[type] !== undefined) {
		return Sanitizer[type](text);
	} else {
		throw new Meteor.Error("Invalid sanitization type!");
	}
});

Template.registerHelper('settings', function(text) {
	return Settings[text];
});

Template.registerHelper('md', function(text) {
	let marked = require('marked');
	marked.setOptions({
		highlight: function (code) {return require('highlight.js').highlightAuto(code).value;}
	});
	return marked(text);
});

const iframe = function () {
	try {
		return window.self !== window.top;
	} catch (e) {
		return true;
	}
};

Template.registerHelper('iframe', function () {
	return iframe();
});

if(iframe()) top.location = self.location.href;

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