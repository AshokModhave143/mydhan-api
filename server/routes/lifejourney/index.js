//Import Libs
const route = require('express').Router();

//Routes
route.post('/createJourney', require('./services/createJourney.service'));
route.post('/modifyJourney', require('./services/modifyJourney.service'));

//Export Module
module.exports = route;