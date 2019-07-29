const database = require('../services/database.js');

/*ProjectIntroAsFunctionWithRefCursor***
async function getFromDB (context) {
	const query = 'BEGIN :ret := F_PROJECT_INTRO_V(:sectCode, :projCode, :featured, :awarded, :success); END;';
	try {
		const result = await database.execFuncRefCursor(query, context);
		return result;
	} catch (err) {
		console.log('XX=========');
		console.log(err);
		console.log('===========');
		return err;
	}
}
****************************************/

/*ProjectIntroAsFunctionWithCLOB********
async function getFromDB (context) {
	const query = 'BEGIN :ret := F_PROJECT_INTRO_V(:sectCode, :projCode, :featured, :awarded, :success); END;';
	const result = await database.execFuncCLOB(query, context);
	return JSON.parse(result);
}
****************************************/

/*ProjectIntroWithSimpleSQL*************
 * takes too long!!!!!!!!!!
async function getFromDB(context) {
	const query = 'SELECT * FROM TABLE(F_PROJECT_INTRO_B(:sectCode, :projCode, :featured, :awarded, :success))';

	console.log('Context:', context);
	const result = await database.execSimpleSQL(query, context);
 
	return result.rows;
}
****************************************/

//UserGroupWithSimpleQuery**************
async function getFromDB (context) {

	let query = 'SELECT NAME "name", CODE "code" FROM UG_USER WHERE ACTIVE=1';

	// querying for single user group by (user group) code
	const binds = {};
	if (context.code) {
		binds.code = context.code;
		query += ' AND CODE = :code';
	}
	console.log('Query:', query);
	console.log('Bindings:', binds);

	// calling database service to execute query
	const result = await database.execSimpleSQL(query, binds);

	return result.rows;
}

module.exports.getFromDB = getFromDB;

