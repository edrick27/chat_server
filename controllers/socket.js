const axios = require('axios');
const Message = require("../models/message");
const User = require("../models/user")
const Organization = require("../models/organization")


const userConneted = async (uid = '') => {

    const userDB  = await User.findById(uid);
    userDB.online = true;
    await userDB.save();

    return userDB;
}

const userDisConneted = async (uid = '') => {

    const userDB  = await User.findById(uid);
    userDB.online = false;
    await userDB.save();

    return userDB;
}

const saveMessage = async (payload) => {

    try {

        const message = new Message(payload);
        await message.save();
        
        return true;
    } catch (error) {
        return false;
    }
}

const getMessages = async (req, res = response) => {

    const myId = req.query.uid;
    const fromId = req.params.from;


    const messageDB = await Message.find({ 
        $or: [{ from: myId, to: fromId}, { from : fromId, to: myId}] 
    })
    .sort({ createdAt: 'desc' })
    .limit(30);

    res.json({
        ok: true,
        messages: messageDB
    });
}

const sendNotifications = async (payload) => {

    const fromId = payload.from;

    const userFrom = await User
            .findOne({ _id: fromId });

    const OrganizationDB = await Organization
            .findOne({ id: userFrom.id_organization });

    const usersOffline = await User
            .find({ online: false, id_organization: OrganizationDB.id })
            .select('wh_id');

    let arrayUserOffline = usersOffline.map((user) => user.wh_id);

    try {

        let data = {
            chat_room: payload.to,
            title: userFrom.name,
            message: payload.msg,
            created_by: userFrom.wh_id,
            users: arrayUserOffline
        };

        const response = await axios.post(
            'https://acme.whagons.com/api/sendChatNotification', 
            data,
            { headers:{"Content-Type" : "application/json"} }
        );
    } catch (error) {
        console.log(error.response.data);
    }
}


module.exports = {
    userConneted,
    userDisConneted,
    saveMessage,
    getMessages,
    sendNotifications
}

