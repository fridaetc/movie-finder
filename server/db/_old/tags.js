const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./db/tags.json');
const db = low(adapter);

exports.getTagByMovieId = function(movieId) {
  return db.get('tags').find({movieId}).value();
}
