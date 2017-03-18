import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Messages } from '../imports/api/messages.js';
import '../imports/startup/accounts-config.js';

import './slides.js';

Template.registerHelper('concat', function() {
	return Array.prototype.slice.call(arguments, 0, -1).join('');
});

Template.registerHelper('qr', function(text) {
	return require("qr-image").imageSync(text, {ec_level: 'L', type: 'svg'});
});
