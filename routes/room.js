/*
    path: api/rooms
*/

const { Router } = require('express');
const { getRooms, createRoom,findRoom } = require('../controllers/room');


const router = Router();

router.get('/', getRooms);
router.post('/create', createRoom);
router.post('/find', findRoom);


module.exports = router;