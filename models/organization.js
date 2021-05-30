const { Schema, model } = require("mongoose");


const OrganizationSchema = Schema({

    id: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    url: {
        type: String,
        require: true
    },
});

module.exports = model('Organization', OrganizationSchema);