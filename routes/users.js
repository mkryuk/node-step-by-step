var express = require('express');
var router = express.Router();
var fs = require('fs');

/**
 *  GET api/users
 */
router.get('/', function (req, res, next) {
  var data = fs.readFileSync('./data/users.json', 'utf8');
  var users = JSON.parse(data);
  res.json({
    users
  });
});

/**
 * GET api/users/:id/todos
 */
router.get('/:id/todos', function (req, res, next) {
  var usersData = fs.readFileSync('./data/users.json', 'utf8');
  var users = JSON.parse(usersData);
  var todosData = fs.readFileSync('./data/todos.json', 'utf8');
  var todos = JSON.parse(todosData);
  var user = users.find((user) => user.id === req.params.id);
  var todos = todos.filter((todo) => todo.userId === user.id);
  res.json({
    todos
  });
})

module.exports = router;
