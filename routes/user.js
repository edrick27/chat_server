/*
    path: api/users
*/

const { Router } = require('express');
const { getUsers, createUser, searchUsers, updateUserAvatar } = require('../controllers/users');


const router = Router();

router.get('/', getUsers);
router.post('/create', createUser);
router.post('/search', searchUsers);
router.post('/update-avatar', updateUserAvatar);


module.exports = router;