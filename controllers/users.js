const { response } = require("express");
const user = require("../models/user");


const getUsers = async (req, res = response) => {

    const skip = Number(req.query.skip) || 0;

    const usersDB = await user
        .find({ _id: { $ne: req.query.uid } })
        .sort('-online')
        .skip(skip)
        .limit(20);

    res.json({
        ok: true,
        users: usersDB,
    });
}

module.exports = {
    getUsers
};