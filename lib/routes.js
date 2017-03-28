import { Meteor } from 'meteor/meteor';

import { Sanitizer } from './sanitizer.js';

var root = FlowRouter.group({
	prefix: '',
	triggersEnter: [],
	triggersExit: []
});

var rooms = FlowRouter.group({
	prefix: '/rooms',
	triggersEnter: [],
	triggersExit: []
});

var pages = FlowRouter.group({
	prefix: '/pages',
	triggersEnter: [],
	triggersExit: []
});

root.route('/', {
	action: function (params, query) {
		// Redirect hash urls.
		if(FlowRouter.current().context.hash != "") {
			FlowRouter.redirect('/rooms/' + FlowRouter.current().context.hash);
		} else {
			FlowRouter.redirect('/pages');
		}
	}
});

rooms.route('/', {
	action: function(params, query) {
		FlowRouter.redirect('/rooms/example');
	}
});

rooms.route('/:roomID', {
	action: function(params, query) {
		BlazeLayout.render('layout_simple', {
			content: 'present',
			container: true,
			roomID: Sanitizer.file(params.roomID),
		});
	}
});

rooms.route('/:roomID/edit', {
	action: function(params, query) {
		BlazeLayout.render('layout_default', {
			content: 'slides',
			container: false,
			roomID: Sanitizer.file(params.roomID),
		});
	}
});

pages.route('/', {
	action: function(params, query) {
		FlowRouter.redirect('/pages/index');
	}
});

pages.route('/:pageID', {
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

FlowRouter.notFound = {
	action: function(params, query) {
		BlazeLayout.render('layout_default', {
			content: 'error_404',
				container: true,
		});
	}
}
