const express = require('express');
const bodyParser = require('body-parser');
const auth = require('./auth');
const movies = require('./movies');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(require('sanitize').middleware);

const port = process.env.PORT || 5000;

app.get('/movies', (req, res) => {
  const token = req.headers['x-access-token'];

  if(token) {
    auth.isLoggedIn(token, function(decodedToken) {
      if(decodedToken) {
        movies.getAll(decodedToken.id, function(movies) {
          res.status(200).send({data: movies});
        });
      } else {
        res.status(403).send({message: "Wrong token"});
      }
    });
  } else {
    res.status(403).send({message: "No token provided"});
  }
});

app.post('/login', (req, res) => {
  let {username, pw} = req.body;

  if(username && pw) {
    auth.login(username, pw, function(userObj) {
      if(userObj) {
        res.status(200).send({
          message: "Logged in!",
          ...userObj
        });

      } else {
        res.status(403).send({message: "Wrong username and/or password"});
      }
    });

  } else {
    res.status(403).send({message: "No username and/or password provided"});
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
