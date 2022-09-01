const SlotModel = require('../models/slot.model.js')


const bookSlot = async (req, res) => {
    try {
        const { entryPoint, fullName, phoneNumber, licensePlate, vType, pType, entryTime, slots } = req.body;

        const visitedUser = await SlotModel.findOne({ licensePlate });

        if (visitedUser) {
            res.status(200).json(visitedUser);
        }

        else {
            const slotBooked = await SlotModel.create({ entryPoint, fullName, phoneNumber, licensePlate, vType, pType, entryTime, slots });
            res.status(200).json(slotBooked);
        }
    } catch (error) {
        console.log(error);
    }
}

const getBookedSlots = async (req, res) => {
    try {
        const slots = await SlotModel.find();

        res.status(200).json(slots)
    } catch (error) {
        console.log(error);
    }
}

const chargeUser = async (req, res) => {
    try {
        const userCharged = req.params.id;

        console.log(req.body);
        console.log('charge');
        const { price, exitTime } = req.body;

        const updateSlot = {
            charge: price,
            exit: true,
            exitTime
        }

        await SlotModel.findByIdAndUpdate(userCharged, updateSlot, { new: true })

        res.status(200).json({ message: "Amount Paid" })
    } catch (error) {
        console.log(error);
    }
}

const continueCharge = async (req, res) => {
    try {
        const { id } = req.params;

        const updateFields = {
            continuePark: true,
            charge: 0,
            exit: false
        }

        const response = await SlotModel.findByIdAndUpdate(id, updateFields, { new: true });

        res.status(200).json(response);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { bookSlot, getBookedSlots, chargeUser, continueCharge }