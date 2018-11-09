exports.get = function(allRatings, userRatings, userId) {
  let users = [], prevUser = allRatings[0].user, score = 0, count = 0;

  for (let i = 0; i < allRatings.length + 1; i++) { //Go through all users ratings
    let rating = allRatings[i];
    if(rating) {
      if(prevUser !== userId) { //Dont compare with youself
        if(i == allRatings.length || (prevUser && prevUser !== rating.user)) { //if next user
          score = count !== 0 ? 1 / (1 + score) : 0;
          users.push({userId: prevUser, score});

          //reset
          score = 0;
          count = 0;
          if(i == allRatings.length) {
            break;
          }
        }

        userRatings.forEach(function(userRating, j) { //compare with logged in user
          if(rating.movie == userRating.movie) { //if users has rated same movie
            score += Math.pow((userRating.rating - rating.rating), 2);
            count++;
          }
        });

      }
      prevUser = rating.user;
    }
  }


  if(users.length) { //sort users by score
    users.sort(function(userA, userB){return userB.score > userA.score});
  } else {
    //TODO: if no users has rated any movies or current user havent rated any
  }

  return users;
}
