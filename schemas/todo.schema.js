const { Schema } = require("mongoose");
const todoSchema = new Schema({
    completed: Boolean,
    title: String,
    userId: String,
});

module.exports = {
  todoSchema
}
