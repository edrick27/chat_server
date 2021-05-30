const { response } = require("express");
const User = require("../models/user");
const Organization = require("../models/organization");


const getUsers = async (req, res = response) => {

    const skip = Number(req.query.skip) || 0;

    const usersDB = await User
        .find({ _id: { $ne: req.query.uid } })
        .sort('-online')
        .skip(skip)
        .limit(20);

    res.json({
        ok: true,
        users: usersDB,
    });
}

const createUser =  async (req, res = response) => {

    const { users, organization } = req.body;

    const id_organization = organization['chat_uid'];
    const organizationExists = await Organization.findOne({ id_organization });

    if (!organizationExists) {
        const organizationDB = new Organization(organization);
        await organizationDB.save();
    }

    await User.insertMany(users);
    const allUsers = await User.find({ id_organization: id_organization });

    res.json({
        ok: true,
        msg: 'usuarios creados con exito!',
        users: allUsers
    });

    // users.forEach(userJson => {

    //     const userDB = new User(userJson);
    //     userDB.save();
    // });

    // try {

    // } catch (error) {
    //     res.status(500).json({
    //         ok: false,
    //         msg: 'Hable con el administrador'
    //     });
    // }
}

module.exports = {
    getUsers,
    createUser
};