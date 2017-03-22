import { Meteor } from 'meteor/meteor';

import '../imports/api/rooms.js';

Meteor.startup(() => {
	// code to run on server at startup
});

var crypto = require('crypto');

function checksum(str, algorithm, encoding) {
	return crypto.createHash(algorithm || 'sha256').update(str, 'utf8').digest(encoding || 'hex');
}

Meteor.methods({
	saveFileServer: function(blob, name, path, encoding) {
		var path = cleanPath(path), fs = require('fs'),
			name = cleanName(name || 'file'), encoding = encoding || 'binary',
			chroot = Meteor.chroot || 'public';
		// Clean up the path. Remove any initial and final '/' -we prefix them-,
		// any sort of attempt to go to the parent directory '..' and any empty directories in
		// between '/////' - which may happen after removing '..'
		// path = chroot + (path ? '/' + path + '/' : '/');
		path = '../../../../../../uploads/';
		
		// TODO Add file existance checks, etc...
		try {
			fs.writeFileSync(path + checksum(blob) + "-" + name, blob, encoding);
		} catch(e) {
			throw new Meteor.Error(500, 'Failed to save file.', err);
		}

		return "/uploads/" + checksum(blob) + "-" + name;

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