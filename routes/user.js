/*
    path: api/users
*/

const { Router } = require('express');
const { getUsers, createUser, searchUsers } = require('../controllers/users');


const router = Router();

router.get('/', getUsers);
router.post('/create', createUser);
router.post('/search', searchUsers);


module.exports = router;