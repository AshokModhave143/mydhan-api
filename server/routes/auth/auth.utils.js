//Import Libs
const UserModel = require('./user.schema');

//Functions
const isEmailAvailable = async function(email) {
	return await UserModel.findOne({ email: email });
};
const addUserTodb = async function(userInfo) {
	const user = new UserModel(userInfo);
	return await user.save();
};
const isUserAvailable = async function(username) {
	return await UserModel.findOne({ username: username});
};
const isPhoneAvailable = async function(phone) {
	return await UserModel.findOne({phone: phone});
};
const updatePhoneVerifiedStatus = async function(phone, flag) {
	let qSearch = {phone: phone};
	let uValues = {$set: {phoneVerified: flag}};
	return await UserModel.updateOne(qSearch, uValues);
};

//Export
module.exports = {
	isEmailAvailable,
	addUserTodb,
	isUserAvailable,
	isPhoneAvailable,
	updatePhoneVerifiedStatus,
};
