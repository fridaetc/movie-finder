const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./db/users.json');
const db = low(adapter);

exports.postUser = function(id, name = id+"", username = id+"", pw = "$2b$10$W1PZBPRHOvroPngcNjQn7e/LoAW1MXijH5hV70JPaxnVFF1atzc3K") {
  return db.get('users').push({id, name, username, pw}).write();
}

exports.getUser = function(username) {
  return db.get('users').find({username}).value();
}

exports.getUserById = function(id) {
  return db.get('users').find({id}).value();
}
