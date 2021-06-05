const axios = require('axios');
const AWS = require('aws-sdk');
var uuid = require('uuid');
const Message = require("../models/message");
const User = require("../models/user");
const Organization = require("../models/organization");


const userConneted = async (uid = '') => {

    const userDB = await User.findById(uid);
    userDB.online = true;
    await userDB.save();

    return userDB;
}

const userDisConneted = async (uid = '') => {

    const userDB = await User.findById(uid);
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
        $or: [{ from: myId, to: fromId }, { from: fromId, to: myId }]
    })
        .sort({ createdAt: 'desc' })
        .limit(30);

    res.json({
        ok: true,
        messages: messageDB
    });
}

const sendNotifications = async (payload) => {

    const userFrom = await User.findOne({ _id: payload.from });

    const userTo = await User.findOne({ _id: payload.to });

    const OrganizationDB = await Organization.findOne({ id: userFrom.id_organization });

    const usersOffline = await User
        .find({ online: false, id_organization: OrganizationDB.id })
        .select('wh_id');

    let arrayUserOffline = usersOffline.map((user) => user.wh_id);

    try {

        let data = {
            title: userFrom.name,
            message: payload.msg,
            created_by: userFrom.wh_id,
            users: arrayUserOffline,
            chat_room: JSON.stringify(userTo),
        };

        console.log(JSON.stringify(data));

        const response = await axios.post(
            'https://acme.whagons.com/api/sendChatNotification',
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


module.exports = {
    userConneted,
    userDisConneted,
    saveMessage,
    getMessages,
    sendNotifications
}

