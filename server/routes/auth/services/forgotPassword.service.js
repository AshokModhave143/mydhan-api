//Import Libs
const passport = require('passport');
const HttpStatus = require('http-status-codes');
const {GenerateResponse} = require('./../../../utils/response.util');
const {isEmailAvailable, addUserTodb, isUserAvailable} = require('./../auth.utils');
const {generateOTP, getRandomBytes, findOrUpdateOtp} = require('./../../otp');
const User = require('./../user.schema');

//Functions
const validate = req => {
    req.assert("username", "Username is Not Valid phone number").isMobilePhone("en-IN");
    req.assert("username", "Username should not be blank").notEmpty();
    req.assert('password', 'Password cannot be blank').notEmpty();
    req.assert('password', 'Password must be at least 8 characters long').len(8);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);   
};

const forgotPassword = async (req, res)=> {
    validate(req);

    const errors = req.validationErrors();
    if(errors) {
        const msg = errors[0].msg;
        return res.status(HttpStatus.UNAUTHORIZED).send(GenerateResponse(HttpStatus.UNAUTHORIZED, msg));
    }
    try {
        let user = await isUserAvailable(req.body.username);
        if(!user) {
            return res.status(HttpStatus.UNAUTHORIZED).send(GenerateResponse(HttpStatus.UNAUTHORIZED, "Username not found"));
        }
        user.password = req.body.password;

        const adduser = await addUserTodb(user);
        if(adduser) {
            req.logIn(adduser, (err)=> {
                if(err) {
                    return res.status(HttpStatus.UNAUTHORIZED).send(GenerateResponse(HttpStatus.UNAUTHORIZED, 'Error in processing. Unable to set new password.'));
                }                
                //send email if successful
                res.status(HttpStatus.OK).send(GenerateResponse(HttpStatus.OK, 'Password for your account ' + adduser.username + ' has been changed successfully', adduser));
            });
        } else {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(GenerateResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Error in processing. Unable to change password'));
        }
    } catch(e) {
        logger.error("Exception thrown in Forgot password", e);
        let msg = "Error in processing. Please try again";
        if(error.name == "ValidationError") {
            msg = error.message;
        }
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(GenerateResponse(HttpStatus.INTERNAL_SERVER_ERROR, msg));
    }
};

module.exports = forgotPassword;