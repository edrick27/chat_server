/*
    path: api/messages
*/

const { Router } = require('express');
const { getMessages } = require('../controllers/socket');
const validateJWT = require('../middlewares/validar-token');


const router = Router();


router.get('/:from', getMessages);


module.exports = router;