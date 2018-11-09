const db = require('./db/db');
const euclidean = require('./euclidean');

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

exports.getRecommendedMovies = function(userId, cb) {
  let allRatings = db.getRatings(), //compare with ALL users
  allMovies = db.getMovies(),
  userRatings = db.getUserRatings(userId),
  usersSim = euclidean.get(allRatings, userRatings, userId),
  wsMovies = [],
  ratingSum = 0,
  ratingCount = 0;

  allMovies.forEach(function(movie, i) {
    let userHasRated = userRatings.find(o => o.movie == movie.id);
    if(!userHasRated) {
      let total = 0;
      let simSum = 0;

      usersSim.forEach(function(user, j) {
        let rating = allRatings.find(o => o.user == user.userId && o.movie == movie.id);

        if(rating) {
          total += user.score * rating.rating;
          simSum += user.score;
        }
      });

      wsMovies.push({score: total / simSum, ...movie});
    }
  });

  wsMovies.sort(function(movieA, movieB){return movieB.score > movieA.score});
  wsMovies = wsMovies.slice(0,3);

  cb(wsMovies);
}
