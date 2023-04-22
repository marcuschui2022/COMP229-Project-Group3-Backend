// require modules for the User Model
const mongoose = require("mongoose");

// create a User Schema
const User = mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      //   required: "username is required",
      required: [true, "username can't be blank"],
      index: true,
    },
    password: {
      type: String,
      lowercase: true,
      required: "password is required",
    },
    salt: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: /.+\@.+\..+/,
      required: "email address is required",
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updateAt: {
      type: Date,
      default: Date.now,
    },
    nickname: {
      type: String,
      required: false,
    },
  },
  {
    collection: "users",
  }
);

// configure options for User Model

// let options = ({ missingPasswordError: 'Wrong / Missing Password'});

// User.plugin(passportLocalMongoose, options);

module.exports.User = mongoose.model("User", User);
