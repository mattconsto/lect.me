import { Meteor } from 'meteor/meteor';

import { Sanitizer } from './sanitizer.js';

var root = FlowRouter.group({prefix: '',      triggersEnter: [], triggersExit: []});
var show = FlowRouter.group({prefix: '/show', triggersEnter: [], triggersExit: []});
var page = FlowRouter.group({prefix: '/page', triggersEnter: [], triggersExit: []});
var user = FlowRouter.group({prefix: '/user', triggersEnter: [], triggersExit: []});

root.route('/', {
	action: function (params, query) {
		// Redirect hash urls.
		if(FlowRouter.current().context.hash != "") {
			FlowRouter.redirect('/show/' + FlowRouter.current().context.hash);
		} else {
			FlowRouter.redirect('/page');
		}
	}
});

root.route('/~:userID', {action: (params, query) => FlowRouter.redirect('/user/' + Sanitizer.file(params.userID))});

show.route('/', {action: (params, query) => FlowRouter.redirect('/show/example')});

show.route('/:roomID', {
	action: function(params, query) {
		BlazeLayout.render('layout_simple', {
			content: 'present',
			container: true,
			roomID: Sanitizer.file(params.roomID),
		});
	}
});

show.route('/:roomID/edit', {
	action: function(params, query) {
		BlazeLayout.render('layout_default', {
			content: 'slides',
			container: false,
			roomID: Sanitizer.file(params.roomID),
		});
	}
});

show.route('/:roomID/revise', {
	action: function(params, query) {
		BlazeLayout.render('layout_default', {
			content: 'revise',
			container: false,
			roomID: Sanitizer.file(params.roomID),
		});
	}
});

page.route('/', {action: (params, query) => FlowRouter.redirect('/page/index')});

page.route('/:pageID', {
	action: function(params, query) {
		let file = 'page_' + Sanitizer.file(params.pageID);
		if(Template[file]) {
			BlazeLayout.render('layout_default', {
				content: file,
				container: true,
			});
		} else {
			FlowRouter.notFound.action(params, query);
		}
	}
});

user.route('/', {action: (params, query) => FlowRouter.redirect('/')});

user.route('/:userID', {
	action: function(params, query) {
		BlazeLayout.render('layout_default', {
			content: 'users',
				container: true,
		});
	}
});

FlowRouter.notFound = {
	action: function(params, query) {
		BlazeLayout.render('layout_default', {
			content: 'error_404',
				container: true,
		});
	}
}
