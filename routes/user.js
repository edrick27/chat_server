/*
    path: api/users
*/

const { Router } = require('express');
const { getUsers, createUser, searchUsers, updateUserAvatar, createManyUser } = require('../controllers/users');


const router = Router();

router.get('/', getUsers);
router.post('/create', createUser);
router.post('/create-many', createManyUser);
router.post('/search', searchUsers);
router.post('/update-avatar', updateUserAvatar);


module.exports = router;