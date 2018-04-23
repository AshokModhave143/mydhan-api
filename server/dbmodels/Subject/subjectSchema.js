const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const subject = {
    subject_name : {
        type: String,
        required: "Subject Name is required"
    }
};

const SubejctSchema = new Schema(subject, {timestamps: true});
module.exports = mongoose.model('Subjects', SubejctSchema);