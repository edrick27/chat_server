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
            payload.msg = await uploadFile(payload, ".jpg");
        }

        if (payload.type == 'AUDIO') {
            payload.msg = await uploadFile(payload, ".wav");
        }

        const message = new Message(payload);
        let newMsg = await message.save();
        newMsg = await newMsg.populate({ path: 'from', select: ['name', 'urlpicture'] }).execPopulate();

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
    let userFrom = await User.findOne({ _id: payload.from });
    console.log("userFrom 1");
    console.log(userFrom);

    let organizationFrom = await Organization.findOne({ _id: userFrom.id_organization });
    

    console.log("organizationFrom 2");
    console.log(organizationFrom);
    console.log(payload);
    console.log(roomDB.participants);

    const usersOffline = await User
        .find({ 
            online: false, 
            $and: [
                { _id: { $in: roomDB.participants } },
                { _id: { $ne: payload.from }, }
            ],
         })
        .select('wh_id');
        
        
    let arrayUserOffline = usersOffline.map((user) => user.wh_id);

    try {

        let data = {
            title: userFrom.name,
            message: payload.msg,
            created_by: userFrom.wh_id,
            users: arrayUserOffline,
            chat_room: JSON.stringify(roomDB),
        };

        console.log("userFrom 3");
        console.log(data);
        
        let url = `${organizationFrom.url}/api/sendChatNotification`
        url = url.replace("http", "https");
        console.log(url);

        const response = await axios.post(
            url,
            data,
            { headers: { "Content-Type": "application/json" } }
        );

        console.log("response 5");
        console.log(response.status);
        console.log(response);
    } catch (error) {}
}

const uploadFile = (payload, ext) => {

    const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);
    const s3 = new AWS.S3({
        endpoint: spacesEndpoint,
        accessKeyId: process.env.DO_SPACES_KEY,
        secretAccessKey: process.env.DO_SPACES_SECRET
    });

    let client = process.env.DO_SPACES_CLIENT;
    let name = client + '/' + uuid.v4() + ext;
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

    const roomDB = await Room.findById(idroom);
    roomDB.last_msg = idmessage;
    let room = await roomDB.save();

    return true;
}

const setMsgRead = async (idroom, user_uid) => {

    try {
        await Message.updateMany( 
            { 
                room: idroom,
                read_by: { $ne: user_uid }
            }, 
            { $addToSet: { read_by: user_uid } } 
        );
    } catch (error) { 
        return false; 
    }

    return true;
}


module.exports = {
    userConneted,
    userDisConneted,
    saveMessage,
    getMessages,
    sendNotifications,
    getUserTyping,
    setMsgRead,
    updateLastmsgRoom
}

