// const Appointment = require('../../models/appointment.model');

// /*
//  * Get today's date boundaries.
//  * PMA currently uses the server's local timezone.
//  * We will later make the clinic timezone explicit.
//  */

// const getTodayRange = () => {
//     const start = new Date();
//     start.setHours(0, 0, 0, 0);

//     const end = new Date();
//     end.setHours(23, 59, 59, 999);

//     return { start, end };
// };


// /*
//  * Get the current live queue for the clinic.
//  */
// const getLiveQueue = async () => {

//     const { start, end } = getTodayRange();

//     const appointments = await Appointment.find({
//         appointmentDate: {
//             $gte: start,
//             $lte: end,
//         },

//         tokenNumber: {
//             $exists: true,
//             $ne: null,
//         },

//         status: {
//             $ne: 'Cancelled',
//         },

//         queueStatus: {
//             $in: [
//                 'Waiting',
//                 'Called',
//                 'In Consultation',
//             ],
//         },
//     })
//         .select('tokenNumber queueStatus appointmentDate')
//         .sort({ tokenNumber: 1 })
//         .lean();


//     // Find the patient currently being called/consulted.
//     const currentAppointment = appointments.find(
//         appointment =>
//             appointment.queueStatus === 'Called' ||
//             appointment.queueStatus === 'In Consultation'
//     );


//     const currentToken = currentAppointment
//         ? currentAppointment.tokenNumber
//         : null;


//     // Waiting patients only.
//     const waitingQueue = appointments
//         .filter(
//             appointment =>
//                 appointment.queueStatus === 'Waiting'
//         )
//         .map(appointment => ({
//             tokenNumber: appointment.tokenNumber,
//             status: appointment.queueStatus,
//         }));


//     return {
//         currentToken,

//         currentStatus: currentAppointment
//             ? currentAppointment.queueStatus
//             : null,

//         waitingCount: waitingQueue.length,

//         queue: waitingQueue,
//     };
// };


// module.exports = {
//     getLiveQueue,
// };

const Appointment = require('../../models/appointment.model');

const getTodayRange = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return {
        start,
        end,
    };
};

const getLiveQueue = async () => {
    const { start, end } = getTodayRange();

    // Get today's active appointments
    const appointments = await Appointment.find({
        appointmentDate: {
            $gte: start,
            $lte: end,
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
        .select('tokenNumber queueStatus appointmentDate')
        .sort({ tokenNumber: 1 })
        .lean();

    let currentAppointment = appointments.find(
        appointment => appointment.queueStatus === 'In Consultation'
    );

    // If nobody is in consultation,
    // check whether someone has been called.
    if (!currentAppointment) {
        currentAppointment = appointments.find(
            appointment => appointment.queueStatus === 'Called'
        );
    }

    const waitingAppointments = appointments.filter(
        appointment => appointment.queueStatus === 'Waiting'
    );

    return {
        currentToken: currentAppointment
            ? currentAppointment.tokenNumber
            : null,

        currentStatus: currentAppointment
            ? currentAppointment.queueStatus
            : null,

        waitingCount: waitingAppointments.length,

        queue: waitingAppointments.map(appointment => ({
            tokenNumber: appointment.tokenNumber,
            status: appointment.queueStatus,
        })),
    };
};

module.exports = {
    getLiveQueue,
};