import { Meteor } from 'meteor/meteor';

import '../imports/api/rooms.js';

Meteor.startup(() => {
	// code to run on server at startup
});

var crypto = require('crypto');

function checksum(str, algorithm, encoding) {
	return crypto.createHash(algorithm || 'sha256').update(str, 'utf8').digest(encoding || 'hex');
}

process_exec_sync = function (command) {
	// Load future from fibers
	var Future = Npm.require("fibers/future");
	// Load exec
	var child = Npm.require("child_process");
	// Create new future
	var future = new Future();
	// Run command synchronous
	child.exec(command, function(error, stdout, stderr) {
		// return an onbject to identify error and success
		var result = {};
		// test for error
		if (error) {
			result.error = error;
		}
		// return stdout
		result.stdout = stdout;
		future.return(result);
	});
	// wait for future
	return future.wait();
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
		
		let extensionre = /(?:\.([^.]+))?$/;
		let extension = extensionre.exec(name)[1].toLowerCase().replace(/[^a-z0-9_-]/, "");
		
		path = '../../../../../../uploads/' + checksum(blob) + (extension !== undefined && extension != "" ? "." + extension : "");
		urlpath = "/uploads/" + checksum(blob) + (extension !== undefined && extension != "" ? "." + extension : "");
		
		// TODO Add file existance checks, etc...
		try {
			fs.writeFileSync(path, blob, encoding);
		} catch(e) {
			throw new Meteor.Error(500, 'Failed to save file.', err);
		}

		// Handle office documents, convert if extension matches
		if(extension !== undefined && ['kth', 'key', 'numbers', 'pages', 'xls', 'xlw', 'xlt', 'xlsx', 'docx', 'pptx', 'ppt', 'pps', 'pot', 'rtf', 'doc', 'dot', 'wri', 'vsd', 'odt', 'fodt', 'ods', 'fods', 'odp', 'fodp', 'odg', 'fodg', 'odf', 'sxw', 'stw', 'sxc', 'stc', 'sxi', 'sti', 'sxd', 'std', 'sxm', 'psd', 'uof', 'uot', 'uos', 'uop', 'wpd', 'wps'].indexOf(extension) !== -1) {
			Meteor.call('convertDocument', checksum(blob), (extension !== undefined && extension != "" ? extension : ""), function(err, res) {
				// check result
				if (err) {
					// Do some error notification
				} else {
					// Do some success action
				}
			});
			urlpath = "/uploads/" + checksum(blob) + ".pdf";
		}

		return [urlpath];

		function cleanPath(str) {
			if (str) {
				return str.replace(/\.\./g,'').replace(/\/+/g,'').
					replace(/^\/+/,'').replace(/\/+$/,'');
			}
		}
		function cleanName(str) {
			return str.replace(/\.\./g,'').replace(/\//g,'');
		}
	},
	convertDocument: function(file, extension) {
		// This method call won't return immediately, it will wait for the
		// asynchronous code to finish, so we call unblock to allow this client
		// to queue other method calls (see Meteor docs)
		this.unblock();
		// run synchonous system command
		
		var result1 = process_exec_sync('cd ../../../../../../uploads/ && soffice --convert-to pdf '+file+'.'+extension+' '+file+'.pdf --headless && pdftk '+file+'.pdf burst output '+file+'_%04d.pdf dont_ask');
		if (result1.error) throw new Meteor.Error("exec-fail", "Error running soffice: " + result1.error.message);

		// success
		return true;
	}
});