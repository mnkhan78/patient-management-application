const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient',
            required: true,
        },

        appointmentDate: {
            type: Date,
            required: true,
        },

        reason: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ['Scheduled', 'Completed', 'Cancelled'],
            default: 'Scheduled',
        },

        doctorName: {
            type: String,
            trim: true,
        },
        vitals: {
            weight: {
                type: Number, // kg
            },
            height: {
                type: Number, // cm
            },
            bp: {
                systolic: Number,
                diastolic: Number,
            },
            sugar: {
                type: Number, // mg/dL
            },
            pulse: {
                type: Number, // bpm
            },
            temperature: {
                type: Number, // °F
            },
            bmi: {
                type: Number, // BMI
            }

        },

        medicinesPrescribed: [
            {
                name: {
                    type: String,
                    trim: true,
                },
                dosage: {
                    type: String, //16 doses, 4 doses etc
                    trim: true,
                },
                frequency: {
                    type: String, //tds, bd etc
                    trim: true,
                },
            },
        ],
        medicineStatus: {
            type: String,
            enum: ["Pending", "Dispensed"],
            default: "Pending",
        },

        dispensedAt: {
            type: Date,
        },

        notes: {
            type: String,
            trim: true,
        },
        pharmacyNotes: {
            type: String,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;