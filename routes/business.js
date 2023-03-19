var express = require("express");
const { BusinessContacts } = require("../models/businessContacts");
var router = express.Router();

/* GET Business Contacts List. */
router.get("/", function (req, res, next) {
  if (req.user) {
    BusinessContacts.find()
      .sort({ contactName: 1 })
      .then((contacts) => {
        res.render("business/index", {
          title: "Create New Business Contact",
          user: req.user,
          contacts: contacts,
        });
      });
  } else {
    res.redirect("/auth/login");
  }
});

router.get("/create", function (req, res, next) {
  if (!req.user) return res.send("auth erro");

  res.render("business/create", {
    title: "Create New Business Contact",
    user: req.user,
  });
});

router.post("/create", function (req, res, next) {
  if (!req.user) return res.send("auth erro");

  const { contactName, contactNumber, emailAddress } = req.body;

  const newBusinessContact = new BusinessContacts({
    contactName,
    contactNumber,
    emailAddress,
  });

  BusinessContacts.create(newBusinessContact)
    .then(() => res.redirect("/business"))
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
});

router.get("/delete/:id", function (req, res, next) {
  if (!req.user) return res.send("auth erro");

  let id = req.params.id;

  BusinessContacts.remove({ _id: id }, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      // refresh the business list
      res.redirect("/business");
    }
  });
});

router.post("/update/:id", function (req, res, next) {
  if (!req.user) return res.send("auth erro");

  let id = req.params.id;
  const { contactName, contactNumber, emailAddress } = req.body;

  let updatedBusinessContact = BusinessContacts({
    _id: id,
    contactName: contactName,
    contactNumber: contactNumber,
    emailAddress: emailAddress,
  });

  BusinessContacts.updateOne({ _id: id }, updatedBusinessContact, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      // refresh the business list
      res.redirect("/business");
    }
  });
});

router.get("/update/:id", function (req, res, next) {
  if (!req.user) return res.send("auth erro");

  let id = req.params.id;

  BusinessContacts.findById({ _id: id }, (err, businessContact) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      console.log(businessContact);
      //show the edit view
      res.render("business/update", {
        title: "Update Contact",
        user: req.user,
        businessContact,
      });
    }
  });
});
module.exports = router;
