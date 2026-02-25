import { useState, useEffect } from "react";
import api from '../api/axios'
import { useNavigate, useParams } from "react-router";
import '../style/patientAppointments.css';


const PatientAppointments = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    useEffect(() => {        fetchAppointments();
    }, [id]);

    const fetchAppointments = async () => {
        try {
            const res = await api.get(`/appointments/patient/${id}`);
            setAppointments(res.data);
        } catch (error) {
            console.error("error fetching appointments:", error);
        }
    }

    return (
        <div className="patient-appointments">
            <h2>Patient Appointments</h2>
            {appointments.length === 0 ? (
                <p>No appointments found for this patient.</p>
            ) : (
                <ul className="appointments-grid">
                    {appointments.map((appointment) => (
                        <li key={appointment._id} className="appointment-card">
                            <p><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                            <p><strong>Reason:</strong> {appointment.reason}</p>
                            <p><strong>Status:</strong> {appointment.status}</p>
                            <p><strong>Doctor:</strong> {appointment.doctorName}</p>
                            <p><strong>Blood Pressure:</strong> {appointment.vitals.bp.systolic}/{appointment.vitals.bp.diastolic}</p>
                    <p><strong>Sugar:</strong> {appointment.vitals.sugar}</p>
                    <p><strong>Pulse:</strong> {appointment.vitals.pulse}</p>
                    <div>
                        <strong>Medicines Prescribed:</strong>
                        <ul className="medicines-list"> 
                            {appointment.medicinesPrescribed.map((medicine, index) => (
                                <li key={index}>{medicine.name} - {medicine.dosage} - {medicine.frequency}</li>
                            ))}
                        </ul>
                    </div>
                    <p><strong>Notes:</strong> {appointment.notes}</p>
                    </li>
                    ))}
                </ul>
            )}

        </div>
    );
};

export default PatientAppointments;