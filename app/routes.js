module.exports = function (app) {
	var path = require('path');
	// server routes ===========================================================
	// handle things like api calls
	// authentication routes

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function (req, res) {
		res.sendFile(path.resolve('../../dist/index.html'));
	});

};