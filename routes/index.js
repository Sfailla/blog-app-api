// Here is the index file for all custom routes.  require() all custom routes
// and export them into server.js file!
const indexRoutes = require('./index/indexRoutes');
const userRoutes = require('./user/userRoutes');

module.exports = {
	indexRoutes,
	userRoutes
};
