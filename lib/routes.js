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
		FlowRouter.redirect('/pages');
	}
});

rooms.route('/', {
	action: function(params, query) {
		FlowRouter.redirect('/rooms/example');
	}
});

rooms.route('/:_id', {
	action: function(params, query) {
		BlazeLayout.render('layout_default', {
			content: 'present',
			room: Sanitizer.file(params._id),
		});
	}
});

rooms.route('/:_id/edit', {
	action: function(params, query) {
		BlazeLayout.render('layout_default', {
			content: 'slides',
			room: Sanitizer.file(params._id),
		});
	}
});

pages.route('/', {
	action: function(params, query) {
		FlowRouter.redirect('/pages/index');
	}
});

pages.route('/:_id', {
	action: function(params, query) {
		let file = 'page_' + Sanitizer.file(params._id);
		console.log("We're viewing: " + file);

		if(Template[file]) {
			BlazeLayout.render('layout_default', {content: file});
		} else {
			FlowRouter.notFound.action(params, query);
		}
	}
});

FlowRouter.notFound = {
	action: function(params, query) {
		console.log("404, not found.");
		BlazeLayout.render('layout_default', {
			content: 'error_404',
		});
	}
}
