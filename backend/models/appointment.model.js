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
        },

        medicinesPrescribed: [
            {
                name: {
                    type: String,
                    required: true,
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

        notes: {
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