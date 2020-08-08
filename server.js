// bring in env variables and all configuration and/or middleware
require('./config/index');

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');
const helmet = require('helmet');

const indexRoutes = require('./routes/index/indexRoutes');
const apiRoutes = require('./routes/api/apiRoutes');
const { makeMongooseConnection } = require('./config/index');

// // uncomment when mongoose connection is established
// makeMongooseConnection();

const app = express();

app.use(logger('dev'));
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// uncomment this line whenever your ready for frontend
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRoutes);
app.use('/api', apiRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	next(err);

	// render the error page
	res.status(err.status || 500);
	res.json({
		message: err.message,
		error: err
	});
});

const port = process.env.PORT || 3001;

app.listen(port, () =>
	console.log(
		`port listening on ${port} \nNODE_ENV=${process.env.NODE_ENV}`
	)
);

module.exports = app;
