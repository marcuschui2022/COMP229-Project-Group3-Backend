var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("Placeholder");
});

router.post("/", function (req, res, next) {
  console.log(req.body); // your JSON
  res.send(req.body);
});

module.exports = router;
