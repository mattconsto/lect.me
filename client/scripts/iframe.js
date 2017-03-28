/* Detect if we are running in an iframe */
const iframe = function () {
	try {
		return window.self !== window.top;
	} catch (e) {
		return true;
	}
}

/* Provide a helper */
Template.registerHelper('iframe', () => iframe());

/* Try to break out */
if(iframe()) top.location = self.location.href;
