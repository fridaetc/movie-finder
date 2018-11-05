const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./db/db.json');
const db = low(adapter);

exports.getUser = function(username) {
  return db.get('users').find({username}).value();
}

exports.getMovies = function() {
  return db.get('movies').sortBy('name').value();
}

exports.getUserRatings = function(userId) {
  return db.get('ratings').filter({user: userId}).value();
}

exports.getRatings = function() {
  return db.get('ratings').value();
}
