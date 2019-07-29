// external dependencies
const oracledb = require('oracledb');

// local dependencies
const dbConfig = require('../config/database.js');

module.exports = {

	/* ==============================================
	 * : Initialize Database Connection
	 * ==============================================*/
	async initialize() {
		return await oracledb.createPool(dbConfig.anbarPool);
	},

	/* ==============================================
	 * : Close Database Connection
	 * ==============================================*/
	async close() {
		await oracledb.getPool().close();
	},

	/* ==============================================
	 * : Execute Select Query
	 * ==============================================*/
	execSelect(statement, binds = [], opts = {}) {
		return new Promise ((resolve, reject) => {
			// prepare query parameters
			let connection, rows;
			opts.outFormat = oracledb.OBJECT;
			opts.autoCommit = true;

			// execute query statment with bindings and options
			// get a connection form the poo
			oracledb.getConnection().then(conn => {
				connection = conn;
				// execute statement and return promise
				return connection.execute(statement, binds, opts);
			}).then( result => {
				rows = result.rows;
				// close connection and return promise
				return connection.close();
			}).then(() => {
				// promise resoved with row/rows 
				console.log('Successfull execution:', statement);
				resolve(rows);
			}).catch( err => {
				// reject error caught during query execution
				console.log('execSelect===============');
				console.log('Failed execution:', statement);
				console.log(err);
				console.log('===========================');
				reject(err);
			});
		});
	},

	/* ==============================================
	 * : Execute SQL function returning CLOB
	 * ==============================================*/
	execFuncCLOB(statement, binds = [], opts = {}) {
		return new Promise ((resolve, reject) => {
			// prepare query parameters
			let connection, clob;
			binds.ret = {
				dir  : oracledb.BIND_OUT,
				type : oracledb.STRING,
				maxSize: 20000
			};

			// execute query statment with bindings and options
			// get a connection form the poo
			oracledb.getConnection().then(conn => {
				connection = conn;
				// execute statement and return promise
				return connection.execute(statement, binds, opts);
			}).then( result => {
				clob = result.outBinds.ret;
				// close connection and return promise
				return connection.close();
			}).then(() => {
				// promise resoved with row/rows
				console.log('Successfull execution:', statement);
				resolve(JSON.parse(clob));
			}).catch( err => {
				// reject error caught during query execution
				console.log('execFuncCLOB===============');
				console.log('Failed execution:', statement);
				console.log(err);
				console.log('===========================');
				reject( err );
			});
		});
	},

	/* ==============================================
	 * : Execute SQL function returning RefCursor
	 * ==============================================*/

	execFuncRefCursor(statement, binds = [], opts = {}) {
		return new Promise ((resolve, reject) => {
			// prepare query parameters
			let connection, rs, rows = [];
			binds.ret = {
				dir  : oracledb.BIND_OUT,
				type : oracledb.CURSOR
			};

			// Function to loop over ResultSet
			const loopRS = () => {
				return rs.getRow().then(row => {
					if (row) {
						rows.push(JSON.parse(row[0]));
						return loopRS();
					}
				});
			};

			// execute query statment with bindings and options
			// get a connection form the poo
			oracledb.getConnection().then(conn => {
				connection = conn;
				// execute statement and return promise
				return connection.execute(statement, binds, opts);
			}).then( result => {
				// get ResultSet from the REF CURSOR
				rs = result.outBinds.ret;
				// call function to loop over ResultSet
				return loopRS();
			}).then( () => {
				// close ResultSet
				return rs.close();
			}).then(() => { 
				// close connection and return to pool
				return connection.close();
			}).then(() => {
				// promise resoved with none / one / many rows as array
				console.log('Successfull execution:', statement);
				resolve(rows);
			}).catch( err => {

				// reject error caught during query execution
				console.log('execFuncRefCursor==========');
				console.log('Failed execution:', statement);
				console.log(err);
				console.log('===========================');
				reject( err );
			});
		});
	}

};
