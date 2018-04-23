//import libs
const passport = require('passport');
const HttpStatus = require('http-status-codes');
const {
    GenerateResponse
} = require('./../../../utils/response.util');
const {
    addUserTodb,
    isUserAvailable
} = require('./../auth.utils');

//Functions
const validate = req => {
    //validate request    
    req.assert("username", "Username is Not Valid phone number").isMobilePhone("en-IN");
    req.assert("username", "Username should not be blank").notEmpty();
    req.assert("newPassword", "Password cannot be blank").notEmpty();
    req.assert("newPassword", "Password must be at least 8 characters long").len(8);
    req.assert("confirmPassword", "Passwords do not match").equals(req.body.newPassword);
};

const _promisifiedPassportAuthentication = (req, res, next) => {
    return new Promise((resolve, reject) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) reject(err);
            if (user) resolve(user);
            if (!user) reject(info);
        })(req, res, next);
    });
};

const resetPassword = async (req, res, next) => {
    validate(req);

    const errors = req.validationErrors();
    if (errors) {
        const msg = errors[0].msg;
        return res.status(HttpStatus.UNAUTHORIZED).send(GenerateResponse(HttpStatus.UNAUTHORIZED, msg));
    }
    console.log('Set New password');
    try {
        let user = await _promisifiedPassportAuthentication(req, res, next);
        console.log('Reset : ' + user);
        if (!user) {
            return res.status(HttpStatus.UNAUTHORIZED).send(GenerateResponse(HttpStatus.UNAUTHORIZED, "Invalid Old password"));
        }
        user.password = req.body.newPassword;

        const addeduser = await addUserTodb(user);
        if (addeduser) {
            req.logIn(addeduser, (err) => {
                //send email if successful
                if (err) {
                    return res.status(HttpStatus.UNAUTHORIZED).send(GenerateResponse(HttpStatus.UNAUTHORIZED, 'Error in processing. Unable to change password'));
                }
                res.status(HttpStatus.OK).send(GenerateResponse(HttpStatus.OK, 'Password for your account ' + addeduser.username + ' has been changed successfully', addeduser));
            });
        } else {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(GenerateResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Error in processing. Unable to change password'));
        }
    } catch (e) {
        logger.error("Error in processing for Reset password", e);
        console.log(e);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(GenerateResponse(HttpStatus.INTERNAL_SERVER_ERROR, e.msg));
    }
};

//Export Module
module.exports = resetPassword;