exports.get = function(allRatings, userRatings, userId) {
  let users = [], prevUser = null, score = 0, count = 0, ratings = {};

  for (let i = 0; i <= allRatings.length; i++) { //Go through all users ratings
    let rating = allRatings[i];

    if(prevUser !== userId) { //Dont compare with youself
      if(i == allRatings.length || (prevUser && prevUser !== rating.userId)) { //if next user
        score = count !== 0 ? 1 / (1 + score) : 0;

        if(score > 0) {
          users.push({userId: prevUser, score, ratings});
        }

        //reset
        score = 0;
        count = 0;
        ratings = {};
      }
    }

    if(i == allRatings.length) {
      break;
    }

    if(rating.userId !== userId) { //Dont compare with youself
      userRatings.forEach(function(userRating, j) { //compare with logged in user
        if(rating.movieId == userRating.movieId) { //if users has rated same movie
          score += Math.pow((userRating.rating - rating.rating), 2);
          count++;
        }
      });

    }

    ratings[rating.movieId] = rating.rating;
    prevUser = rating.userId;
  }

  users.sort(function(userA, userB){return userB.score - userA.score});
  return users;
}
