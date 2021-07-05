const { response } = require("express");
const Room = require("../models/room");
const roomType = require("../enum/room_enum");
const { sendNotifications } = require('./socket');


const getRooms = async (req, res = response) => {

    const skip = Number(req.query.skip) || 0;

    const roomsDB = await Room
        .find({ participans: req.query.user_uid })
        .select(['name', 'urlpicture', 'type'])
        .populate({ path: 'last_msg', select: ['msg', 'type', 'createdAt'] })
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

        if (type == roomType.GROUP) {
            sendNotifications({
                room: newRoom.id,
                from: participans[participans.length - 1],
                msg: `Te añadio al grupo ${newRoom.name}`
            });
        }
    } 

    res.json({
        ok: true,
        room: newRoom,
        msg: 'sala creada con exito!',
    });
}


const findRoom = async (req, res = response) => {

    const { idroom } = req.body;

    const roomDB = await Room
        .findOne({ _id: idroom })
        .select(['name', 'urlpicture', 'type'])
        .populate({ path: 'participans', select: ['name', 'urlpicture'] });

    res.json({
        ok: true,
        room: roomDB,
    });
}

module.exports = {
    getRooms,
    createRoom,
    findRoom
};