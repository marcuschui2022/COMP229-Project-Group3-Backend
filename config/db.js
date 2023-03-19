require("dotenv").config();
// console.log(process.env.MongoConnectionString);
module.exports = {
  URI: process.env.MongoConnectionString,
};
