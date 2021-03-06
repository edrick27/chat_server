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

const createManyUser =  async (req, res = response) => {

    const { users, organization } = req.body;

    const id_organization = organization['chat_uid'];

    await User.insertMany(users);
    const allUsers = await User.find({ id_organization: id_organization });

    res.json({
        ok: true,
        msg: 'usuarios creados con exito!',
        users: allUsers
    });
}

const searchUsers = async (req, res = response) => {

    const { where, uid } = req.body;

    let authUser = await User.findOne({ _id: uid });

    const usersDB = await User
        .find({ 
            name: { $regex: '.*' + where + '.*', $options: 'i' },
            id_organization: authUser.id_organization,
         })
        .sort('name')
        .limit(200);

    res.json({
        ok: true,
        users: usersDB,
    });
}

const updateUserAvatar =  async (req, res = response) => {

    const { uid, urlpicture } = req.body;

    const userDB = await User.findById(uid);
    userDB.urlpicture = urlpicture;
    await userDB.save();

    res.json({
        ok: true,
        msg: 'usuario actualizado con exito!',
    });
}

const createUser =  async (req, res = response) => {

    const { user } = req.body;

    const newUser = await User.create(user);

    res.json({
        ok: true,
        msg: 'usuarios creados con exito!',
        user: newUser
    });
}

const createOrganization =  async (req, res = response) => {

    const { organization } = req.body;

    const organizationDB = new Organization(organization);
    const result = await organizationDB.save()

    res.json({
        ok: true,
        msg: 'usuarios creados con exito!',
        organization: result
    });
}

module.exports = {
    getUsers,
    createUser,
    searchUsers,
    createManyUser,
    updateUserAvatar,
    createOrganization
};