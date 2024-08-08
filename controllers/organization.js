const { response } = require("express");
const Organization = require("../models/organization");
const User = require("../models/user");
const Room = require("../models/room");
const Message = require("../models/message");

const deleteOrganization =  async (req, res = response) => {

    if(!req.body.key == process.env.API_KEY) {
        return res.status(400).json({
            ok: false,
            msg: 'API KEY no valida'
        });
    }

    const { organizationId } = req.body;
    
    try {
        // await User.deleteMany({ id_organization: organizationId });

        const rooms = await Room.find({ participants: { $elemMatch: { id_organization: organizationId } } });
        const roomIds = rooms.map(room => room._id);

        await Room.deleteMany({ _id: { $in: roomIds } });

        await Message.deleteMany({ room: { $in: roomIds } });

        // await Organization.deleteOne({ _id: mongoose.Types.ObjectId(organizationId) });

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

module.exports = {
    deleteOrganization
};