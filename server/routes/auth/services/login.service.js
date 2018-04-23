const passport = require("passport");
var HttpStatus = require('http-status-codes');
const {GenerateResponse} = require('./../../../utils/response.util'); 

const validate = req => {
  req.assert("username", "Username is not valid phone number").isMobilePhone("en-IN");
  req.assert("password", "Password cannot be blank").notEmpty();
  req.assert("password", "Password must be minimum 8 characters").len(8);
  //req.sanitize("email").normalizeEmail({ gmail_remove_dots: false });
};

const _promisifiedPassportAuthentication = (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) reject(err);
      if (user) resolve(user);
      if (!user) reject(info);
    })(req, res, next);
  });
}

const login = async (req, res, next) => {
  validate(req);

  const errors = req.validationErrors();

  if (errors) {
    const msg = errors[0].msg;
    return res.status(HttpStatus.UNAUTHORIZED).send(GenerateResponse(HttpStatus.UNAUTHORIZED, msg));
  }

  try {
    let user = await _promisifiedPassportAuthentication(req, res, next);
    user = JSON.parse(JSON.stringify(user));
    delete user.password;
    res.status(HttpStatus.OK).send(GenerateResponse(HttpStatus.OK, "Login Successful", { user, sessionID: req.sessionID }));
  } catch (e) {
    logger.error("Something went wrong.", e);
    res.status(HttpStatus.UNAUTHORIZED).send(GenerateResponse(HttpStatus.UNAUTHORIZED, e.msg));
  }
};

module.exports = login;
