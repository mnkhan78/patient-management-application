import { useState, useEffect } from "react";
import api from '../api/axios'
import { useNavigate, useParams } from "react-router";
import '../style/patientDetails.css'

const PatientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        fetchPatient();
        fetchAppointment();
    }, [id]);

    const fetchPatient = async () => {
        try {

            const res = await api.get(`/patients/${id}`);
            setPatient(res.data);
            console.log(res.data);

        } catch (error) {
            console.error("error fetching patients:", error);
        }
    }

    const fetchAppointment = async () => {
        try {
            const res = await api.get(`/appointments/patient/${id}`);
            console.log(res.data);
            setAppointments(res.data);

        } catch (error) {
            console.error("error fetching appointments:", error);
        }
    }

    if (!patient) {
        return <h3 className="loading-text">Loading patient details...</h3>;
    }

    return (
        <div className="patient-details-container">
            <h1 className="page-title">Patient Details</h1>
            <div className="patient-card">
                <div className="info-grid">
                    <p><strong>Patient ID:</strong> {patient.patientId}</p>
                    <p><strong>Name:</strong> {patient.fullName}</p>
                    <p><strong>Age:</strong> {patient.age}</p>
                    <p><strong>Gender:</strong> {patient.gender}</p>
                    <p><strong>Phone:</strong> {patient.phone}</p>
                    <p><strong>Email:</strong> {patient.email}</p>
                    <p><strong>Blood Group:</strong> {patient.bloodGroup}</p>
                    <p className="full-width"><strong>Address:</strong> {patient.address}</p>
                    <p className="full-width"><strong>Medical History:</strong> {patient.medicalHistory}</p>
                </div>
            </div>

            {/* appointments  */}
            <div className="appointment-section">
                <div className="appointment-header">
                    <h2>Appointments</h2>

                    <button
                        className="primary-btn"
                        type="button"
                        onClick={() => navigate(`/patients/${patient._id}/new-appointment`)}
                    >
                        + New Appointment
                    </button>
                </div>
                {appointments.length === 0 ? (
                    <p className="empty-text">No Appointments Found</p>
                ) : (


                    <ul className="appointment-list">
                        {appointments.map((appointment) => (
                            <li key={appointment._id} className="appointment-card">
                                <p>Date: {appointment.appointmentDate} </p>
                                <p>Reason: {appointment.reason}</p>
                                <button className="view-btn" onClick={() => navigate(`/appointmentDetails/${appointment._id}`)}>View Details</button>
                            </li>
                        ))}

                    </ul>
                )}
            </div>
        </div>
    )
}

export default PatientDetails;