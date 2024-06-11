const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();

// route declaration
const eventsRouter = require('./routes/Events');

const app = express();
//parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//parse cookies
app.use(cookieParser());

app.use(eventsRouter);

module.exports = app;