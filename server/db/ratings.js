const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./db/ratings.json');
const db = low(adapter);

exports.removeAll = function() {
  return db.get('ratings').remove().write();
}

exports.postRating = function(id, userId, movieId, rating, timestamp) {
  if(!db.has('ratings').value()) {
    db.set('ratings', []).write();
  }
  return db.get('ratings').push({id, userId, movieId, rating, timestamp}).write();
}

exports.getUserRatings = function(userId) {
  userId = parseInt(userId, 10);
  return db.get('ratings').filter({userId}).value();
}

exports.getRatings = function() {
  return db.get('ratings').sortBy('userId').cloneDeep().value();
}

exports.getRatingsByMovieId = function(movieId) {
  return db.get('ratings').filter({movieId}).value();
}

exports.getRatingById = function(id) {
  return db.get('ratings').find({id}).value();
}
