const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const server = express();
const routes = require('./routes/index.js')
require('./models');
server.name = 'API';

server.use(cors());
server.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
server.use(bodyParser.json({limit: '50mb'}));
server.use(cookieParser());
server.use(morgan('dev'));
server.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
	res.header('Access-Control-Allow-Credentials', 'false');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

server.use('/', routes)

// Error catching endware.
server.use((req, res, next) => {
	// eslint-disable-line no-unused-vars
	const status = res.status || 403;
	const message = res.message || res;
  res.sendStatus(status).send(message);
  next()
});

module.exports = server;