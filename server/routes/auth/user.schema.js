const mongoose = require('mongoose'),
	Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const SALT_FACTOR = 10;

const user = {
    username: {
        type: String,
        required: "username is required",
        unique: true
    },
    password: {
        type: String,
        required: "Password is required"
    },
    salutation: {
        type: String,
        required: "Salutation is required"
    },
    firstname: {
        type: String,
        required: "Firstname is required"
    },
    lastname: {
        type: String,
        required: "Lastname is required"
    },
    email: {
        type: String,
        required: "Email is required",
        lowercase: true
    },
    phone: {
        type: Number,
        required: "Phone number is required",
        unique: true
    },
    gender: {
        type: String,
        required: "Gender is Required"
    },
    age: {
        type: Number
    },
    income: {
        type: String,
        required: "Income is Required"
    },
    type: {
        type: String,
        required: "User Type is required e.g. Admin or Broker or Sub-broker or Customer"
    },
	emailVerified: {
		type: Boolean,
		require: "Email Verified Flag is required",
	},
	phoneVerified: {
		type: Boolean,
		require: "Phone Verified Flag is required"
	},
    timeStamp: {
        type: Date,
        required: "Timestamp is required"
    }
};

const userSchema = new Schema(user, { timestamps: true });

userSchema.pre('save', function save(next) {
	const user = this;
	if (!user.isModified('password')) {
		return next();
	}
	bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
		if (err) {
			return next(err);
		}
		bcrypt.hash(user.password, salt, null, (err, hash) => {
			if (err) {
				return next(err);
			}
			user.password = hash;
			next();
		});
	});
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
	bcrypt.compare(String(candidatePassword), this.password, (err, isMatch) => {
		cb(err, isMatch);
	});
};

module.exports = mongoose.model('User', userSchema);
