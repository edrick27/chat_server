const { response } = require("express");
const Room = require("../models/room");
const roomType = require("../enum/room_enum");
const { sendNotifications } = require('./socket');


const getRooms = async (req, res = response) => {

    const skip = Number(req.query.skip) || 0;
    let user_uid = req.query.user_uid;

    const roomsDB = await Room
        .find({ participants: user_uid })
        .select(['name', 'urlpicture', 'type'])
        .populate({
            path: 'unreadMsg',
            match: { 
                read_by: { $ne: user_uid },
                from: { $ne: user_uid }
            }
        })
        .populate({ 
            path: 'last_msg', select: ['msg', 'type', 'createdAt'],
            populate : {
                path : 'from',
                select: ['name']
            }
        })
        .sort({ updatedAt: 'desc' })
        .skip(skip)
        .limit(20);

    res.json({
        ok: true,
        rooms: roomsDB,
    });
}

const createRoom =  async (req, res = response) => {

    let newRoom = null;
    let findRoom = null;
    const { participants, type } = req.body;
    
    if (type == roomType.PRIVATE) {
        findRoom = await Room.find({ participants: participants, type: roomType.PRIVATE});
        newRoom = (findRoom.length > 0) ? findRoom[0] : null;
    }  

    if (newRoom == null) {
        const room = new Room(req.body);
        newRoom = await room.save();

        if (type == roomType.GROUP) {
            sendNotifications({
                room: newRoom.id,
                from: participants[participants.length - 1],
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
        .populate({ path: 'participants', select: ['name', 'urlpicture'] });

    res.json({
        ok: true,
        room: roomDB,
    });
}

const removeUserFromRoom = async (req, res = response) => {

    const { idroom, uidParticipan } = req.body;

    await Room.updateOne( 
        { _id: idroom }, 
        { $pull: { participants: uidParticipan } } 
    );

    res.json({
        ok: true,
    });
}

const addUserToRoom = async (req, res = response) => {

    const { idroom, participants } = req.body;

    try {
        await Room.updateOne( 
            { _id: idroom }, 
            { $addToSet: { participants: participants } } 
        );
    } catch (error) {
        res.status(500).json({
            'ok': false,
            error
        });
    }

    res.json({
        ok: true,
    });
}

const updateRoom = async (req, res = response) => {

    const { idroom, urlpicture } = req.body;

    try {
        await Room.updateOne( 
            { _id: idroom }, 
            { urlpicture: urlpicture }
        );
    } catch (error) {
        res.status(500).json({
            'ok': false,
            error
        });
    }

    res.json({
        ok: true,
    });
}

const deleteRoom = async (req, res = response) => {

    const { idroom } = req.body;

    try {
        await Room.deleteOne({ _id: idroom });
    } catch (error) {
        res.status(500).json({
            'ok': false,
            error
        });
    }

    res.json({
        ok: true,
    });
}

module.exports = {
    getRooms,
    createRoom,
    findRoom,
    addUserToRoom,
    removeUserFromRoom,
    updateRoom,
    deleteRoom
};