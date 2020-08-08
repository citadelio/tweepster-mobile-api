const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    userid : String,
    email : String,
    avatar : Object,
    created : {
        type : Date,
        default : Date.now
    },
    authtoken: String,
    authsecret: String,
})

module.exports = User = mongoose.model('user', UserSchema);