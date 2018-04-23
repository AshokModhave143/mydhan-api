
const route = require('express').Router();
require('./passport.config');

//Routes 
route.post('/logIn', require('./services/login.service'));
route.post('/signUp', require('./services/signup.service'));
route.post('/logout', require('./services/logout.service'));
route.post('/forgot', require('./services/forgotPassword.service'));
route.post('/reset', require('./services/resetPassword.service'));

route.post('/verifyUser', require('./services/verify.service').verifyUser);
route.get('/verifyPhone/:phone', require('./services/verify.service').verifyPhone);
route.post('/verifyOTP', require('./services/verify.service').verifyOTP);


//Export module
module.exports = route;
