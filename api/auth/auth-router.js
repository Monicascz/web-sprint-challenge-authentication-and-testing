const router = require('express').Router();

const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('./secrets/index.js');
const jwt = require('jsonwebtoken');

const Users = require('./users-model.js');

router.post('/register', (req, res, next) => {
  /*
  IMPLEMENT
  You are welcome to build additional middlewares to help with the endpoint's functionality.
  DO NOT EXCEED 2^8 ROUNDS OF HASHING!

 
  3- On FAILED registration due to `username` or `password` missing from the request body,
    the response body should include a string exactly as follows: "username and password required".

  4- On FAILED registration due to the `username` being taken,
    the response body should include a string exactly as follows: "username taken".
*/
  const { username, password } = req.body;

  //const rounds = process.env.BCRYPT_ROUNDS || 8;
  const hash = bcrypt.hashSync(password, 8);

  Users.insert({ username, password: hash })
    .then((newUser) => {
      res.status(201).json(newUser);
    })
    .catch(() => {
      next({ status: 401, message: "username and password required" });
    });



});

router.post('/login', (req, res, next) => {

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
  let { username, password } = req.body;

  Users.findBy({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = buildToken(user);

        res.status(200).json({
          message: `welcome, ${user.username}`,
          token
        });
      } else {
        next({ status: 401, message: "username and password required" });
      }
    })
    .catch(next);


  function buildToken(user) {
    const payload = {
      subject: user.id,
      username: user.username
    };
    const options = {
      expiresIn: '1d'
    };
    return jwt.sign(payload, JWT_SECRET, options);
  }

});

module.exports = router;
