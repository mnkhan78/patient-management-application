const express = require('express');
const Appointment = require('../models/appointment.model');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const data = await Appointment.find();
        res.status(200).json(data);
        console.log('data fetched successfully');
        
    } catch (error) {
        res.status(500).json({error: 'internal server error'})
        console.log(error);
        
    }
});

// GET appointments for a particular patient
router.get('/patient/:patientId', async (req, res) => {
    try {
        const { patientId } = req.params;

        const data = await Appointment.find({ patientId });

        res.status(200).json(data);
        console.log('Patient appointments fetched successfully');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const newAppointment = new Appointment(data);

        const response = await newAppointment.save();
        console.log('appointment scheduled succfully');
        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({error: 'internal server error'})
        console.log(error);
    }
})

module.exports = router;