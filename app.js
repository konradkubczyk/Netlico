// Import packages
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
var flash = require('express-flash');

// Setup routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const accountRouter = require('./routes/account');
const sitesRouter = require('./routes/sites');

const app = express();

// Database setup
const Database = require('./utils/database');
Database.connect();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" }
}));
app.use(flash());

// Static resources
app.use('/static', express.static(path.join(__dirname, '/public')));
app.use('/static/bootstrap', express.static(path.join(__dirname, '/node_modules/bootstrap/dist')));
app.use('/static/bootstrap-icons', express.static(path.join(__dirname, '/node_modules/bootstrap-icons/font')));

// Setup routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/account', accountRouter);
app.use('/sites', sitesRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
