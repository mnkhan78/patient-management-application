const express = require('express');
const Appointment = require('../models/appointment.model');
const { jwtAuthMiddleware } = require('../authetication/jwt.auth');

const router = express.Router();

router.use(jwtAuthMiddleware);

router.get('/', async (req, res) => {
    try {
        const data = await Appointment.find()
        .populate('patientId', 'fullName');
        res.status(200).json(data);
        console.log('data fetched successfully');
        
    } catch (error) {
        res.status(500).json({error: 'internal server error'})
        console.log(error);
        
    }
});

router.get("/today", async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      appointmentDate: { $gte: start, $lte: end }
    })
    .populate("patientId", "fullName age gender") // important
    .sort({ time: 1 });

    res.json(appointments);
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET appointments for a particular patient
router.get('/patient/:patientId', async (req, res) => {
    try {
        const { patientId } = req.params;

        const data = await Appointment.find({ patientId })
        .populate('patientId', 'fullName');

        res.status(200).json(data);
        console.log('Patient appointments fetched successfully');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params; 

        const data = await Appointment.findById(id)
        .populate('patientId', 'fullName');

        res.status(200).json(data);
        console.log('Appointment for the patient fetched successfully');
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

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAppointment = await Appointment.findByIdAndDelete(id);

        if (!deletedAppointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedAppointment = await Appointment.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedAppointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.status(200).json(updatedAppointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;