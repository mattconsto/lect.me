import { Meteor } from 'meteor/meteor';

import '../imports/api/rooms.js';
import { Sanitizer } from '../lib/sanitizer.js';

Meteor.startup(() => {
	// code to run on server at startup
});

var crypto = require('crypto');

function checksum(str, algorithm, encoding) {
	return crypto.createHash(algorithm || 'sha256').update(str, 'utf8').digest(encoding || 'hex');
}

process_exec_sync = function (command) {
	// Load future, exec, and create a new future
	var Future = Npm.require("fibers/future");
	var child = Npm.require("child_process");
	var future = new Future();

	// Run command synchronous
	child.exec(command, function(error, stdout, stderr) {
		// return an onbject to identify error and success, testing for error, returning stdout
		var result = {};
		if (error) result.error = error;
		result.stdout = stdout;

		future.return(result);
	});

	// wait for future
	return future.wait();
}

Meteor.methods({
	saveFileServer: function(blob, name) {
		let chroot    = Meteor.chroot || 'public';
		var name      = Sanitizer.file(name || 'file');
		let ext = /(?:\.([^.]+))?$/.exec(name)[1].toLowerCase().replace(/[^a-z0-9_-]/, "") || "";
		let check     = checksum(blob);
		let path      = '../../../../../../uploads/' + check + (ext != "" ? "." + ext : "");
		let url       = "/uploads/" + check + (ext != "" ? "." + ext : "");
		
		// TODO Add file existance checks, etc...
		try {
			require('fs').writeFileSync(path, blob, "binary");
		} catch(e) {
			throw new Meteor.Error(500, 'Failed to save file.', err);
		}

		// Handle office documents, convert if extension matches
		if(['kth', 'key', 'numbers', 'pages', 'xls', 'xlw', 'xlt', 'xlsx', 'docx', 'pptx', 'ppt', 'pps', 'pot', 'rtf', 'doc', 'dot', 'wri', 'vsd', 'odt', 'fodt', 'ods', 'fods', 'odp', 'fodp', 'odg', 'fodg', 'odf', 'sxw', 'stw', 'sxc', 'stc', 'sxi', 'sti', 'sxd', 'std', 'sxm', 'psd', 'uof', 'uot', 'uos', 'uop', 'wpd', 'wps'].indexOf(ext) !== -1) {
			Meteor.call('convertDocument', checksum(blob), (ext != "" ? ext : ""), function(err, res) {
				// check result
				if (err) {
					// Do some error notification
				} else {
					// Do some success action
				}
			});
			url = "/uploads/" + check + ".pdf";
		}

		return [url];
	},
	convertDocument: function(file, ext) {
		// This method call won't return immediately, it will wait for the
		// asynchronous code to finish, so we call unblock to allow this client
		// to queue other method calls (see Meteor docs)
		this.unblock();

		// run synchonous system command
		var result = process_exec_sync('cd ../../../../../../uploads/ && soffice --convert-to pdf '+file+'.'+ext+' '+file+'.pdf --headless && pdftk '+file+'.pdf burst output '+file+'_%04d.pdf dont_ask');
		if (result.error) throw new Meteor.Error("exec-fail", "Error converting: " + result.error.message);

		return true;
	}
});