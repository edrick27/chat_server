const { response } = require("express");
const Organization = require("../models/organization");
const User = require("../models/user");
const Room = require("../models/room");
const Message = require("../models/message");

const deleteChatsAPI =  async (req, res = response) => {

    const { apiKey } = req.body;

    if(apiKey != process.env.API_KEY) {
        return res.status(400).json({
            ok: false,
            msg: 'API KEY no valida'
        });
    }

    const { organizationId } = req.body;
    
    try {

        deleteChats(organizationId);

        res.json({
            ok: true,
            msg: 'Datos de laOrganización eliminados!'
        });

    } catch (error) {
        res.json({
            ok: false,
            msg: 'Error al eliminar'
        });
    }
}

const deleteOrganizationAPI =  async (req, res = response) => {

    const { apiKey } = req.body;

    if(apiKey != process.env.API_KEY) {
        return res.status(400).json({
            ok: false,
            msg: 'API KEY no valida'
        });
    }

    const { organizationId } = req.body;
    
    try {

        deleteChats(organizationId);
        User.deleteMany({ id_organization: organizationId });
        Organization.deleteOne({ _id: organizationId });

        res.json({
            ok: true,
            msg: 'Datos de laOrganización eliminados!'
        });

    } catch (error) {
        res.json({
            ok: false,
            msg: 'Error al eliminar'
        });
    }
}


const deleteChats =  async (organizationId) => {

    try {

        const users = await User.find({ id_organization: organizationId });
        const userIds = users.map(user => user._id);

        const rooms = await Room.find({ participants: { $in: userIds } });
        const roomIds = rooms.map(room => room._id);

        await Room.deleteMany({ _id: { $in: roomIds } });

        await Message.deleteMany({ room: { $in: roomIds } });

        res.json({
            ok: true,
            msg: 'Datos de laOrganización eliminados!'
        });

    } catch (error) {
        res.json({
            ok: false,
            msg: 'Error al eliminar Chats'
        });
    }
}

module.exports = {
    deleteChatsAPI,
    deleteOrganizationAPI
};