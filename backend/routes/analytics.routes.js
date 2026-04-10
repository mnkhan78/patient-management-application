const express = require('express');
const Appointment = require('../models/appointment.model');

const router = express.Router();

router.get("/appointments", async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const data = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$appointmentDate" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;