const { dotenv } = require('./env/config');
const {
	makeMongooseConnection,
	isValidObjId
} = require('./db/config');

module.exports = {
	dotenv,
	isValidObjId,
	makeMongooseConnection
};
