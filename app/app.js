const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

// route declaration
const eventsRouter = require('./routes/Events');
const authRouter = require('./routes/auth');

const app = express();

// Enable CORS for all route
app.use(cors());

//parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//parse cookies
app.use(cookieParser());

app.use(eventsRouter);
app.use(authRouter);

module.exports = app;