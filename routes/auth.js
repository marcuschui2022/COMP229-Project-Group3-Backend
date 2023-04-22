var express = require("express");
var passport = require("passport");
var crypto = require("crypto");
var db = require("../config/db");
const { User } = require("../models/user");
var router = express.Router();

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

/* Configure session management.
 *
 * When a login session is established, information about the user will be
 * stored in the session.  This information is supplied by the `serializeUser`
 * function, which is yielding the user ID and username.
 *
 * As the user interacts with the app, subsequent requests will be authenticated
 * by verifying the session.  The same user information that was serialized at
 * session establishment will be restored when the session is authenticated by
 * the `deserializeUser` function.
 *
 * Since every request to the app needs the user ID and username, in order to
 * fetch todo records and render the user element in the navigation bar, that
 * information is stored in the session.
 */
// passport.serializeUser(function (user, cb) {
//   process.nextTick(function () {
//     cb(null, { id: user.id, username: user.username });
//   });
// });
// passport.deserializeUser(function (user, cb) {
//   process.nextTick(function () {
//     return cb(null, user);
//   });
// });

/* GET /login
 *
 * This route prompts the user to log in.
 *
 * The 'login' view renders an HTML form, into which the user enters their
 * username and password.  When the user submits the form, a request will be
 * sent to the `POST /login/password` route.
 */
// router.get("/login", function (req, res, next) {
//   res.render("auth/login", { title: "Login", user: req.user });
// });

/* POST /login
 *
 * This route authenticates the user by verifying a username and password.
 *
 * A username and password are submitted to this route via an HTML form, which
 * was rendered by the `GET /login` route.  The username and password is
 * authenticated using the `local` strategy.  The strategy will parse the
 * username and password from the request and call the `verify` function.
 *
 * Upon successful authentication, a login session will be established.  As the
 * user interacts with the app, by clicking links and submitting forms, the
 * subsequent requests will be authenticated by verifying the session.
 *
 * When authentication fails, the user will be re-prompted to login and shown
 * a message informing them of what went wrong.
 */
// router.post(
//   "/login",
//   passport.authenticate("local", {
//     successMessage: "business",

//     // failureRedirect: "/auth/login",
//     failureMessage: "true",
//   })
// );

router.post("/login", function (req, res, next) {
  // console.log(req.body);
  const { username, password } = req.body;
  return User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(401).send("Incorrect username or password.");
      }
      // console.log(user);
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        function (err, hashedPassword) {
          if (err) {
            console.log(err);
            return res.status(401).send("Incorrect username or password.");
          }
          if (user.password !== hashedPassword.toString("hex")) {
            return res.status(401).send("Incorrect username or password.");
          }
          // return console.log("right");
          const body = {
            username: user.username,
            email: user.email,
            nickname: user.nickname,
          };
          const token = jwt.sign({ user: body }, process.env.JWTTOP_SECRET);
          console.log(body);
          //  return res.json({user, token});
          // res.status(200).send("good");
          return res.json({ body, token });
        }
      );

      console.log(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send("Incorrect username or password.");
    });
  // .res.send("");
});

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    return User.findOne({ username: req.user.username }).then((x) => {
      res.send({ username: x.username, nickname: x.nickname, _id: x._id });
    });
    // res.json({
    //   message: "You made it to the secure route",
    //   user: req.user,
    //   token: req.query.secret_token,
    // });
  }
);
router.patch(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    // console.log(req.body);
    // console.log(`first`);

    const id = req.body._id;
    const nickname = req.body.nickname;

    let updateUser = User({
      _id: id,
      nickname: nickname,
      // updateAt: Date.now,
    });
    // console.log(`hello`);

    // return res.send("ok");

    User.updateOne({ _id: id }, updateUser, (err) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send("ok");
      }
    });
  }
);

router.get(
  "/test",
  // passport.authenticate("bearer", { session: false }),
  passport.authenticate("jwt", { session: false }),
  function (req, res, next) {
    console.log(req.user.username);
    res.send(`welcome ${req.user.username}`);
  }
);

/* POST /signup
 *
 * This route creates a new user account.
 *
 * A desired username and password are submitted to this route via an HTML form,
 * which was rendered by the `GET /signup` route.  The password is hashed and
 * then a new user record is inserted into the database.  If the record is
 * successfully created, the user is logged in.
 */
router.post("/signup", function (req, res, next) {
  console.log(req.body);
  var salt = crypto.randomBytes(16).toString("hex");
  crypto.pbkdf2(
    req.body.password,
    salt,
    310000,
    32,
    "sha256",
    function (err, hashedPassword) {
      if (err) {
        // return next(err);
        res.send("err");
      }

      const newUser = new User({
        username: req.body.username,
        password: hashedPassword.toString("hex"),
        salt: salt.toString("hex"),
        email: req.body.email,
      });

      User.create(newUser)
        .then((user) => {
          console.log(user.username);
          res.status(202).send("done");
        })
        .catch((err) => {
          console.log(err);
          res.status(203).send("exists username or email");
        });
    }
  );
});

module.exports = router;
