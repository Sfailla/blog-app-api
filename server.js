// bring in env variables and all configuration
require('./config/index');

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');
const helmet = require('helmet');

const {
	errorHandler,
	notFound
} = require('./routes/middleware/errors');

const indexRoutes = require('./routes/index/indexRoutes');
const apiRoutes = require('./routes/api/apiRoutes');

// // uncomment when mongoose connection is established
// const { makeMongooseConnection } = require('./config/index');
// makeMongooseConnection();

const app = express();

app.use(logger('dev'));
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// uncomment this line whenever your ready for client code
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRoutes);
app.use('/api/v1', apiRoutes);
// Error and 404 handler middleware
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3001;

app.listen(port, () =>
	console.log(
		`port listening on ${port} \nNODE_ENV=${process.env.NODE_ENV}`
	)
);

module.exports = app;
