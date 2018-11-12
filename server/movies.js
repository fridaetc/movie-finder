const db = require('./db/db');
const euclidean = require('./euclidean');
const pearson = require('./pearson');

exports.getMovies = function(userId, cb) {
  let allMovies = db.getMovies();
  let userRatings = db.getUserRatings(userId);

  //Map all users ratings to the correct movie
  userRatings.forEach(function(rating, i) {
    allMovies.forEach(function(movie, j) {
      if(rating.movie == movie.id) {
        //Add user rating to movies array
        allMovies[j].userRating = rating.rating;
      }
    });
  });

  cb(allMovies);
}

exports.getRecommendedMovies = function(userId, type, cb) {
  let userRatings = db.getUserRatings(userId);

  let allRatings = db.getRatings(), //compare with ALL users
  allMovies = db.getMovies("avgRating"),
  usersSim = [],
  wsMovies = [],
  ratingSum = 0,
  ratingCount = 0;

  if(userRatings.length) { //If user has rated any movies
    if(type === "euclidean") {
      usersSim = euclidean.get(allRatings, userRatings, userId);
    } else {
      usersSim = pearson.get(allRatings, userRatings, userId);
    }

    //calculate weighted scores
    allMovies.forEach(function(movie, i) {
      let userHasRated = userRatings.find(o => o.movie == movie.id);
      if(!userHasRated) { //only show movies the user hasnt rated (=viewed)
        let total = 0;
        let simSum = 0;
        usersSim.forEach(function(user, j) {
          let rating = allRatings.find(o => o.user == user.id && o.movie == movie.id);

          if(rating) {
            total += user.score * rating.rating;
            simSum += user.score;
          }
        });

        wsMovies.push({score: total / simSum, ...movie});
      }
    });

    if(!wsMovies.length) {
      cb(null)
    } else {
      wsMovies.sort(function(movieA, movieB){return movieB.score > movieA.score});
      wsMovies = wsMovies.slice(0,3);

      cb(wsMovies);
    }
  } else {
     //If user hasnt rated any movies, recomend highest rated
     cb(allMovies.reverse().slice(0,3));
  }
}
