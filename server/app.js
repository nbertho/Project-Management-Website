const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require(('body-parser'));
const session = require('express-session');
const cors = require('cors');

// REGISTER ROUTERS
const usersRouter = require('./routes/users');
const taskRouter = require('./routes/tasks');
const helperRouter = require('./routes/helper');
const testRouter = require('./routes/tests');


// APP¨CONFIG
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: 'Local Prod Secret', resave: true, saveUninitialized: true}));

// ROUTING
app.use('/api/user', usersRouter);
app.use('/api/task', taskRouter);
app.use('/api/helpers', helperRouter);
app.use('/api/tests', testRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// ERROR HANDLER
app.use(function (err, req, res, next) {
    // render the error page
    res.status(err.status || 500).json({error: true, msg: err.message, content: {}});
});

module.exports = app;
