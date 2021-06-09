const { response } = require("express");
const Room = require("../models/room");


const getRooms = async (req, res = response) => {

    const skip = Number(req.query.skip) || 0;

    const roomsDB = await Room
        .find({ participans: req.query.user_uid })
        .select(['name', 'urlpicture', 'type'])
        .skip(skip)
        .limit(20);

    res.json({
        ok: true,
        rooms: roomsDB,
    });
}

const createRoom =  async (req, res = response) => {

    const room = new Room(req.body);
    await room.save();

    res.json({
        ok: true,
        msg: 'sala creada con exito!',
    });

}

module.exports = {
    getRooms,
    createRoom
};