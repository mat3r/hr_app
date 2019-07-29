module.exports = {
	anbarPool: {
		user: process.env.ANBAR_USER,
		password: process.env.ANBAR_PASSWORD,
		connectString: process.env.ANBAR_CONNECTIONSTRING,
		poolMin: 10,
		poolMax: 10,
		poolIncrement: 0
	}
};
