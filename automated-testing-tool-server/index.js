const express = require('express');
const mongoose = require('mongoose');
const Message = require('./models/Message');
const app = express();
const cors = require('cors');
const Axios = require('axios')
require('dotenv').config();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://openbook:password12345@openbookcluster.tky7ab3.mongodb.net/?retryWrites=true&w=majority&dbName=openbook_database',{useNewUrlParser: true})

async function store_message_in_db(usr_message, bot_response) {
    console.log("usr_message")
    console.log(usr_message)
    try{
        const message = await Message.create({user_message: usr_message, chatbot_response: bot_response, correct_response: {determined: false, value: ""}, response_assessment: "undertermined"})
        console.log('finished saving')
        await message.save()
        
    } catch(err){
        console.log(err.message)
    }

}

async function retrieve_all_messages_in_db() {

    try{
        const all_messages = await Message.find()
        // console.log(all_messages)
        return all_messages
    } catch(err){
        console.log(err.message)
    }

}

async function update_message_with_user_evaluation(msg_id, user_assessment, chatbot_response) {

    try{
        var ObjectId = require('mongoose').Types.ObjectId
        const filter = {_id: new ObjectId(msg_id)};

        var update = {}
        if (user_assessment==="correct") {
            update = { response_assessment: user_assessment, correct_response: {determined: true, value: chatbot_response}  };
        } else{
            update = { response_assessment: user_assessment, correct_response: {determined: false, value: ""}  };
        }        
        // `doc` is the document _before_ `update` was applied
        let doc = await Message.findOneAndUpdate(filter, update, {new: true});
        let doc2 = await Message.find()

        return doc2
    } catch(err){
        console.log(err.message)
    }

}

async function update_message_based_on_newly_provided_artifact_id(message_id, new_response_assessment) {

    try{
        var ObjectId = require('mongoose').Types.ObjectId
        const filter = {_id: new ObjectId(message_id)};

        const update = { response_assessment: new_response_assessment};

      
        // `doc` is the document _before_ `update` was applied
        let doc = await Message.findOneAndUpdate(filter, update, {new: true});
        let doc2 = await Message.find()

        return doc2
    } catch(err){
        console.log(err.message)
    }

}


function separate_into_distinct_message(user_prompt) {
    const number_of_questions = (user_prompt.match(/\?/g) || []).length

    if (number_of_questions===0) {
        return [user_prompt]
    }


    const index_of_question_mark = [-1]
    for(var i=0; i<user_prompt.length;i++) {
        if (user_prompt[i] === "?") index_of_question_mark.push(i);
    }

    const list_of_question = []
    for (let index = 0; index < number_of_questions; index++) {
        list_of_question.push(user_prompt.slice(index_of_question_mark[index]+1,index_of_question_mark[index+1]+1))
    }
    
    return list_of_question
}

async function compare_old_and_new_responses(all_current_msg, all_new_msg) {
    var ObjectId = require('mongoose').Types.ObjectId
    var relevant_new_msg
    var current_id
    const delta_list = []
    for (let index = 0; index < all_current_msg.length; index++) {
        relevant_new_msg = []
        current_id = new ObjectId(all_current_msg[index]["_id"])
        relevant_new_msg = all_new_msg.filter((new_msg)=>current_id.equals(new_msg["ref_id"]))
        // console.log("relevant_new_msg")        
        // console.log(relevant_new_msg)
        if (all_current_msg[index]["response_assessment"]==="correct") {
            if (relevant_new_msg[0].new_answer === all_current_msg[index].correct_response.value) {
                delta_list.push({response_assessment: "correct-correct", id: relevant_new_msg[0].ref_id})
            } else{
                delta_list.push({response_assessment: "correct-incorrect", id: relevant_new_msg[0].ref_id})
            }
        } 
        console.log("delta_list")
        console.log(delta_list)
    }

    const list_of_messages = []

    if (delta_list.length>0) {
        for (let index = 0; index < delta_list.length; index++) {        
            list_of_messages.push(await update_message_based_on_newly_provided_artifact_id(delta_list[index].id, delta_list[index].response_assessment))
            if (list_of_messages.length === delta_list.length) {
                console.log("list_of_messages")
                console.log(list_of_messages[delta_list.length-1])
                return list_of_messages[delta_list.length-1]
            }
        }        
    } else{
        return retrieve_all_messages_in_db()
    }

    
     
}

