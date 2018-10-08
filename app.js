const express = require('express');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const pg = require('pg');
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session);
const logger = require('morgan');
const path = require('path');
const routes = require('./routes');
const config = require('./config');
const configDB = require('./config/config.json')[process.env.NODE_ENV];

const app = express();

app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// session db

var pgPool = new pg.Pool({
    host: configDB.host,
    database: configDB.database,
    user: configDB.username,
    password: configDB.password
});

app.use(session({
    store: new pgSession({
        pool: pgPool, // Connection pool
        tableName: 'session' // Use another table-name than the default "session" one
    }),
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000
    } // 30 days
}));

// Routes
app.use('/admin', routes.admin);
app.use('/login', routes.auth.login);
app.use('/logout', routes.auth.logout);
app.use('/' + config.BOT_TOKEN, routes.telegram);
app.get('/', (req, res) => {
    res.redirect('https://t.me/exportuzb');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = config.IS_PRODUCTION ? {} : err;

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;