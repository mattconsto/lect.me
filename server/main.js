import { Meteor } from 'meteor/meteor';

import '../imports/api/rooms.js';
import '../imports/api/messages.js';
import '../imports/api/connections.js';
import { Sanitizer } from '../lib/sanitizer.js';

import { extensionBlacklist } from '../imports/blacklist.js';

Meteor.startup(() => {
	// code to run on server at startup
	console.log("Lect.Me is starting up!");
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
		let chroot = Meteor.chroot || 'public';
		var name   = Sanitizer.file(name || 'file');
		let ext    = /(?:\.([^.]+))?$/.exec(name)[1].toLowerCase().replace(/[^a-z0-9_-]/, "") || "";
		let check  = checksum(blob);
		let path   = '../../../../../../uploads/' + check + (ext != "" ? "." + ext : "");
		let url    = ["/uploads/" + check + (ext != "" ? "." + ext : "")];
		
		// Check the extension is safe
		if(extensionBlacklist[ext] === undefined || extensionBlacklist[ext] == "invalid")
			throw new Meteor.Error("invalid-extension", "");

		// TODO Add file existance checks, etc...
		try {
			require('fs').writeFileSync(path, blob, "binary");
		} catch(e) {
			throw new Meteor.Error(500, 'Failed to save file.', err);
		}

		// Handle office documents, convert if extension matches
		if(['kth', 'key', 'numbers', 'pages', 'xls', 'xlw', 'xlt', 'xlsx', 'docx', 'pptx', 'ppt', 'pps', 'pot', 'rtf', 'doc', 'dot', 'wri', 'vsd', 'odt', 'fodt', 'ods', 'fods', 'odp', 'fodp', 'odg', 'fodg', 'odf', 'sxw', 'stw', 'sxc', 'stc', 'sxi', 'sti', 'sxd', 'std', 'sxm', 'psd', 'uof', 'uot', 'uos', 'uop', 'wpd', 'wps'].indexOf(ext) !== -1) {
			Meteor.call('convertDocument', checksum(blob), (ext != "" ? ext : ""), function(err, res) {
				if (err) {
					// Do some error notification
				} else {
					// Build the list of split files
					if(pages > 1) {
						url = [];
						for(var i = 1; i <= res; i++) {
							url.push(require('sprintf-js').sprintf("/uploads/" + check + "_%05d.pdf", i));
						}
					}
				}
			});
		}

		return url;
	},
	convertDocument: function(file, ext) {
		// This method call won't return immediately, it will wait for the
		// asynchronous code to finish, so we call unblock to allow this client
		// to queue other method calls (see Meteor docs)
		this.unblock();

		// run synchonous system command
		var r1 = process_exec_sync('cd ../../../../../../uploads/ && soffice --convert-to pdf '+file+'.'+ext+' '+file+'.pdf --headless');
		if (r1.error) throw new Meteor.Error("exec-fail", "Error converting: " + r1.error.message);

		var r2 = process_exec_sync('cd ../../../../../../uploads/ && pdftk '+file+'.pdf dump_data | grep NumberOfPages');
		if (r2.error) throw new Meteor.Error("exec-fail", "Error dumping: " + r2.error.message);

		var pages = parseInt(r2.stdout.replace(/[^0-9]/g, ""));

		if(pages == 1) return pages;

		var r3 = process_exec_sync('cd ../../../../../../uploads/ && pdftk '+file+'.pdf burst output '+file+'_%05d.pdf compress dont_ask');
		if (r3.error) throw new Meteor.Error("exec-fail", "Error bursting: " + r3.error.message);

		return pages;
	}
});