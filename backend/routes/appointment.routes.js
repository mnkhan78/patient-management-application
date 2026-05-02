const express = require('express');
const Appointment = require('../models/appointment.model');
const { jwtAuthMiddleware } = require('../authetication/jwt.auth');
const Patient = require('../models/patient.model');

const router = express.Router();

router.use(jwtAuthMiddleware);

router.get('/', async (req, res) => {
    try {
        const data = await Appointment.find()
            .populate('patientId', 'fullName');
        res.status(200).json(data);
        console.log('data fetched successfully');

    } catch (error) {
        res.status(500).json({ error: 'internal server error' })
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

// GET all the appointments for a particular patient
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

router.get('/last-height/:patientId', async (req, res) => {
    try {
        const { patientId } = req.params;

        const lastAppointment = await Appointment.findOne({
            patientId,
            "vitals.height": { $ne: null }
        }).sort({ createdAt: -1 });

        if (!lastAppointment) {
            return res.json({ height: null });
        }

        res.json({
            height: lastAppointment.vitals.height
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const data = await Appointment.findById(id)
            .populate({
                path: 'patientId',
                select: 'fullName',
                // match: { isDeleted: false }
            });

        if (!data) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        const response = data.toObject();

        response.patientName = data.patientId
            ? data.patientId.fullName
            : "Deleted Patient";

        res.status(200).json(response);

        console.log('Appointment fetched successfully');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const data = req.body;

        const patient = await Patient.findById(data.patientId);

        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        const age = patient.age;
        const inputHeight = data.vitals?.height;

        //ensure vitrals object exists
        if (!data.vitals) {
            data.vitals = {};
        }

        if (age >= 20) {
            const lastAppointment = await Appointment.findOne({
                patientId: data.patientId,
                "vitals.height": { $exists: true }
            }).sort({ createdAt: -1 });

            if (lastAppointment) {
                data.vitals.height = lastAppointment.vitals.height;
            }
        }
        const newAppointment = new Appointment(data);

        const response = await newAppointment.save();
        console.log('appointment scheduled succfully');
        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({ error: 'internal server error' })
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