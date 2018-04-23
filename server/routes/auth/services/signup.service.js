const User = require('./../user.model');
const {GenerateResponse} = require('./../../../utils/response.util');
const {
    addUserTodb,
    isEmailAvailable,
    isUserAvailable,
} = require('../auth.utils');
const HttpStatus = require('http-status-codes');

const validate = req => {
    req.assert('username', 'Username is Not Valid Phone number').isMobilePhone('en-IN');
    req.assert('email', 'Email is Not Valid').isEmail();
    req.assert('phone', 'Phone number is Not Valid').isMobilePhone('en-IN');
    req.checkBody('username', 'Username and phone number doesnot match').matches(req.body.phone);
    req.assert('password', 'Password cannot be blank').notEmpty();
    req.assert('password', 'Password must be at least 8 characters long').len(8);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
}

const signup = async (req, res) => {
    validate(req);

    const errors = req.validationErrors();

    if (errors) {
        const msg = errors[0].msg;
        res
            .status(HttpStatus.UNAUTHORIZED)
            .send(GenerateResponse(HttpStatus.UNAUTHORIZED, msg));
        return;
    }

    const isUsernameUsed = await isUserAvailable(req.body.username);

    if (isUsernameUsed) {
        res
            .status(HttpStatus.CONFLICT)
            .send(GenerateResponse(HttpStatus.CONFLICT, 'Account with that username already exists'));
        return;
    }

    try {
        const userToAdd = new User(req.body);
        const user = await addUserTodb(userToAdd);
        if(user) {                    
            res.status(HttpStatus.OK).send(GenerateResponse(HttpStatus.OK, "User is succesfully registered", user));
            return;
        }
        else {                    
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(GenerateResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Error in processing. Please try again"));
            return;
        }
    } catch (e) {
        logger.error('Exception adding user', e)
        let msg = 'Something went wrong please try again';
        if (error.name === "ValidationError") {
            msg = error.message;
        }
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(GenerateResponse(HttpStatus.INTERNAL_SERVER_ERROR, msg));
    }
}

module.exports = signup;