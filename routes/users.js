/*
Api routes for users.
*/

const router = require("express").Router();
const User2 = require("../models/auth.model");

/*
Get request for retrieving all users.
*/
router.route("/").get((req, res) => {
  User2.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

/*
Get request for a specific user given an ID.
*/
router.route("/:id").get((req, res) => {
  User2.findById(req.params.id)
    .then((classified) => res.json(classified))
    .catch((err) => res.status(400).json("Error: " + err));
});

/*
Post request for adding a new user.
*/
router.route("/add").post((req, res) => {
  const username = req.body.username;

  const newUser = new User2({ username });

  newUser
    .save()
    .then(() => res.json("User added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