app.post("/submit-message-and-receive-response", async (req,res)=>{

    const user_msg = req.body.user_msg
    const artifact_id = req.body.artifact_id

    const message_list = separate_into_distinct_message(user_msg)

    console.log("user_msg")
    console.log(message_list)
    console.log("artifact_id")
    console.log(artifact_id)

    // message_list.forEach(user_prompt => {
    //     Axios.post(`https://api.openbook.botpress.cloud/v1/artifacts/${artifact_id}/query`,
    //     JSON.stringify({
    //             query: user_prompt,
    //             history: [],
    //             answer_level: "strict"
    //         }),
    //         {
    //             headers: {
    //                 Authorization: 'Bearer ' + process.env.API_KEY,
    //                 'Content-Type': 'application/json'
    //             }
    //         }).then((response)=>{
    //             console.log('I THINK IT WORKED!! :)')
    //             console.log(response.data)
    //             store_message_in_db(user_prompt, response.data.result.answer)
    //         }).catch((err)=>{
    //             console.log('Hmm, something is wrong.!')
    //             // console.log(err)
    //         })
    // });

    let promises = [];
    let counter = 0
    for (i = 0; i < message_list.length; i++) {
        promises.push(
            Axios.post(`https://api.openbook.botpress.cloud/v1/artifacts/${artifact_id}/query`,
            JSON.stringify({
                    query: message_list[i],
                    history: [],
                    answer_level: "strict"
                }),
                {
                    headers: {
                        Authorization: 'Bearer ' + process.env.API_KEY,
                        'Content-Type': 'application/json'
                    }
                }).then(async (response)=>{
                    console.log('I THINK IT WORKED!! :)')
                    console.log(counter)
                    await store_message_in_db(message_list[counter], response.data.result.answer)
                    counter ++
                }).catch((err)=>{
                    console.log('Hmm, something is wrong.!')
                    console.log(err)
                    counter ++
                })
        )
    }

    Promise.all(promises).then(() => {
        console.log("stored successfully.")
        retrieve_all_messages_in_db().then((all_msgs)=>res.send(all_msgs))

    });
})

app.post("/submit-user-evaluation", async (req,res)=>{
    const msg_id = req.body.msg_id
    const user_assessment = req.body.user_assessment
    const chatbot_response = req.body.chatbot_response

    console.log("msg_id")
    console.log(msg_id)
    console.log("user_assessment----------------------------------------------------------------------")
    console.log(user_assessment)
    

    res.send(await update_message_with_user_evaluation(msg_id, user_assessment, chatbot_response))
    // console.log("Update below")
    // console.log(update_message_with_user_evaluation(msg_id, user_assessment, chatbot_response))
})


app.post("/check_all_prior_responses", async (req,res)=>{
    const artifact_id = req.body.artifact_id
    console.log("artifact_id")
    console.log(artifact_id)

    const all_current_msg = await retrieve_all_messages_in_db();   
    const all_new_msg = [];
    let promises = [];
    let counter = 0;

    for (i = 0; i < all_current_msg.length; i++) {
        promises.push(
            Axios.post(`https://api.openbook.botpress.cloud/v1/artifacts/${artifact_id}/query`,
            JSON.stringify({
                    query: all_current_msg[counter].user_message,
                    history: [],
                    answer_level: "strict"
                }),
                {
                    headers: {
                        Authorization: 'Bearer ' + process.env.API_KEY,
                        'Content-Type': 'application/json'
                    }
                }).then(async (response)=>{
                    console.log('I THINK IT WORKED!! :)')
                    // console.log(counter)
                    all_new_msg.push({new_answer: response.data.result.answer, ref_id: all_current_msg[counter]['_id'] })
                    counter ++
                }).catch((err)=>{
                    console.log('Hmm, something is wrong.!')
                    // console.log(err)
                    counter ++
                })
        )
    }

    Promise.all(promises).then(async () => {
        console.log("all_new_msg~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
        // console.log(all_new_msg[0].data)
        res.send(await compare_old_and_new_responses(all_current_msg, all_new_msg))

    });
    // console.log(all_msg)
    // res.send(await update_message_with_user_evaluation(msg_id, user_assessment, chatbot_response))
    // console.log("Update below")
    // console.log(update_message_with_user_evaluation(msg_id, user_assessment, chatbot_response))
})

app.get("/", (req,res)=>{
    // const sql_query
    console.log('Server is up and running!')      
})


app.listen(3001, ()=>{
    console.log('SERVER IS LIVE ON PORT 3001 :)')
})