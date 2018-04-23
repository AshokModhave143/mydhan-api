const ENV = "dev";
//Options
//dev, prod
var path = "./config/" + ENV;
var config = require(path);
console.log("Picking " + ENV + " credentials");

exports.getConfig = function() {
  return config;
};

exports.mailConfig = function() {
  return {};
};
