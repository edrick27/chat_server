/*
    path: api/rooms
*/

const { Router } = require('express');
const { getRooms, createRoom } = require('../controllers/room');


const router = Router();

router.get('/', getRooms);
router.post('/create', createRoom);


module.exports = router;