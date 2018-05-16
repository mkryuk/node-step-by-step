var express = require('express');
var router = express.Router();
var fs = require('fs');

/**
 * GET api/todos
 */
router.get('/', function (req, res, next) {
  var data = fs.readFileSync('./data/todos.json', 'utf8');
  var todos = JSON.parse(data);
  res.json({
    todos
  });
});

module.exports = router;
