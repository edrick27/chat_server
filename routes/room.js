/*
    path: api/rooms
*/

const { Router } = require('express');
const { getRooms, createRoom, findRoom, addUserToRoom, removeUserFromRoom, updateRoom, deleteRoom } = require('../controllers/room');


const router = Router();

router.get('/', getRooms);
router.post('/create', createRoom);
router.post('/find', findRoom);
router.post('/remove', removeUserFromRoom);
router.post('/add', addUserToRoom);
router.post('/update', updateRoom);
router.post('/delete', deleteRoom);


module.exports = router;