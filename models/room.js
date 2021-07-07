const { Schema, model } = require("mongoose");


const RoomSchema = Schema({
    name: {
        type: String,
        require: true
    },
    urlpicture: {
        type: String,
        require: true
    },
    type: {
        type: String,
        require: true,
        enum : ['GROUP', 'PRIVATE'],
        default: 'TEXT'
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    }],
    id_organization: {
        type: String,
        require: true
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
        require: true,
    }, 
    last_msg: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
        default: null
    }, 
});

RoomSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Room', RoomSchema);