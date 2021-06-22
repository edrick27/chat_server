const { response } = require("express");
const Room = require("../models/room");
const roomType = require("../enum/room_enum");


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

    let newRoom = null;
    const { participans, type } = req.body;
    
    if (type == roomType.PRIVATE) {
        findRoom = await Room.find({ participans: participans, type: roomType.PRIVATE});
        newRoom = (findRoom.length > 0) ? findRoom[0] : null;
    }  

    if (newRoom == null) {
        const room = new Room(req.body);
        newRoom = await room.save();
    } 

    res.json({
        ok: true,
        room: newRoom,
        msg: 'sala creada con exito!',
    });
}

module.exports = {
    getRooms,
    createRoom
};