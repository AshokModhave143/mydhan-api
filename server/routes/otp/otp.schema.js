const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const otp = {
    otpType: {
        type: String,
        required: "OTP Type is required e.g. phone, email",
        unique: true
    },
    otpToken: {
        type: String,
        required: "OTP token is required"
    },
    createdAt: {
        type: Date
    }
};

const otpSchema = new Schema(otp, { timestamps: true });
otpSchema.index({createdAt: 1}, { expires: '1m'});

module.exports = mongoose.model('Otp', otpSchema);