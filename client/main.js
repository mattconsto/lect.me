import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../imports/startup/accounts-config.js';
import './slides.js';

Template.registerHelper('concat', function() {
	return Array.prototype.slice.call(arguments, 0, -1).join('');
});

Template.registerHelper('qr', function(text) {
	return require("qr-image").imageSync(text, {ec_level: 'L', type: 'svg'});
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