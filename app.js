var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

var app = express();
var debug = require('debug')('app:server');
var http = require('http');
var fs = require('fs');

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
 * GET todos
 */
app.use(router.get('/api/todos', function (req, res, next) {
  var data = fs.readFileSync('./data/todos.json', 'utf8');
  var todos = JSON.parse(data);
  res.json({
    todos
  });
}));

/**
 * GET users
 */
app.use(router.get('/api/users', function (req, res, next) {
  var data = fs.readFileSync('./data/users.json', 'utf8');
  var users = JSON.parse(data);
  res.json({
    users
  });
}));

/**
 * GET user todos
 */
app.use(router.get('/api/users/:id/todos', function (req, res, next) {
  var usersData = fs.readFileSync('./data/users.json', 'utf8');
  var users = JSON.parse(usersData);
  var todosData = fs.readFileSync('./data/todos.json', 'utf8');
  var todos = JSON.parse(todosData);
  var user = users.find((user) => user.id === req.params.id);
  var todos = todos.filter((todo) => todo.userId === user.id);
  res.json({
    todos
  });
}));

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
  var error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    error: error,
    message: err.message,
  });
});

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  debug('Listening on ' + bind);
}

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
