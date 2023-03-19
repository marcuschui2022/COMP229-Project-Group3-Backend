var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Home", user: req.user });
});

/* GET login page. */
router.get("/login", function (req, res, next) {
  res.render("login", { title: "Login", user: req.user });
});

/* GET home page. */
router.get("/home", function (req, res, next) {
  res.render("index", { title: "Home", user: req.user });
});

/* GET About Us page. */
router.get("/about", function (req, res, next) {
  res.render("about", { title: "About", user: req.user });
});

/* GET Products page. */
router.get("/projects", function (req, res, next) {
  res.render("projects", { title: "Projects", user: req.user });
});

/* GET Services page. */
router.get("/services", function (req, res, next) {
  res.render("services", { title: "Services", user: req.user });
});

/* GET Contact Us page. */
router.get("/contact", function (req, res, next) {
  res.render("contact", { title: "Contact", user: req.user });
});

module.exports = router;
