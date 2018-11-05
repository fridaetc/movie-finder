const db = require('./db/db');

exports.getAll = function(userId, cb) {
  let allMovies = db.getMovies();
  let allRatings = db.getRatings();

  //Map all ratings to the correct movie
  allMovies.forEach(function(movie, i) {
    let ratingSum = 0, ratingCount = 0;
    allRatings.forEach(function(rating, j) {
      if(rating.movie == movie.id) {
        ratingCount++;
        ratingSum += rating.rating;

        if(rating.user == userId) { //If the rating is done by current user
          //Add user rating to movies array
          allMovies[i].userRating = decimalFormat(rating.rating);
        }
      }
    });

    let avgRating = ratingSum / ratingCount;

    //Add average rating to movies array
    allMovies[i].avgRating = avgRating = decimalFormat(avgRating);
  });

  cb(allMovies);
}

/* Format number to one decimal string */
function decimalFormat(number) {
  return (Math.round(number * 10) / 10).toFixed(1);
}
