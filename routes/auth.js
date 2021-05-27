/*
    path: api/login
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { createUser, login, renewToken } = require('../controllers/auth');
const validateJWT = require('../middlewares/validar-token');
const { validateRequest } = require('../middlewares/validate-request');

const router = Router();


router.post('/new',[
    check('name', 'el nombre es obligatorio').not().isEmpty(),
    check('email', 'el email es obligatorio').not().isEmpty(),
    check('password', 'el password es obligatorio').not().isEmpty(),
    validateRequest
], createUser);

router.post('/',[
    check('email').not().isEmpty(),
    check('password').not().isEmpty(),
    validateRequest
], login);

router.get('/renew', validateJWT, renewToken);


module.exports = router;