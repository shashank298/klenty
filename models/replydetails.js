const mongoose = require('./../database/mongodb.js');
const Schema = mongoose.Schema;
const ReplyDetail = new Schema({
    topic: { type: Schema.Types.ObjectId, ref: 'TopicDetails', required: true },
    replied_by: { type: Schema.Types.ObjectId, ref: 'UserDetails', required: true },
    created_at: { type: Date, default: Date.now },
    reply: { type: String, required: true, minLength: 1 }
})
const ReplyDetails = mongoose.model('replyInfo', ReplyDetail, 'replyInfo');
module.exports = ReplyDetails;