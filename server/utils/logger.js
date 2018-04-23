const winston = require('winston');
const fs = require('fs');


const config = require("../config");
const configVals = config.getConfig();
const logDir = configVals.logDir;
const logLevel = configVals.logLevel;
const maxFiles = configVals.maxFiles;

require('winston-daily-rotate-file');

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const transport = new winston.transports.DailyRotateFile({
    filename: `${logDir}/.log`,
    datePattern: 'yyyy-MM-dd',
    prepend: true,
    json: false,
    level: logLevel,
    zippedArchive: true,
    localTime: true,
    maxFiles: maxFiles
});

const logger = new (winston.Logger)({
    transports: [
        new winston.transports.Console(),
        transport
    ]
});

module.exports = logger;