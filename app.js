require("dotenv").config();
// installed 3rd party packages
let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let favicon = require("serve-favicon");
var passport = require("passport");
var session = require("express-session");
var MongoDBStore = require("connect-mongodb-session")(session);
// database setup
let mongoose = require("mongoose");
var cors = require("cors");
let DB = require("./config/db");

mongoose.set("strictQuery", false);

// point mongoose to the DB URI
mongoose.connect(DB.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let mongoDB = mongoose.connection;
mongoDB.on("error", console.error.bind(console, "Connection Error:"));
mongoDB.once("open", () => {
  console.log("Connected to MongoDB...");
});

// let indexRouter = require("./routes/index");
// let usersRouter = require("./routes/users");
// let authRouter = require("./routes/auth");
// let businessRouter = require("./routes/business");
let incidentTicketRouter = require("./routes/incidentTicket");

let app = express();

var store = new MongoDBStore({
  uri: process.env.MongoConnectionSessionString,
  collection: "sessions",
});

store.on("error", function (error) {
  console.log(error);
});

// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs"); // express  -e
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));
// app.use("/", express.static(path.join(__dirname, "dist")));

// app.use(express.static(path.join(__dirname, "node_modules")));
// app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
// app.use("/", express.static(path.join(__dirname, "dist")));

// app.use((req, res, next) => {
//   // Attach CORS headers
//   // Required when using a detached backend (that runs on a different domain)
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "*");
//   res.setHeader("Access-Control-Allow-Headers", "*");
//   next();
// });

// app.use(
//   session({
//     secret: "keyboard cat",
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
//     },
//     resave: true,
//     saveUninitialized: true,
//     store: store,
//     // store: new SQLiteStore({
//     //   db: "sessions.db",
//     //   dir: path.join(__dirname, "db"),
//     // }),
//     // store: new SQLiteStore({ db: "sessions.db", dir: "./var/db" }),
//   })
// );

// get message
// app.use(function (req, res, next) {
//   var msgs = req.session.messages || [];
//   res.locals.messages = msgs;
//   res.locals.hasMessages = !!msgs.length;
//   req.session.messages = [];
//   next();
// });

// app.use(passport.authenticate("session"));

// app.use("/", indexRouter);
// app.use("/users", usersRouter);
// app.use("/auth", authRouter);
// app.use("/business", businessRouter);
app.use("/api/incident-ticket", incidentTicketRouter);

app.use("/", express.static(path.join(__dirname, "dist")));
app.get("/*", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  // res.render("error", { title: "Error" });
  res.send("error");
});

module.exports = app;
