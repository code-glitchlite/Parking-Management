const express = require('express');
const { bookSlot, getBookedSlots, chargeUser, continueCharge } = require('../controllers/slot.controller.js');


const router = express.Router();

router.post("/book", bookSlot);
router.get("/fetch", getBookedSlots);
router.put("/charge/:id", chargeUser);
router.put("/continue/:id", continueCharge);


module.exports = router