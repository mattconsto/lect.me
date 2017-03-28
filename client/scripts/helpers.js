import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Sanitizer } from '/lib/sanitizer.js';
import { Settings } from '/lib/settings.js';

/* Concatenate strings (Needs to be a function call) */
Template.registerHelper('concat', function() {return Array.prototype.slice.call(arguments, 0, -1).join('')});

/* Generate a QR Code */
Template.registerHelper('qr', (text) => require("qr-image").imageSync(text, {ec_level: 'L', type: 'svg'}));

/* Get a router parameters */
Template.registerHelper('param', (param) => FlowRouter.getParam(param));
Template.registerHelper('query', (query) => FlowRouter.getQueryParam(query));
Template.registerHelper('hash', () => FlowRouter.current().context.hash);

/* Sanitise Strings */
Template.registerHelper('clean', function(type, text) {
	if(Sanitizer[type] === undefined) throw new Meteor.Error("Invalid sanitization type!");
	return Sanitizer[type](text);
});

/* Setting grabber */
Template.registerHelper('settings', (text) => Settings[text]);

/* Markdown converter */
Template.registerHelper('md', function(text) {
	let marked = require('marked');
	marked.setOptions({highlight: (code) => require('highlight.js').highlightAuto(code).value});
	return marked(text);
});