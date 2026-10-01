const Appointment = require('../../models/appointment.model');
const Patient = require('../../models/patient.model');


// --------------------------------------------------
// Get start and end of selected appointment date
// --------------------------------------------------
const getDayRange = (appointmentDate) => {
    const startOfDay = new Date(`${appointmentDate}T00:00:00`);
    const endOfDay = new Date(`${appointmentDate}T23:59:59.999`);

    return {
        startOfDay,
        endOfDay,
    };
};


// --------------------------------------------------
// Generate next token
// --------------------------------------------------
const getNextToken = async (appointmentDate) => {

    const { startOfDay, endOfDay } = getDayRange(appointmentDate);

    const lastAppointment = await Appointment.findOne({
        appointmentDate: {
            $gte: startOfDay,
            $lte: endOfDay,
        },

        tokenNumber: {
            $exists: true,
            $ne: null,
        },

        isActive: true,

        status: {
            $ne: 'Cancelled',
        },
    })
        .select('tokenNumber')
        .sort({ tokenNumber: -1 })
        .lean();


    if (!lastAppointment) {
        return 1;
    }

    return lastAppointment.tokenNumber + 1;
};


// --------------------------------------------------
// Book appointment from public patient interface
// --------------------------------------------------
const bookAppointment = async ({
    patientId,
    name,
    mobile,
    appointmentDate,
}) => {

    // ----------------------------------------------
    // Validate patient
    // ----------------------------------------------
    const patient = await Patient.findOne({
        patientId: patientId,
    });

    if (!patient) {
        const error = new Error('Patient not found');
        error.statusCode = 404;
        throw error;
    }


    // ----------------------------------------------
    // Generate token
    // ----------------------------------------------
    const tokenNumber = await getNextToken(appointmentDate);


    // ----------------------------------------------
    // Create appointment
    // ----------------------------------------------
    const { startOfDay } = getDayRange(appointmentDate);

    const appointment = new Appointment({
        patientId: patient._id,

        tokenNumber,
        appointmentDate: startOfDay,
        reason: 'Public appointment booking',
        status: 'Scheduled',
        queueStatus: 'Waiting',

        isActive: true,
    });


    const savedAppointment = await appointment.save();


    // ----------------------------------------------
    // Return only information required by patient
    // ----------------------------------------------
    return {
        appointmentId: savedAppointment._id,
        patientId: patient.patientId,
        name,
        mobile,
        appointmentDate,
        tokenNumber: savedAppointment.tokenNumber,
        status: savedAppointment.status,
        queueStatus: savedAppointment.queueStatus,
    };
};


module.exports = {
    getNextToken,
    bookAppointment,
};