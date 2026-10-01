const appointmentService = require('../../services/public/appointment.service');

const getNextToken = async (req, res) => {
    try {
        const { appointmentDate } = req.body;

        if (!appointmentDate) {
            return res.status(400).json({
                success: false,
                message: 'Appointment date is required',
            });
        }

        const nextToken = await appointmentService.getNextToken(
            appointmentDate
        );

        res.status(200).json({
            success: true,
            data: {
                appointmentDate,
                nextToken,
            },
        });

    } catch (error) {
        console.error('Public appointment error:', error);

        res.status(500).json({
            success: false,
            message: 'Unable to generate next token',
        });
    }
};

const bookAppointment = async (req, res) => {

    try {

        const {
            patientId,
            name,
            mobile,
            appointmentDate,
        } = req.body;


        // ------------------------------------------
        // Basic validation
        // ------------------------------------------
        if (
            !patientId ||
            !name ||
            !mobile ||
            !appointmentDate
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Patient ID, name, mobile number and appointment date are required',
            });
        }


        // ------------------------------------------
        // Book appointment
        // ------------------------------------------
        const appointment =
            await appointmentService.bookAppointment({
                patientId,
                name,
                mobile,
                appointmentDate,
            });


        return res.status(201).json({
            success: true,

            message: 'Appointment booked successfully',

            data: appointment,
        });

    } catch (error) {

        console.error('Public appointment booking error:', error);


        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }


        return res.status(500).json({
            success: false,
            message: 'Unable to book appointment',
        });
    }
};


module.exports = {
    getNextToken,
    bookAppointment,
};