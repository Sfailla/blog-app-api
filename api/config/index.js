const { dotenv } = require('./env/config');
const { makeMongooseConnection } = require('./db/config');

module.exports = {
	dotenv,
	makeMongooseConnection
};
