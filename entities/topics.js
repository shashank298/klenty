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

    async updateTopic(request, response) {
        let param_conditions = {}
        param_conditions.created_by = request.user._id;
        let responseMessage = config.failureMessage;
        if (request.params && request.params.topicId && request.params.topicId.length) param_conditions._id = request.params.topicId;
        else {
            responseMessage.message = "topic is not specified";
            response.status(config.baddataStatus).send(responseMessage);
            return;
        }
        let changedRecord = await TopicDetails.findOneAndUpdate(param_conditions, request.body).catch((error) => { return error });
        if (changedRecord instanceof Error) {
            responseMessage.message = changedRecord.message;
            response.status(config.baddataStatus).send(responseMessage);
            return;
        }
        if (!changedRecord) {
            responseMessage.message = "Record does not exist";
            response.status(config.baddataStatus).send(responseMessage);
            return;
        }
        responseMessage = config.successfullMessage;
        responseMessage.message = "topic updated successfully";
        response.send(responseMessage)
    }

    async deleteTopic(request, response) {
        let param_conditions = {}
        param_conditions.created_by = request.user._id;
        let responseMessage = config.failureMessage;
        if (request.params && request.params.topicId && request.params.topicId.length) param_conditions._id = request.params.topicId;
        else {
            responseMessage.message = "topic is not specified";
            response.status(config.baddataStatus).send(responseMessage);
            return;
        }
        let deleteRespone = await TopicDetails.deleteOne(param_conditions).catch((error) => { return error });
        if (deleteRespone instanceof Error) {
            responseMessage.message = deleteRespone.message;
            response.status(config.baddataStatus).send(responseMessage);
            return;
        }
        if (!deleteRespone.deletedCount) {
            responseMessage.message = "Record cannot be deleted";
            response.status(config.baddataStatus).send(responseMessage);
            return;
        }
        responseMessage = config.successfullMessage;
        responseMessage.message = "topic deleted successfully";
        response.send(responseMessage)
    }
}
module.exports = new Topics();