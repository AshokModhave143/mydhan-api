//Import Libs
const crypto = require('crypto');
const OtpModel = require('./otp.schema');

//Functions
const getRandomBytes = async function(size) {
	const randomVal = await crypto.randomBytes(size);
	const token = await randomVal.toString('hex');
	return token;
};
const generateOTP = async function(size) {
	return await getRandomBytes(size);
};
const findOrUpdateOtp = async function(type, otpToken) {
	let qSearch = {otpType: type};
	let uValues = {$set: { otpToken: otpToken, createdAt: Date.now }};
	let opts = {new: true, upsert: true };
	return await OtpModel.findOneAndUpdate(qSearch, uValues, opts);
}
const validateOTP = async function(type, otpToken) {
	return await OtpModel.findOne({otpType: type, otpToken: otpToken});	
};
const isOtpTypeAvailable = async function(type, token) {
	return await OtpModel.findOne({otpType: type, otpToken: token});
};1

module.exports = {
    getRandomBytes,
    generateOTP,
    findOrUpdateOtp,
    validateOTP,
    isOtpTypeAvailable,
};