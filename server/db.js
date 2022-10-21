const mongoose = require("mongoose");
const logger = require("./utils/logger");
const chalk = require("chalk");
const config = require("./config.js");
const configVals = config.getConfig();

var getConnection = function () {
  const mongoUrl = configVals.mongoUrl;

  return mongoose.connect(mongoUrl, function (err) {
    // Log Error
    logger.info("Inside connectToMongoDB MongoDB");
    if (err) {
      logger.info(chalk.red("Could not connect to MongoDB!"));
      console.log(chalk.red("Could not connect to MongoDB!"));
      logger.log(err);
      return err;
    } else {
      logger.info("Connected to MongoDB ");
      console.log("Connected to MongoDB ");
      mongoose.set("debug", true);
      return;
    }
  });
};

exports.getConnection = getConnection;
