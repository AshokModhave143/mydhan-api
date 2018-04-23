//Import libs
const HttpStatus = require('http-status-codes');
const { GenerateResponse } = require('./../../../utils/response.util');
const {
    isPhoneAvailable,
    isUserAvailable,
    updatePhoneVerifiedStatus,
} = require('../auth.utils');
const { generateOTP, findOrUpdateOtp, validateOTP, isOtpTypeAvailable} = require('./../../otp');

//Functions
const validatePhone = req => {
    req.assert('phone', 'Phone number is Not Valid').isMobilePhone('en-IN');
    req.assert('phone', 'Phone number cannot be blank').notEmpty();
};
const validateUser = req => {
    req.assert('username', 'Phone number is Not Valid').isMobilePhone('en-IN');
    req.assert('username', 'Phone number cannot be blank').notEmpty();
};
const verifyUser = async (req, res)=> {
    validateUser(req);

    const errors = req.validationErrors();
    if(errors) {
        const msg = errors[0].msg;
        return res.status(HttpStatus.UNAUTHORIZED).send(GenerateResponse(HttpStatus.UNAUTHORIZED, msg));
    }
    const isUserExists = await isUserAvailable(req.body.username);
    if(!isUserExists) {
        res.status(HttpStatus.BAD_REQUEST).send(GenerateResponse(HttpStatus.BAD_REQUEST, 'Phone number not found'));
        return;
    }

    try {
        //generate OTP
        const otp = await generateOTP(5);
        //Update OTP into DB for phone
        const updateOtp = await findOrUpdateOtp(req.body.username, otp);
        if(!updateOtp) {
            res.status(HttpStatus.FAILED_DEPENDENCY).send(GenerateResponse(HttpStatus.FAILED_DEPENDENCY, 'Error while updating OTP'));
            return;
        }
        //Send OTP - verification code

        //send response back
        res.status(HttpStatus.OK).send(GenerateResponse(HttpStatus.OK, 'OTP has been sent to registered mobile'));
    } catch(e) {
        logger.error('Exception while ', e);
        let msg = 'Error in processing. Please try again';
        if(error.name == "ValidationError") {
            msg = error.message;
        }
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(GenerateResponse(HttpStatus.INTERNAL_SERVER_ERROR, msg));
    }
};
const verifyPhone = async (req, res)=> {
    validatePhone(req);

    const errors = req.validationErrors();
    if(errors) {
        const msg = errors[0].msg;
        res.status(HttpStatus.UNAUTHORIZED).send(GenerateResponse(HttpStatus.UNAUTHORIZED, msg));
    }
    const isPhoneAvail = await isPhoneAvailable(req.params.phone);
    if(!isPhoneAvail) {
        res.status(HttpStatus.BAD_REQUEST).send(GenerateResponse(HttpStatus.BAD_REQUEST, 'Phone number not found'));
        return;
    }
    
    try {
        //generate OTP
        const otp = await generateOTP(5);
        //Update OTP into DB for phone
        const updateOtp = await findOrUpdateOtp(req.params.phone, otp);
        if(!updateOtp) {
            res.status(HttpStatus.FAILED_DEPENDENCY).send(GenerateResponse(HttpStatus.FAILED_DEPENDENCY, 'Error while updating OTP'));
            return;
        }
        //Send OTP - verification code

        //send response back
        res.status(HttpStatus.OK).send(GenerateResponse(HttpStatus.OK, 'OTP has been sent to registered mobile'));
    } catch(e) {
        logger.error('Exception while ', e);
        let msg = 'Error in processing. Please try again';
        if(error.name == "ValidationError") {
            msg = error.message;
        }
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(GenerateResponse(HttpStatus.INTERNAL_SERVER_ERROR, msg));
    }
};
verifyOTP = async (req, res)=> {
    validatePhone(req);

    const errors = req.validationErrors();
    if(errors) {
        const msg = errors[0].msg;
        res.status(HttpStatus.UNAUTHORIZED).send(GenerateResponse(HttpStatus.UNAUTHORIZED, msg));
        return;
    }

    let phone  = req.body.phone;
    let otpToken = req.body.otpToken;

    //check the OTP and phone number
    const isOtpValid = await validateOTP(phone, otpToken);
    if(!isOtpValid) {
        res.status(HttpStatus.BAD_REQUEST).send(GenerateResponse(HttpStatus.BAD_REQUEST, 'OTP is invalid or has expired'));
        return;
    }
    try {
        //Update the phoneVerified flag
        const updatePhoneVerifyFlag = await updatePhoneVerifiedStatus(phone, true);
        if(!updatePhoneVerifyFlag) {
            res.status(HttpStatus.UNAUTHORIZED).send(GenerateResponse(HttpStatus.UNAUTHORIZED, 'Unable to update OTP flag'));
            return;
        }
        res.status(HttpStatus.OK).send(GenerateResponse(HttpStatus.OK, 'Phone number verified successfully', updatePhoneVerifyFlag));
    } catch(e) {
        logger.error('Exception while verifying OTP', e);
        let msg = 'Error in processing. Please try again';
        if(error.name == "ValidationError") {
            msg = error.message;
        }
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(GenerateResponse(HttpStatus.INTERNAL_SERVER_ERROR, msg));
    }
}

//Exports module
module.exports = {verifyUser, verifyPhone, verifyOTP};
