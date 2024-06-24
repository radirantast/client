const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
  username: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  room: {
    type: mongoose.SchemaTypes.String,
    required: true,
  }
});

module.exports = mongoose.model('user', UsersSchema);