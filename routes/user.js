/*
    path: api/users
*/

const { Router } = require('express');
const validateJWT = require('../middlewares/validar-token');
const { getUsers } = require('../controllers/users');


const router = Router();


router.get('/', getUsers);


module.exports = router;