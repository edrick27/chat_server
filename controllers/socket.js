const Message = require("../models/message");
const user = require("../models/user")


const userConneted = async (uid = '') => {

    const userDB  = await user.findById(uid);
    userDB.online = true;
    await userDB.save();

    return userDB;
}

const userDisConneted = async (uid = '') => {

    const userDB  = await user.findById(uid);
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



module.exports = {
    userConneted,
    userDisConneted,
    saveMessage,
    getMessages
}

