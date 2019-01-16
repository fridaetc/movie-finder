const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./db/links.json');
const db = low(adapter);

exports.postLink = function(movieId, imdbId, tmdbId) {
  return db.get('links').push({movieId, imdbId, tmdbId}).write();
}

exports.getLinkByMovieId = function(movieId) {
  return db.get('links').find({movieId}).value();
}
