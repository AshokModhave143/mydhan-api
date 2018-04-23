/**
 * User Model
 */
class User {
    constructor(params) {
        this.username = params.username;
        this.password = params.password;
        this.salutation = params.salutation;
        this.firstname = params.firstname;
        this.lastname = params.lastname;
        this.email = params.email;
        this.phone = params.phone;
        this.gender = params.gender;
        this.age = params.age;
        this.income = params.income;
        this.type = params.type;
        this.timeStamp = new Date(); //params.timeStamp
        this.emailVerified = params.emailVerified;
        this.phoneVerified = params.phoneVerified;
    }
}

module.exports = User;

/*
const constructUser = (data) => {
    return {
        'username': data.username,
        'password': data.password,
        'salutation': data.salutation,
        'firstname': data.firstname,
        'lastname': data.lastname,
        'email': data.email,
        'phone': data.phone,
        'gender': data.gender,
        'age': data.age,
        'income': data.income,
        'emailVerifed': false,
        'type': data.type,
        'timeStamp': new Date(),
        'resetPasswordToken': '',
        'resetPasswordExpires': ''
    }
}
*/