import { Meteor } from 'meteor/meteor';

/**
 * String sanitizing library.
 */
export const Sanitizer = {
	raw(string) {
		console.warn("Using raw input!");
		return string;
	},
	file(string) {
		return string.toLowerCase().replace(/[^%0123456789abcdefghijklmnopqrstuvwxyz\-_\.]/g, "_").replace(/_+/g, "_").replace(/(^_|_$)/g, "");
	},
	path(string) {
		return string.toLowerCase().replace(/[^%0123456789abcdefghijklmnopqrstuvwxyz\-_\.\\/]/g, "_").replace(/_+/g, "_").replace(/(^_|_$)/g, "");
	},
	octal(string) {
		return string.toLowerCase().replace(/[^01234567\-o]/g, "");
	},
	decimal(string) {
		return string.replace(/[^0123456789\-\.e]/g, "");
	},
	hexadecimal(string) {
		return string.toLowerCase().replace(/[^0123456789\-abcdefx]/g, "");
	}
};

Meteor.methods(Sanitizer);