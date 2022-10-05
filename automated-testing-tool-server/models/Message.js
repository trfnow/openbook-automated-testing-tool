const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    user_message: {type: String, require:true},
    chatbot_response: {type: String, require:true},
    correct_response: {determined: Boolean, value: String},
    response_assessment: String,
    },
    { timestamps: true }
)

module.exports = mongoose.model("Message", messageSchema)