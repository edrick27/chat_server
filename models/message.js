const { Schema, model } = require('mongoose');

const MessageSchema = Schema({

    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    }, 
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        require: true,
    }, 
    msg: {
        type: String,
        require: true,
    },
    type: {
        type: String,
        require: true,
        enum : ['IMAGE', 'TEXT', 'AUDIO'],
        default: 'TEXT'
    },
    read_by: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true,
        default: []
    }],
}, {
    timestamps: true
});

MessageSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});
 
module.exports = model('Message', MessageSchema);