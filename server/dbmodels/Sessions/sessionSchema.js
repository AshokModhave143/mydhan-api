const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const session = {
    _id: {
        type: String,
    },
    session:{
        type:String
    },
    expires:{
        type:Date
    }
};

const SessionSchema = new Schema(session);
module.exports = mongoose.model('Session', SessionSchema);