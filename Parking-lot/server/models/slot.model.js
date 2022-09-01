const { Schema, model } = require('mongoose');

const SlotSchema = new Schema({
    entryPoint: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    licensePlate: {
        type: String,
        required: true,
        unique: true
    },
    vType: {
        type: String,
        required: true
    },
    pType: {
        type: String,
        required: true
    },
    entryTime: {
        type: String,
        required: true
    },
    exitTime: {
        type: String
    },
    charge: {
        type: Number,
        default: 0
    },
    slots: {
        type: String,
        required: true
    },
    exit: {
        type: Boolean,
        default: false
    },
    continuePark: {
        type: Boolean,
        default: false
    }
});

const SlotModel = new model("slots", SlotSchema);

module.exports = SlotModel