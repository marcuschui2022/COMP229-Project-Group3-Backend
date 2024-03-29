var express = require("express");
const { IncidentTicket } = require("../models/incidentTicket");
var router = express.Router();
var passport = require("passport");
const jwt = require("jsonwebtoken");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
require("dotenv").config();

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.JWTTOP_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      // console.log(ExtractJWT.fromAuthHeaderAsBearerToken("secret_token"));
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
// router.get("/", function (req, res, next) {
//   res.send("hi");
// });

/* GET Business Contacts List. */
router.get("/tickets", function (req, res, next) {
  IncidentTicket.find()
    .find({ status: { $ne: "Closed" } })
    .sort({ $natural: -1 })
    .then((data) => res.send(data));
});

router.get("/ticketsall", function (req, res, next) {
  IncidentTicket.find()
    .sort({ $natural: -1 })
    .then((data) => res.send(data));
});

router.get("/tickets/:id", function (req, res, next) {
  let id = req.params.id;
  IncidentTicket.findById({ _id: id })
    .sort({ $natural: -1 })
    .then((data) => res.send(data));
});

router.delete(
  "/tickets/:id",
  passport.authenticate("jwt", { session: false }),
  function (req, res, next) {
    // if (!req.user) return res.send("auth erro");

    let id = req.params.id;

    IncidentTicket.remove({ _id: id }, (err) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        // refresh the business list
        res.send("ok");
      }
    });
  }
);

// router.get("/create", function (req, res, next) {
//   if (!req.user) return res.send("auth erro");

//   res.render("business/create", {
//     title: "Create New Business Contact",
//     user: req.user,
//   });
// });

router.post(
  "/create-ticket",
  passport.authenticate("jwt", { session: false }),
  async function (req, res, next) {
    //   if (!req.user) return res.send("auth erro");

    const {
      incidentDescription,
      incidentPriority,
      customerInformation,
      incidentNarrative,
    } = req.body;

    let recordNumber = await IncidentTicket.find()
      .limit(1)
      .sort({ $natural: -1 });
    // console.log(recordNumber[0].recordNumber);
    // return res.send(recordNumber);
    if (recordNumber.length === 0) {
      recordNumber = "130418-0000001";
    } else {
      recordNumber = recordNumber[0].recordNumber;
      let mainNumber = Number(recordNumber.split("-")[0]);
      let secondNumber = Number(recordNumber.split("-")[1]);

      if (secondNumber < 9999999) {
        secondNumber = secondNumber + 1;
      } else {
        mainNumber = mainNumber + 1;
        secondNumber = 0;
      }
      recordNumber = `${mainNumber}-${leftPad(secondNumber, 7)}`;
    }

    const newIncidentTicket = new IncidentTicket({
      incidentDescription,
      incidentPriority,
      customerInformation,
      incidentNarrative,
      recordNumber,
    });

    const newRecord = await IncidentTicket.create(newIncidentTicket);
    console.log(newRecord);

    // updateNewRecord
    // const log = { updateBy: req.user.username };

    let updatedIncidentTicket = IncidentTicket({
      _id: newRecord._id,
      logs: [
        {
          updateBy: req.user.username,
          incidentDescription: newRecord.incidentDescription,
          incidentPriority: newRecord.incidentPriority,
          status: newRecord.newRecord,
          customerInformation: newRecord.customerInformation,
          incidentNarrative: newRecord.incidentNarrative,
          updateAt: Date.now(),
        },
      ],
    });

    await IncidentTicket.updateOne(
      { _id: newRecord._id },
      updatedIncidentTicket
    );

    res.send("ok");
  }
);

router.patch(
  "/update-ticket/:id",
  passport.authenticate("jwt", { session: false }),
  async function (req, res, next) {
    // if (!req.user) return res.send("auth erro");
    // return res.send("ok");
    let id = req.params.id;
    console.log(id);
    const {
      incidentDescription,
      incidentPriority,
      customerInformation,
      incidentNarrative,
      status,
    } = req.body;

    const existStatus = await IncidentTicket.findById({ _id: id })
      .sort({ $natural: -1 })
      .then((data) => data.status);

    if (existStatus === "Closed") {
      res.send("existStatus closed");
    }

    const existRecord = await IncidentTicket.findById({ _id: id })
      .sort({ $natural: -1 })
      .then((data) => data.logs);

    let updatedIncidentTicket = IncidentTicket({
      _id: id,
      incidentDescription,
      incidentPriority,
      customerInformation,
      incidentNarrative,
      status,
      logs: [
        ...existRecord,
        {
          updateBy: req.user.username,
          incidentDescription,
          incidentPriority,
          status,
          customerInformation,
          incidentNarrative,
          updateAt: Date.now(),
        },
      ],
    });

    IncidentTicket.updateOne({ _id: id }, updatedIncidentTicket, (err) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        // refresh the business list
        // res.redirect("/business");
        res.send("ok");
      }
    });
  }
);

// router.get("/delete/:id", function (req, res, next) {
//   if (!req.user) return res.send("auth erro");

//   let id = req.params.id;

//   BusinessContacts.remove({ _id: id }, (err) => {
//     if (err) {
//       console.log(err);
//       res.end(err);
//     } else {
//       // refresh the business list
//       res.redirect("/business");
//     }
//   });
// });

// router.post("/update/:id", function (req, res, next) {
//   if (!req.user) return res.send("auth erro");

//   let id = req.params.id;
//   const { contactName, contactNumber, emailAddress } = req.body;

//   let updatedBusinessContact = BusinessContacts({
//     _id: id,
//     contactName: contactName,
//     contactNumber: contactNumber,
//     emailAddress: emailAddress,
//   });

//   BusinessContacts.updateOne({ _id: id }, updatedBusinessContact, (err) => {
//     if (err) {
//       console.log(err);
//       res.end(err);
//     } else {
//       // refresh the business list
//       res.redirect("/business");
//     }
//   });
// });

// router.get("/update/:id", function (req, res, next) {
//   if (!req.user) return res.send("auth erro");

//   let id = req.params.id;

//   BusinessContacts.findById({ _id: id }, (err, businessContact) => {
//     if (err) {
//       console.log(err);
//       res.end(err);
//     } else {
//       console.log(businessContact);
//       //show the edit view
//       res.render("business/update", {
//         title: "Update Contact",
//         user: req.user,
//         businessContact,
//       });
//     }
//   });
// });
module.exports = router;

function leftPad(number, targetLength) {
  var output = number + "";
  while (output.length < targetLength) {
    output = "0" + output;
  }
  return output;
}
