// bring in env variables and all configuration
require('./api/config/index');

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const helmet = require('helmet');
const apiRoutes = require('./api/routes/user-routes');
const {
	errorHandler,
	notFoundHandler
} = require('./api/middleware/error-handler');

const app = express();

app.use(logger('dev'));
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// uncomment this line whenever your ready for client code
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/v1', apiRoutes);

app.get('/', (req, res) =>
	res.status(200).json({ message: 'hello world 🌎🚀 🎃🎃🔐🗝' })
);

// Error and 404 handler middleware
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(process.env.PORT || 3001, () => {
	const PORT = process.env.PORT || 3001;
	const NODE_ENV = process.env.NODE_ENV;
	console.log(`port listening on ${PORT} \nNODE_ENV=${NODE_ENV}`);
});

module.exports = app;
