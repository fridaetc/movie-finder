const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./db/movies.json');
const db = low(adapter);

exports.removeAll = function() {
  return db.get('movies').remove().write();
}

exports.postMovie = function(movieId, title = "", genres = [], noOfRatings = 0, avgRating = 0) {
  if(!db.has('movies').value()) {
    db.set('movies', []).write();
  }
  return db.get('movies').push({movieId, title, genres, noOfRatings, avgRating}).write();
}

/*exports.putNoOfRatings = function(movieId, noOfRatings = 0) {
  return db.get('movies').find({movieId}).assign({noOfRatings}).write();
}*/

exports.getMovieByMovieId = function(movieId) {
  return db.get('movies').find({movieId}).cloneDeep().value();
}

exports.get50Movies = function() {
  return db.get('movies').take(50).cloneDeep().value();
}

db._.mixin({
  custom: function(array, minRatings, exclude) {
    let newArray = [];

    array.forEach(function(movie) {
        if(!~exclude.indexOf(movie.movieId) && movie.noOfRatings >= minRatings) {
          newArray.push(movie);
        }
    });

    return newArray;
  }
})

exports.getMovies = function(minRatings, exclude) {
  return db.get('movies').custom(minRatings, exclude).value();
}
