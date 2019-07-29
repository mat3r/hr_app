const database = require('../services/database.js');

//ProjectIntro**************************
async function getController(req, res) {
	const context = {
		sectCode : req.params.sectCode === 'null' ? null : req.params.sectCode,
		projCode : req.params.projCode === 'null' ? null : parseInt(req.params.projCode, 10),
		featured : req.params.featured === 'null' ? null : parseInt(req.params.featured, 10),
		awarded  : req.params.awarded  === 'null' ? null : req.params.awarded,
		success  : req.params.success  === 'null' ? null : parseInt(req.params.success,10)
	};
	// query clob      : F_PROJECT_INTRO_L
	// query refcursor : F_PROJECT_INTRO_C
	const query = `
    BEGIN
      :ret := F_PROJECT_INTRO_C(:sectCode, :projCode, :featured, :awarded, :success);
    END;`;

	try {
		// call function to return CLOB
		//const rows = await database.execFuncCLOB (query, context);
		// call function to return RefCursor
		const rows = await database.execFuncRefCursor (query, context);

		if (rows.length !== 0) {
			res.status(200).json(rows);
		} else {
			res.status(404).end();
		}
	} catch (err) {
		res.status(500).send({
			error: 'Sorry, there was a problem with your request. Please try again later.'
		});
	}
}

/*UserGroup*****************************
async function getController(req, res) {
	let query = 'SELECT NAME "name", CODE "code" FROM UG_USER WHERE ACTIVE=1';
	let context;
	if (req.params.code) {
		context = {
			code: req.params.code
		};
		query += ' AND CODE = :code';
	}

	try {
		const rows = await database.execSelect(query, context);
		console.log('controller:', rows);
		if (req.params.code) {
			if (rows.length === 1) {
				res.status(200).json(rows[0]);
			} else {
				res.send(404).send({
					error: 'Sorry, user group not found in db.'
				});
			}
		} else {
			res.status(200).json(rows);
		}
	} catch (error) {
		res.status(500).send({
			error: 'Sorry, there was a problem with your request. Please try again later.'
		});
		console.log('XXXXXXX:', error);
	}
}
****************************************/

module.exports.getController = getController;
