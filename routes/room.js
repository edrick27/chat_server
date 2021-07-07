/*
    path: api/rooms
*/

const { Router } = require('express');
const { getRooms, createRoom, findRoom, addUserToRoom, removeUserFromRoom } = require('../controllers/room');


const router = Router();

router.get('/', getRooms);
router.post('/create', createRoom);
router.post('/find', findRoom);
router.post('/remove', removeUserFromRoom);
router.post('/add', addUserToRoom);


module.exports = router;