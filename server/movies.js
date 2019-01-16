const dbMovies = require('./db/movies');
const dbRatings = require('./db/ratings');
const euclidean = require('./euclidean');
const pearson = require('./pearson');

exports.getMovies = function(userId, cb) {
  let userMovies = [];
  let userRatings = dbRatings.getUserRatings(userId);

  //Map all users ratings to the correct movie
  userRatings.forEach(function(rating, i) {
    let movie = dbMovies.getMovieByMovieId(rating.movieId);
    movie.userRating = rating.rating;
    userMovies.push(movie);
  });

  userMovies.sort(function(movieA, movieB) { return movieB.userRating - movieA.userRating})
  cb(userMovies);
}

exports.getRecommendedMovies = function(userId, type, minRatings, cb) {
  let userRatings = dbRatings.getUserRatings(userId),
  allRatings = dbRatings.getRatings(), //compare with ALL users
  allMovies = dbMovies.getMovies(minRatings, userRatings.map((rating) => {return rating.movieId})),
  usersSim = [],
  wsMovies = [],
  ratingSum = 0,
  ratingCount = 0;

  if(!allMovies.length) {
    cb(null);
    return;
  }

  if(userRatings.length) { //If user has rated any movies
    if(type === "euclidean") {
      usersSim = euclidean.get(allRatings, userRatings, userId);
    } else {
      usersSim = pearson.get(allRatings, userRatings, userId);
    }

    //calculate weighted scores
    allMovies.forEach(function(movie) {
        let total = 0;
        let simSum = 0;
        usersSim.forEach(function(user) {
          let rating = user.ratings[movie.movieId];

          if(rating) {
            total += user.score * rating;
            simSum += user.score;
          }
        });

        wsMovies.push({score: roundNumber(total / simSum, 4), ...movie});
    });

    if(!wsMovies.length) {
      cb(null)
    } else {
      wsMovies.sort(function(movieA, movieB){return movieB.score - movieA.score || movieB.noOfRatings - movieA.noOfRatings});
      wsMovies = wsMovies.slice(0, 12);

      cb(wsMovies);
    }
  } else {
     //TODO: If user hasnt rated any movies
     cb(null);
  }
}

roundNumber = function(number, places) {
  return +(Math.round(number + "e+" + places)  + "e-" + places);
}
