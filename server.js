// bring in env variables and all configuration
require('dotenv').config();

// todo: add file compression
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { makeDbConnection } = require('./api/database/db/index');
const {
	errorHandler,
	notFoundHandler,
	handleListen
} = require('./api/middleware/route/handlers');

const articleApiRoutes = require('./api/routes/article');
const userApiRoutes = require('./api/routes/user');
const profileApiRoutes = require('./api/routes/profile');
const tagsApiRoute = require('./api/routes/tags');

const app = express();

app.use(logger('dev'));
app.use(helmet());
app.use(cookieParser(process.env.SESSION_COOKIE_SECRET));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: 'http://localhost:3000/api' }));

makeDbConnection();
// uncomment this line whenever your ready for client code
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/users', userApiRoutes);
app.use('/api/v1/articles', articleApiRoutes);
app.use('/api/v1/profiles', profileApiRoutes);
app.use('/api/v1/tags', tagsApiRoute);

app.get('/', (req, res) => {
	res.status(200).json({ message: 'hello world 🌎🚀🎃🎃🔐🗝' });
});

// Error and 404 handler middleware
app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 3001;
const environment = process.env.NODE_ENV || 'development';

app.listen(port, handleListen(port, environment));

module.exports = app;
