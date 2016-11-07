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
  action: function (p, q) {
    FlowRouter.redirect('/rooms/');
  }
});

rooms.route('/', {
    action: function(p, q) {
        BlazeLayout.render('layout_default', {
            content: 'slides',
        });
    }
});

rooms.route('/:_id', {
    action: function() {
        console.log("We're viewing a single room.");
    }
});

rooms.route('/:_id/edit', {
    action: function() {
        console.log("We're editing a single room.");
    }
});

pages.route('/', {
    action: function(p, q) {
        BlazeLayout.render('layout_default', {
            content: 'page_index',
        });
    }
});

pages.route('/:_id', {
    action: function() {
        console.log("We're viewing a single page.");
    }
});

pages.route('/:_id/edit', {
    action: function() {
        console.log("We're editing a single page.");
    }
});

FlowRouter.notFound = {
    action: function(p, q) {
        BlazeLayout.render('layout_default', {
            content: 'error_404',
        });
    }
}
