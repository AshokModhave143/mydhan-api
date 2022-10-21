const dotenv = require("dotenv").config();

if (dotenv.error) {
  throw dotenv.error;
}

console.log(dotenv.parsed);

exports.getConfig = function () {
  return process.env;
};

exports.mailConfig = function () {
  return {};
};
