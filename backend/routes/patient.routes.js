const express = require('express');
const Patient = require('../models/patient.model');
const { jwtAuthMiddleware, authorizeRoles } = require('../authetication/jwt.auth');

const router = express.Router();

router.use(jwtAuthMiddleware);

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided

    const search = req.query.search || ''; // Optional search query

    const skip = (page - 1) * limit;

    const query = search
      ? {
        $or: [
          { fullName: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
          { patientId: { $regex: search, $options: "i" } }
        ]
      }
      : {};

    const totalPatients = await Patient.countDocuments();

    const data = await Patient.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }); // Sort by creation date (newest first)  

    console.log('data fetched successfully');

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalPatients / limit),
      limit,
      totalPatients,
      data
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'internal server error' })
  }
})

router.post('/', async (req, res) => {
  try {
    const data = req.body
    const newPatient = new Patient(data);
    const response = await newPatient.save()
    console.log('data saved successfully');
    res.status(200).json(response)

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'internal server error' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const patId = req.params.id;
    const data = await Patient.findById(patId);

    if (!data) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.status(200).json(data);
    console.log('data for the user fetched successfully');

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'internal server error' })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const patId = req.params.id;
    const updatedData = req.body;

    const updatedPatient = await Patient.findByIdAndUpdate(patId, updatedData, {
      new: true,        // return updated document
      runValidators: true // apply schema validations
    });

    if (!updatedPatient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    console.log('patient updated successfully');

    res.status(200).json({
      message: 'Patient updated successfully',
      data: updatedPatient
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'internal server error' })
  }
})

router.delete('/:id', authorizeRoles('admin', 'doctor'), async (req, res) => {
  try {
    const patId = req.params.id;

    const deletedPatient = await Patient.findByIdAndDelete(
      patId,
      {
        isDeleted: true,
        deletedAt: new Date()
      },
      { new: true }
    );

    if (!deletedPatient) {
      return res.status(404).json({ error: 'patient not found' });
    }
    console.log('patient deleted successfully');

    res.status(200).json({
      message: `patient with ${patId} deleted successfully`,
      data: deletedPatient
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'internal server error' })
  }
})

module.exports = router;