Template.page_index.events({
	"submit #room-select": (event) => {
		event.preventDefault();
		if(event.target.room_id.value != "") FlowRouter.redirect('/show/' + event.target.room_id.value);
	}
});

// Template.resource.events({
// 	'mousedown, mouseup': (event) => {
// 		Meteor.call('messages.send', FlowRouter.getParam('roomID'), sessionID, [event.currentTarget.localName, event.type, []]);
// 	},
// 	'mousemove' (event) {
// 		Meteor.call('messages.send', FlowRouter.getParam('roomID'), sessionID, [event.currentTarget.localName, event.type, [event.offsetX/event.currentTarget.width, event.offsetY/event.currentTarget.height]]);
// 	}
// })

Template.resource_audio.events({
	'abort audio, pause audio, play audio, stalled audio, seeked audio': (event) => {
		if(event.hasOwnProperty('originalEvent'))
			Meteor.call('messages.send', FlowRouter.getParam('roomID'), sessionID, [event.currentTarget.localName, event.type, event.target.currentTime]);
	},
});

Template.resource_video.events({
	'abort video, pause video, play video, stalled video, seeked video': (event) => {
		if(event.hasOwnProperty('originalEvent'))
			Meteor.call('messages.send', FlowRouter.getParam('roomID'), sessionID, [event.currentTarget.localName, event.type, event.target.currentTime]);
	},
});