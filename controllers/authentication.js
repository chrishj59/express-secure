const jwt = require("jwt-simple");

const User = require("../models/User");
const config = require("../config");

function tokenForUser(user) {
  //jwt sub = subject who token refers to
  //iate = issued at time
  const timestamp = new Date().getTime;
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  // User has already had email & pw auth'd - neeed to give token
  res.send({ token: tokenForUser(req.user) });
};
exports.signup = function(req, res, next) {
  console.log(req.body);
  // req.doby has post request payload
  const email = req.body.email;
  const password = req.body.password;

  console.log("User");
  console.log(User);

  if (!email || !password) {
    return res
      .status(422)
      .send({ error: "You must provide email and password" });
  }

  // See if user email exists
  User.findOne(
    {
      email: email
    },
    function(err, existingUser) {
      // if connection error
      if (err) {
        return next(err);
      }
      if (existingUser) {
        //If Email found return error
        return res.status(422).send({ error: "Email is in use" });
      }

      // if new email create user
      const user = new User({ email: email, password: password });
      user.save(function(err) {
        if (err) {
          return next(err);
        }
        //success response (201)
        res.json({ token: tokenForUser(user) });
      });
    }
  );
};
