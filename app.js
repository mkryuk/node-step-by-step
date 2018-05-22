const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');

const { apiRouter } = require('./routes/api.router');
const { authMiddlware } = require('./middlewares/auth.middleware');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

/**
 * Add static
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Add passport
 */
app.use(authMiddlware.passportMiddleware);

/**
 * Api router
 */
app.use('/api', apiRouter);

/**
 * Catch 404 and forward to error handler
 */
app.use(function (req, res, next) {
  next(createError(404));
});

/**
 * Error handler
 */
app.use(function (err, req, res, next) {
  const error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({
    error: error,
    message: err.message,
  });
});

module.exports = app;
