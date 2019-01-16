exports.get = function(allRatings, userRatings, userId) {
  let users = [],
  prevUser = allRatings[0].userId,
  sum1 = 0, sum2 = 0, sum1sq = 0, sum2sq = 0, sum = 0, count = 0, ratings = {};

  for (let i = 0; i <= allRatings.length; i++) { //Go through all users ratings
    let rating = allRatings[i];

    if(prevUser !== userId) { //Dont compare with youself
      if(i == allRatings.length || (prevUser && prevUser !== rating.userId)) { //if next user
        let score = sum - (sum1 * sum2 / count);
        let score2 = Math.sqrt((sum1sq - Math.pow(sum1, 2) / count) * (sum2sq - Math.pow(sum2, 2) / count));
        score = score / score2;

        if(score > 0) {
          users.push({userId: prevUser, score, ratings});
        }

        //reset
        sum1 = 0;
        sum2 = 0;
        sum1sq = 0;
        sum2sq = 0;
        sum = 0;
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
          sum1 += userRating.rating;
          sum2 += rating.rating;
          sum1sq += Math.pow(userRating.rating, 2);
          sum2sq += Math.pow(rating.rating, 2);
          sum += userRating.rating * rating.rating;
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
