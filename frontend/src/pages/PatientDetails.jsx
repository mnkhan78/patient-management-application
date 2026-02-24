import { useState, useEffect } from "react";
import api from '../api/axios'
import { useNavigate, useParams } from "react-router";
import '../style/patientDetails.css'

import UpdateAppointmentModal from "./UpdateAppointmnetModal";

const PatientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    useEffect(() => {
        fetchPatient();
        fetchAppointment();
    }, [id]);

    const fetchPatient = async () => {
        try {

            const res = await api.get(`/patients/${id}`);
            setPatient(res.data);

        } catch (error) {
            console.error("error fetching patients:", error);
        }
    }

    const fetchAppointment = async () => {
        try {
            const res = await api.get(`/appointments/patient/${id}`);
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
                    <button className="primary-btn" onClick={() => navigate(`/patients/${patient._id}/appointments`)}>View All Appointments</button>
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
                                <div className="action-buttons">

                                
                                <button className="view-btn" onClick={() => navigate(`/appointmentDetails/${appointment._id}`)}>View Details</button>
                                <button className="delete-btn" onClick={() => {
                                    if (window.confirm("Are you sure you want to delete this appointment?")) {
                                        api.delete(`/appointments/${appointment._id}`)
                                            .then(() => {
                                                fetchAppointment();
                                            })
                                            .catch(error => {
                                                console.error("Error deleting appointment:", error);
                                            });
                                    }
                                }}>Delete</button>
                                <button className="update-btn" onClick={() => {
                                    setSelectedAppointment(appointment);
                                    setShowUpdateModal(true);
                                }}>Update</button>
</div>

                            </li>
                        ))}

                    </ul>
                )}
            </div>
                {showUpdateModal && (
                    <UpdateAppointmentModal
                        appointment={selectedAppointment}
                        onClose={() => setShowUpdateModal(false)}
                    />
                )}
        </div>
    )
}

export default PatientDetails;