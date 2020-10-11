/*
Api controller for user.
*/

const User2 = require("../models/auth.model");

/*
Get request for retrieving all users.
*/
exports.getUsersController = (req, res) => {
  User2.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
};

/*
Get request for a specific user given an ID.
*/
exports.getUserByIdController = (req, res) => {
  User2.findById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error: " + err));
};

/*
Get request for querying user database.
*/
exports.usersQueryController = (req, res) => {
  var key = {};
  if (req.query.email) {
    key.email = req.query.email;
  }
  User2.find(key)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error: " + err));
};
