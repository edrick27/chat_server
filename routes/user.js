/*
    path: api/users
*/

const { Router } = require('express');
const { getUsers, createUser } = require('../controllers/users');


const router = Router();

router.get('/', getUsers);
router.post('/create', createUser);


module.exports = router;