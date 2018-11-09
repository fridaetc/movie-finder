const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./db/db.json');
const db = low(adapter);

/*exports.getUsers = function(username) {
  return db.get('users').cloneDeep().value();
}*/

exports.getUser = function(username) {
  return db.get('users').find({username}).value();
}

exports.getUserById = function(id) {
  return db.get('users').find({id}).value();
}

exports.getRatings = function() {
  return db.get('ratings').sortBy('user').value();
}

exports.getUserRatings = function(userId) {
  return db.get('ratings').filter({user: userId}).value();
}

exports.getMovies = function() {
  return db.get('movies').sortBy('name').cloneDeep().value();
}
