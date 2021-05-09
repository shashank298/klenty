const mongoose = require('./../database/mongodb.js');
const ReplyDetails = require('./../models/replydetails.js');
const UserDetails = require('./../models/userdetails.js');
const TopicDetails = require('./../models/topicdetails.js');
const config = require('./../settings.json').rest;

class Replies {

    async addReply(request, response) {
        request.body.topic = request.body.topic_id
        delete request.body.topic_id;
        request.body.replied_by = request.user._id;
        let newReply = new ReplyDetails(request.body);
        let responseMessage = config.failureMessage;
        let saveData = await newReply.save().catch((error) => { return error });
        if (saveData instanceof Error) {
            responseMessage.message = saveData.message;
            response.status(config.baddataStatus).send(responseMessage);
            return;
        }
        responseMessage = config.successfullMessage;
        responseMessage.message = "new topic created successfully"
        response.send(responseMessage);
    }

    async fetchReplies(request, response) {
        let query_conditions = {};
        let responseMessage = config.successfullMessage;
        if (request.query && request.query.topic && request.query.topic.length) query_conditions.topic = request.query.topic;
        let allReplies = await ReplyDetails.find(query_conditions);
        let replies_map = {};
        let user_ids = [];
        let user_replies = null;
        allReplies.map((reply, index) => {
            user_ids.push(mongoose.Types.ObjectId(reply.replied_by));
            replies_map[reply.replied_by] = replies_map[reply.replied_by] || [];
            replies_map[reply.replied_by].push(index);
        })
        let replied_users = await UserDetails.find({
            _id: {
                $in: user_ids
            }
        })
        allReplies = JSON.parse(JSON.stringify(allReplies));
        replied_users.map((user) => {
            user_replies = [];
            user_replies = replies_map[user._id];
            for (let i = 0; i < user_replies.length; i++) {
                allReplies[user_replies[i]].replied_by = user.username;
            }
        })
        responseMessage.message = allReplies;
        response.send(responseMessage);
    }
}
module.exports = new Replies();