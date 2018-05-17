var express = require('express');
var router = express.Router();
var fs = require('fs');
var passport = require('passport');
var uuidv1 = require('uuid/v1');

/**
 * GET api/todos
 */
router.get('/',
  passport.authenticate('bearer', {
    session: false
  }),
  function (req, res, next) {
    var data = fs.readFileSync('./data/todos.json', 'utf8');
    var todos = JSON.parse(data);
    var userTodos = [];
    if (req.query.completed !== undefined) {
      userTodos = req.query.completed === 'true' ?
        todos.filter((td) => td.userId === req.user.id && td.completed === true) :
        todos.filter((td) => td.userId === req.user.id && td.completed === false);
    } else {
      userTodos = todos.filter((td) => td.userId === req.user.id);
    }
    var userTodos =
      res.json({
        todos: userTodos
      });
  });

/**
 * POST api/todos
 */
router.post('/',
  passport.authenticate('bearer', {
    session: false
  }),
  function (req, res, next) {
    var data = fs.readFileSync('./data/todos.json', 'utf8');
    var todos = JSON.parse(data);

    var todo = {
      id: uuidv1(),
      userId: req.user.id,
      title: req.body.title,
      completed: req.body.completed
    };
    todos.push(todo);
    fs.writeFileSync('./data/todos.json', JSON.stringify(todos))
    res.json({
      todo
    });
  });

/**
 * DELETE api/todos/:id
 */
router.delete('/:id',
  passport.authenticate('bearer', {
    session: false
  }),
  function (req, res, next) {
    var data = fs.readFileSync('./data/todos.json', 'utf8');
    var todos = JSON.parse(data);
    var todo = todos.find((todo) => todo.id === req.params.id && todo.userId === req.user.id)
    if (!todo) {
      var err = new Error();
      err.status = 404;
      throw err;
    }
    todos = todos.filter((t) => t.id !== todo.id);
    fs.writeFileSync('./data/todos.json', JSON.stringify(todos))
    res.json({
      todo
    });
  });

/**
 * PUT api/todos/:id
 */
router.put('/:id',
  passport.authenticate('bearer', {
    session: false
  }),
  function (req, res, next) {
    var data = fs.readFileSync('./data/todos.json', 'utf8');
    var todos = JSON.parse(data);
    var todo = todos.find((todo) => todo.id === req.params.id && todo.userId === req.user.id)
    if (!todo) {
      var err = new Error();
      err.status = 404;
      throw err;
    }
    todo.completed = req.body.completed;
    fs.writeFileSync('./data/todos.json', JSON.stringify(todos))
    res.json({
      todo
    });
  });

module.exports = router;
