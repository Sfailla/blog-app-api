// bring in env variables and all configuration
require('./api/config/index');

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const articleApiRoutes = require('./api/routes/article-routes');
const userApiRoutes = require('./api/routes/user-routes');
const { makeMongooseConnection } = require('./api/config/index');

const {
	errorHandler,
	notFoundHandler,
	handleListen
} = require('./api/middleware/route/handlers');

const app = express();
makeMongooseConnection();

app.use(
	cors({
		origin: 'http://localhost:3000/api'
	})
);
app.use(logger('dev'));
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// uncomment this line whenever your ready for client code
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/v1/users', userApiRoutes);
app.use('/api/v1/articles', articleApiRoutes);

app.get('/', (req, res) =>
	res.status(200).json({ message: 'hello world 🌎🚀🎃🎃🔐🗝' })
);

// Error and 404 handler middleware
app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 3001;
const env = process.env.NODE_ENV || 'development';

app.listen(port, handleListen(port, env));

module.exports = app;
