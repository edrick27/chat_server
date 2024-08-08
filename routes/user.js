/*
    path: api/users
*/

const { Router } = require('express');
const { getUsers, createUser, searchUsers, updateUserAvatar, createManyUser, createOrganization } = require('../controllers/users');
const { deleteOrganization } = require('../controllers/organization');


const router = Router();

router.get('/', getUsers);
router.post('/create', createUser);
router.post('/create-many', createManyUser);
router.post('/search', searchUsers);
router.post('/update-avatar', updateUserAvatar);
router.post('/create-organization', createOrganization);
router.post('/delete-organization', deleteOrganization);


module.exports = router;