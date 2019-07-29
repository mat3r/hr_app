// local dependencies
const webServer = require('./services/web-server.js');
const database  = require('./services/database.js');
const dbConfig  = require('./config/database.js');
const defaultThreadPoolSize = 4;
 
// Increase thread pool size by poolMax
process.env.UV_THREADPOOL_SIZE = dbConfig.anbarPool.poolMax + defaultThreadPoolSize;

/* =========================================================
 * Function Decaration: Startup Server & Database Connection
 * =========================================================*/
async function startup() {
	console.log('Starting application');

	// Initialize Database
	try {
		console.log('Initializing database module');
		// try to open database connection
		const pool = await database.initialize(); 
	} catch (err) {
		// error happened while connecting to database
		console.error(err);
		process.exit(1); // Non-zero failure code
	}

	// Initialize Server Module
	try {
		console.log('Initializing web server module');
		// try to start server
		await webServer.initialize();
	} catch (err) {
		// error happened while starting server
		console.error(err);
		process.exit(1); // Non-zero failure code
	}
}

/* =========================================================
 * Function Decaration: Shutdown Server & Database Connection
 * =========================================================*/
async function shutdown(e) {
	let err = e;

	console.log('Shutting down');

	// SERVER MODULE
	try {
		// try to close server module
		console.log('Closing web server module');
		await webServer.close();
	} catch (e) {
		// error happened while closing server
		console.log('Encountered error', e);
		err = err || e;
	}

	// DATABASE CONNECTION
	try {
		// try to close database connection
		console.log('Closing database module');
		await database.close(); 
	} catch (e) {
		// error happened while closing database connection
		console.log('Encountered error', e);
		err = err || e;
	}

	console.log('Exiting process');

	// Ending process anyhow
	if (err) {
		process.exit(1); // Non-zero failure code
	} else {
		process.exit(0); // Success code
	}
}

/* =====================================
 * Main Code
 * =====================================*/
// Startup Application Server and Database Connection
startup();

// Terminate on 'SIDTERM': kill -15 <PID>
process.on('SIGTERM', () => {
	console.log('Received SIGTERM');
	shutdown();
});

// Program interrupt on 'SIGINT': Ctrl-C
process.on('SIGINT', () => {
	console.log('Received SIGINT');
	shutdown();
});

// Shutdown on Javascript uncaught exception
process.on('uncaughtException', err => {
	console.log('Uncaught exception');
	console.error(err);
	shutdown(err);
});
