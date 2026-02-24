const express = require('express');
const Patient = require('../models/patient.model');
const { jwtAuthMiddleware, authorizeRoles } = require('../authetication/jwt.auth');

const router = express.Router();

router.use(jwtAuthMiddleware);
 
router.get('/', async (req, res) => {
  try {
    const data = await Patient.find();
    console.log('data fetched successfully');
    res.status(200).json(data);

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

    const deletedPatient = await Patient.findByIdAndDelete(patId);

    if (!deletedPatient) {
      return res.status(404).json ({error: 'patient not found'});
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