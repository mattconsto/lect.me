import { Meteor } from 'meteor/meteor';

import '../imports/api/rooms.js';

Meteor.startup(() => {
	// code to run on server at startup
});

Meteor.methods({
	saveFileServer: function(blob, name, path, encoding) {
		var path = cleanPath(path), fs = require('fs'),
			name = cleanName(name || 'file'), encoding = encoding || 'binary',
			chroot = Meteor.chroot || 'public';
		// Clean up the path. Remove any initial and final '/' -we prefix them-,
		// any sort of attempt to go to the parent directory '..' and any empty directories in
		// between '/////' - which may happen after removing '..'
		// path = chroot + (path ? '/' + path + '/' : '/');
		path = '../../../../../public/';
		
		// TODO Add file existance checks, etc...
		console.log(path + name);
		fs.writeFile(path + name, blob, encoding, function(err) {
			if (err) {
				throw (new Meteor.Error(500, 'Failed to save file.', err));
			} else {
				console.log('The file ' + name + ' (' + encoding + ') was saved to ' + path);
			}
		});

		function cleanPath(str) {
			if (str) {
				return str.replace(/\.\./g,'').replace(/\/+/g,'').
					replace(/^\/+/,'').replace(/\/+$/,'');
			}
		}
		function cleanName(str) {
			return str.replace(/\.\./g,'').replace(/\//g,'');
		}
	}
});