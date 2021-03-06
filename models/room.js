const { Schema, model } = require("mongoose");

const Message = require("./message");

var schemaOptions = {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    },
    timestamps: true
};

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
}, schemaOptions);

RoomSchema.pre('deleteOne', function(next) {
    Message.remove({room: this._id}).exec();
    next();
});

RoomSchema.virtual('unreadMsg', {
    ref: 'Message', // The model to use
    localField: '_id', // Find people where `localField`
    foreignField: 'room', // is equal to `foreignField`
    count: true // And only get the number of docs
});

RoomSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Room', RoomSchema);