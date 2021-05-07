const mongoose = require('./../database/mongodb.js');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;
const UserDetail = new Schema({
    username: { type: String, minLength: 3, required: true, unique: true },
    password: { type: String, minLength: 8, required: true }
});
UserDetail.plugin(passportLocalMongoose);
const UserDetails = mongoose.model('userInfo', UserDetail, 'userInfo');
module.exports = UserDetails;