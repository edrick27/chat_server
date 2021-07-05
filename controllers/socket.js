const axios = require('axios');
const AWS = require('aws-sdk');
var uuid = require('uuid');
const Message = require("../models/message");
const User = require("../models/user");
const Room = require("../models/room");
const Organization = require("../models/organization");


const userConneted = async (user_uid = '') => {

    const userDB = await User.findById(user_uid);
    userDB.online = true;
    await userDB.save();

    return userDB;
}

const userDisConneted = async (user_uid = '') => {

    const userDB = await User.findById(user_uid);
    userDB.online = false;
    await userDB.save();

    return userDB;
}

const saveMessage = async (payload) => {

    try {

        if (payload.type == 'IMAGE') {
            payload.msg = await uploadImage(payload);
        }

        const message = new Message(payload);
        let newMsg = await message.save();
        newMsg = await newMsg.populate({ path: 'from', select: ['name', 'urlpicture'] }).execPopulate();
        console.log(`*** newMsg *** ${newMsg}`);

        return newMsg;
    } catch (error) {
        return false;
    }
}

const getMessages = async (req, res = response) => {

    const myId = req.query.uid;
    const idRoom = req.params.idRoom;

    const messageDB = await Message.find({ room: idRoom })
        .populate({ path: 'from', select: ['name', 'urlpicture'] })
        .sort({ createdAt: 'desc' })
        .limit(30);

    res.json({
        ok: true,
        messages: messageDB
    });
}

const sendNotifications = async (payload) => {

    const roomDB = await Room.findOne({ _id: payload.room });
    const userFrom = await User.findOne({ _id: payload.from });

    const usersOffline = await User
        .find({ 
            online: false, 
            $and: [
                { _id: { $in: roomDB.participans } },
                { _id: { $ne: payload.from }, }
            ],
         })
        .select('wh_id');
        
        
    let arrayUserOffline = usersOffline.map((user) => user.wh_id);

    console.log("************* arrayUserOffline *************");
    console.log(arrayUserOffline);
        
    try {

        let data = {
            title: userFrom.name,
            message: payload.msg,
            created_by: userFrom.wh_id,
            users: arrayUserOffline,
            chat_room: JSON.stringify(roomDB),
        };

        console.log(JSON.stringify(data));

        const response = await axios.post(
            'https://demov2.dinganddone.com/api/sendChatNotification',
            data,
            { headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.log(error.response.data);
    }
}

const uploadImage = (payload) => {

    const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);
    const s3 = new AWS.S3({
        endpoint: spacesEndpoint,
        accessKeyId: process.env.DO_SPACES_KEY,
        secretAccessKey: process.env.DO_SPACES_SECRET
    });

    let client = process.env.DO_SPACES_CLIENT;
    let name = client + '/' + uuid.v4() + ".jpg";
    let url = process.env.DO_SPACES_ROUTE + name
    let body = Buffer.from(payload.msg, 'base64');

    var params = {
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: name,
        Body: body,
        ACL: "public-read",
    };

    return new Promise((resolve, reject) => {
        s3.putObject(params, function (err, data) {
            if (err) { reject(err); }
            else { resolve(url); }
        });
    })
}

const getUserTyping = async (user_uid = '') => {

    const userDB = await User.findById(user_uid)
                             .select(['uid', 'name', 'urlpicture']);
    return userDB;
}

const updateLastmsgRoom = async (idroom, idmessage) => {

    console.log(`updateLastmsgRoom  idroom: ${idroom} idmessage: ${idmessage}`);

    const roomDB = await Room.findById(idroom);
    roomDB.last_msg = idmessage;
    let room = await roomDB.save();
    console.log("updateLastmsgRoom 2");
    console.log(room);

    return true;
}


module.exports = {
    userConneted,
    userDisConneted,
    saveMessage,
    getMessages,
    sendNotifications,
    getUserTyping,
    updateLastmsgRoom
}

