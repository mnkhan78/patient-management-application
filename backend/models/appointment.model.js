const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient',
            required: true,
        },

        tokenNumber: {
            type: Number,
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

        queueStatus: {
            type: String,
            enum: [
                'Waiting',
                'Called',
                'In Consultation',
                'Completed',
                'Skipped',
                'No Show'
            ],
            default: 'Waiting',
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
            },
            o2Sat: {
                type: Number, // %
            },
            zScore: {
                type: Number, // Z-Score
            },
            status: {
                type: String, // BMI status
            },
            ageInMonths: {
                type: Number, // Age in months for children
            },

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

        medicinePrescribedAt: {
            type: Date,
        },

        dispensedAt: {
            type: Date,
        },

        chiefComplaints: {
            type: String,
            default: ""
        },

        advice: {
            type: String,
            default: ""
        },

        investigations: {
            type: String,
            default: ""
        },

        followUpDate: {
            type: Date
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