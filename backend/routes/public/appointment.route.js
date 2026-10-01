const express = require('express');

const {
    getNextToken,
    bookAppointment,
} = require('../../controllers/public/appointment.controller');

const router = express.Router();

router.post('/next-token', getNextToken);

router.post('/', bookAppointment);

module.exports = router;