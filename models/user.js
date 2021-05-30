const { Schema, model } = require("mongoose");


const UserSchema = Schema({

    name: {
        type: String,
        require: true
    },
    wh_id: {
        type: String,
        require: true
    },
    id_organization: {
        type: String,
        require: true
    },
    urlpicture: {
        type: String,
        require: true
    },
    online: {
        type: Boolean,
        default: false
    },

});

UserSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('User', UserSchema);