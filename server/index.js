const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const bodyparser = require('body-parser');
const http = require('http');
const logger = require('./utils/logger');
global.logger = logger;
const expressValidator = require('express-validator');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const dbConnect = require('./db.js');
const config = require('./config.js');
const configVals = config.getConfig();

const environment = process.env.NODE_ENV;
const isProd = 'prod' === environment;

const app = new express();

app.use(helmet());
app.use(compression());
app.use(expressValidator());
app.use(bodyparser.json());
app.use(express.static('./public'));
app.set('port', configVals.serverPort);
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: configVals.session_secret,
    cookie: {maxAge: 60 * 30000},
    store: new MongoStore({
      uri_decode_auth: true,
      collection: 'sessions',
      url: configVals.mongoUrl,
      autoReconnect: true,
      clear_interval: 3600,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  next();
});
// Passport config

function testFunction(req, res, next) {
  //console.log(req.header);
  console.log(req.get('Authorization'));
  next();
}

app.use('/*', testFunction);

// All Routes
// add this to have authorize access to api call --> passport.authenticate('bearer', {session: false})
app.use('/auth', require('./routes/auth'));
app.use('/educational', require('./routes/educational'));
app.use('/lifejourney', require('./routes/lifejourney'));

// Http
const httpServer = http.createServer(app);

dbConnect.getConnection().then(() => {
  httpServer.listen(app.get('port'), () => {
    //logger.info("Server is up and running : " + app.get('port'));
    console.log('Server is up and running at localhost:' + app.get('port'));
  });
});
