const mongoose = require('./../database/mongodb.js');
const Schema = mongoose.Schema;
const TopicDetail = new Schema({
    topic: { type: String, minLength: 3, required: true, unique: false },
    description: { type: String, required: true },
    created_by: { type: Schema.Types.ObjectId, ref: 'UserDetails', required: true, unique: false },
    created_at: { type: Date, default: Date.now }
})
TopicDetail.pre('deleteOne', function(next) {
    const topic_id = this.getQuery()["_id"];
    mongoose.model("replyInfo").deleteMany({ topic: topic_id }, function(err, result) {
        if (err) {
            console.log(`error ${err}`);
            next(err);
        } else {
            console.log('success');
            next();
        }
    });
});
TopicDetail.index({ topic: 1, created_by: 1 }, { unique: true })
const TopicDetails = mongoose.model('topicInfo', TopicDetail, 'topicInfo');
module.exports = TopicDetails;