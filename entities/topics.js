const TopicDetails = require('./../models/topicdetails.js');
const config = require('./../settings.json').rest;

class Topics {

    async createTopic(request, response) {
        request.body.created_by = request.user._id;
        let newTopic = new TopicDetails(request.body);
        let saveData = await newTopic.save().catch((error) => { return error });
        let responseMessage = config.failureMessage;
        if (saveData instanceof Error) {
            responseMessage.message = saveData.message;
            response.status(config.baddataStatus).send(responseMessage);
            return;
        }
        responseMessage = config.successfullMessage;
        responseMessage.message = "new topic created successfully";
        response.send(responseMessage);
    }
    
    async fetchTopics(request, response) {
        let query_conditions = {}
        if (request.query && request.query.topic && request.query.topic.length) query_conditions.topic = request.query.topic;
        let allTopics = await TopicDetails.find(query_conditions);
        let responseMessage = config.successfullMessage;
        responseMessage.message = allTopics;
        response.send(responseMessage);
    }
}
module.exports = new Topics();