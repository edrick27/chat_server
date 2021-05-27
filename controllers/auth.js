const { Router, response } = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const createUser =  async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const emailExists = await User.findOne({ email });

        if (emailExists) {
            return res.status(400).json({
                ok: false,
                msg: 'EL correo ya esta registrado!'
            });
        }

        const user = new User(req.body);

        // encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);
        await user.save();

        // generar Json WEb Token
        const token = await generateJWT(user.id);


        res.json({
            ok: true,
            msg: 'crear usuario',
            user,
            token
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const usuarioDB = await User.findOne({ email });

        if (!usuarioDB) {

            res.status(404).json({
                'ok': false,
                'msg': 'credenciales invalidas'
            });
        } 

        const validatePassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validatePassword) {
            
            res.status(400).json({
                'ok': false,
                'msg': 'Contraseña invalida!'
            });
        }

        const token =  await generateJWT(usuarioDB.id);

        res.json({
            ok: true,
            user: usuarioDB,
            token
        });
        
    } catch (error) {

        res.status(500).json({
            'ok': false,
            'msg': 'error en el login',
            error
        });
    }
}

const renewToken = async (req, res = response) => {

    const { uid } = req.body;

    try {

        const token = await generateJWT(uid);

        const user = await User.findOne({ uid });

        res.json({
            ok: true,
            user,
            token
        });
        
    } catch (error) {

        res.status(404).json({
            ok: false,
            msg: 'error al renovar token'
        });
    }
}

module.exports = {
    createUser,
    login,
    renewToken
}