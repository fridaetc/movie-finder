const express = require('express');
const bodyParser = require('body-parser');
const auth = require('./auth');
const movies = require('./movies');

const app = express();
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(require('sanitize').middleware);

const port = process.env.PORT || 5000;

checkToken = function(req, res, cb) {
  const token = req.headerString('authorization');
  if(token) {
    auth.isLoggedIn(token, function(decodedToken) {
      if(decodedToken) {
        cb(decodedToken.id);
      } else {
        res.status(403).send({data: null, message: "Wrong token"});
      }
    });
  } else {
    res.status(403).send({data: null, message: "No token provided"});
  }
}

app.get('/movies', (req, res) => {
  checkToken(req, res, function(userId) {
    if(userId) {
      let type = req.queryString("show") || "all";

      if(type == "all") {
        movies.getMovies(userId, function(movies) {
          res.status(200).send({data: movies});
        });
      } else {
        movies.getRecommendedMovies(userId, function(movies) {
          res.status(200).send({data: movies});
        });
      }
    }
  });
});

app.get('/user', (req, res) => {
  checkToken(req, res, function(userId) {
    if(userId) {
      auth.getUser(userId, function(user) {
        res.status(200).send({data: user});
      });
    }
  });
});

app.post('/login', (req, res) => {
  let username = req.bodyString('username');
  let pw = req.bodyString('pw');

  if(username && pw) {
    auth.login(username, pw, function(userObj) {
      if(userObj) {
        res.status(200).send({
          message: "Logged in!",
          data: userObj
        });

      } else {
        res.status(200).send({data: null, message: "Wrong username and/or password"});
      }
    });

  } else {
    res.status(200).send({data: null, message: "No username and/or password provided"});
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
