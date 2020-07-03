// Here is the index file for all custom routes.  require() all custom routes
// and export them into server.js file!
const indexRoutes = require('./index/indexRoutes');
const apiRoutes = require('./api/apiRoutes');

module.exports = {
	indexRoutes,
	apiRoutes
};
