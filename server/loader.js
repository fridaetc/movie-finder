const fs = require('fs');
const readline = require('readline');
const stream = require('stream');
const dbUsers = require('./db/users');
const dbMovies = require('./db/movies');
const dbRatings = require('./db/ratings');
//const dbTags = require('./db/tags');
//const dbLinks = require('./db/links');

exports.loadData = function(cb) {
  loadRatings(function() {
    loadMovies(function() {
      cb(null);
    })
  });
}

function loadMovies(cb) {
  const MOVIES_PATH = 'db/movies.csv';
  dbMovies.removeAll();

  let firstRun = true;
  let instream = fs.createReadStream(MOVIES_PATH);
  let outstream = new stream;
  let rl = readline.createInterface(instream, outstream);

  rl.on('line', function(line) {
    if(firstRun) {
      firstRun = false;
    } else {
      let values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      let genres = values[2] ? values[2].split('|') : [];
      let movieId = parseInt(values[0], 10);

      if(typeof movieId === "number" && values[1] && !dbMovies.getMovieByMovieId(movieId)) {
        let movieRatings = dbRatings.getRatingsByMovieId(movieId);
        let noOfRatings = movieRatings.length;
        let avgRating = 0;

        movieRatings.forEach(function(rating) {
          avgRating += rating.rating;
        });

        avgRating = avgRating / movieRatings.length;

        dbMovies.postMovie(movieId, values[1], genres, noOfRatings, avgRating);
        console.log("Posted movie", movieId, values[1], genres, noOfRatings, avgRating);
      }
    }
  });

  rl.on('close', function() {
    console.log("Movies done!");
    cb(null);
    return;
  });
}

function loadRatings(cb) {
  const RATINGS_PATH = 'db/ratings.csv';
  dbRatings.removeAll();

  let firstRun = true;
  let instream = fs.createReadStream(RATINGS_PATH);
  let outstream = new stream;
  let rl = readline.createInterface(instream, outstream);


  rl.on('line', function(line) {
    if(firstRun) {
      firstRun = false;
    } else {
      let values = line.trim().split(',');

      let userValue = parseInt(values[0], 10),
          movieValue = parseInt(values[1], 10);

      if(userValue && movieValue) {
        let id = values[0] + values[1];

        if(!dbRatings.getRatingById(id)) {
          if(!dbUsers.getUserById(userValue)) {
            dbUsers.postUser(userValue);
          }

          dbRatings.postRating(
            id,
            userValue,
            movieValue,
            parseFloat(values[2]),
            parseInt(values[3], 10)
          );

          console.log("Posted rating", userValue, movieValue, id);
        }
      }
    }
  });

  rl.on('close', function() {
    console.log("Users and Ratings done!");
    cb(null);
    return;
  });
}
