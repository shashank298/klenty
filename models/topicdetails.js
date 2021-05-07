const mongoose = require('./../database/mongodb.js');
const Schema = mongoose.Schema;
const TopicDetail = new Schema({
    topic: { type: String, minLength: 3, required: true, unique: true },
    description: { type: String, required: true },
    created_by: { type: Schema.Types.ObjectId, ref: 'UserDetails', required: true },
    created_at: { type: Date, default: Date.now }
})
const TopicDetails = mongoose.model('topicInfo', TopicDetail, 'topicInfo');
module.exports = TopicDetails;