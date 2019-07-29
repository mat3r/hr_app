// external dependencies
const http    = require('http');
const express = require('express');
const logger  = require('morgan');

// local dependencies
const webServerConfig = require('../config/web-server.js');
const router          = require('./router.js');

let httpServer;

/* =====================================
 * Function Decaration: Initialize Server
 * =====================================*/
function initialize() {
	return new Promise((resolve, reject) => {
		// create express application
		const app = express();
		httpServer = http.createServer(app);

		// enable HTTP logging with morgan
		app.use(logger('dev'));

		// use router file
		app.use('/api', router);

		// Start application to listen on port for incoming requests
		httpServer.listen(webServerConfig.port)
			.on('listening', () => {
				console.log(`Web server listening on localhost:${webServerConfig.port}`);

				resolve();
			})
			.on('error', err => {
				reject(err);
			});
	});
}

/* =====================================
 * Function Decaration: Close Server
 * =====================================*/
function close() {
	return new Promise((resolve, reject) => {
		httpServer.close((err) => {
			if (err) {
				reject(err);
				return;
			}

			resolve();
		});
	});
}

module.exports.initialize = initialize;
module.exports.close      = close;
