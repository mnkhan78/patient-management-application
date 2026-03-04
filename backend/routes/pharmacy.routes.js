const express = require("express");
const Appointment = require("../models/appointment.model");
const { jwtAuthMiddleware } = require('../authetication/jwt.auth');

const router = express.Router();

router.use(jwtAuthMiddleware);

router.get("/medicine-queue", async (req, res) => {
  try {
    const today = new Date();

    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0, 0, 0, 0
    );

    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23, 59, 59, 999
    );

    const appointments = await Appointment.find({
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      medicinesPrescribed: { $exists: true, $ne: [] },
    })
    .populate("patientId")
    .sort({ appointmentDate: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching medicine queue:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.patch("/dispense/:appointmentId", async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        medicineStatus: "Dispensed",
        dispensedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "Medicines marked as dispensed",
      data: updatedAppointment,
    });
  } catch (error) {
    console.error("Error dispensing medicines:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;