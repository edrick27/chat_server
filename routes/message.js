/*
    path: api/messages
*/

const { Router } = require('express');
const { getMessages } = require('../controllers/socket');
const validateJWT = require('../middlewares/validar-token');


const router = Router();


router.get('/:idRoom', getMessages);


module.exports = router;