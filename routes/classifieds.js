const router = require("express").Router();
let Classified = require("../models/classified.model");

router.route("/").get((req, res) => {
  Classified.find()
    .then((classifieds) => res.json(classifieds))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/query").get((req, res) => {
  var filter = {};
  if (req.query.sport) {
    filter = { sport: req.query.sport };
    if (req.query.sport == "All") {
      filter = {};
    }
  }

  if (req.query.userid) {
    filter = { userid: req.query.userid };
  }
  var sort = {};
  console.log(process.env.TEST)
  switch (req.query.sort) {
    case "sooner":
      sort = { startdate: 1 };
      break;
    case "later":
      sort = { startdate: -1 };
      break;
    case "sportaz":
      sort = { sport: 1 };
      break;
    case "sportza":
      sort = { sport: -1 };
  }

  Classified.find(filter)
    .sort(sort)
    .then((classifieds) => res.json(classifieds))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const username = req.body.username;
  const userid = req.body.userid;
  const sport = req.body.sport;
  const description = req.body.description;
  const startdate = Date.parse(req.body.startdate);
  const enddate = Date.parse(req.body.enddate);
  const location = req.body.location;

  const newClassified = new Classified({
    username,
    userid,
    sport,
    description,
    startdate,
    enddate,
    location,
  });

  newClassified
    .save()
    .then(() => res.json("Classified added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  Classified.findById(req.params.id)
    .then((classified) => res.json(classified))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  Classified.findByIdAndDelete(req.params.id)
    .then(() => res.json("Classified deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  Classified.findById(req.params.id)
    .then((classified) => {
      classified.username = req.body.username;
      classified.userid = req.body.userid;
      classified.sport = req.body.sport;
      classified.description = req.body.description;
      classified.startdate = Date.parse(req.body.startdate);
      classified.enddate = Date.parse(req.body.enddate);
      classified.location = req.body.location;

      classified
        .save()
        .then(() => res.json("Classified updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
