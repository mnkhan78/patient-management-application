import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useEffect } from 'react';
import '../style/appointmentDetails.css';

import UpdateAppointmentModal from './UpdateAppointmnetModal';
import IdealWeight from "../components/patients/IdealWeight";

const AppointmentDetails = () => {
    const { id } = useParams();
    const [appointment, setAppointment] = useState(null);

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const navigate = useNavigate();

    const fetchAppointmentDetails = async () => {
        try {
            const response = await api.get(`/appointments/${id}`);
            setAppointment(response.data);
        } catch (error) {
            console.error("Error fetching appointment details:", error);
        }
    };

    const handleNotesChange = (e) => {
        setAppointment({ ...appointment, notes: e.target.value });
    };

    const handleNotesSave = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/appointments/${id}`, { notes: appointment.notes });
            alert("Notes saved successfully!");
        } catch (error) {
            console.error("Error saving notes:", error);
            alert("Failed to save notes. Please try again.");
        }
    };

    useEffect(() => {
        fetchAppointmentDetails();
    }, [id]);

    return (
        <div className="appointment-details-container">
            <h1 className="details-title">Appointment Details Page:</h1>
            {appointment && (
                <div className="details-card">
                    <p><strong>Patient Name:</strong> {appointment.patientId?.fullName}</p>
                    <p><strong>Date:</strong> {appointment.appointmentDate}</p>
                    <p><strong>Reason:</strong> {appointment.reason}</p>
                    <p><strong>Weight:</strong> {appointment.vitals.weight}</p>
                    <p><strong>Height:</strong> {appointment.vitals.height}</p>
                    <p><strong>Blood Pressure:</strong> {appointment.vitals.bp.systolic}/{appointment.vitals.bp.diastolic}</p>
                    <p><strong>Sugar:</strong> {appointment.vitals.sugar}</p>
                    <p><strong>Pulse:</strong> {appointment.vitals.pulse}</p>
                    <p><strong>Temperature:</strong> {appointment.vitals.temperature}</p>
                    <p><strong>BMI:</strong> {appointment.vitals.bmi}</p>
                    <p><strong>O2 Saturation:</strong> {appointment.vitals.o2Sat}%</p>
                    <IdealWeight height={appointment.vitals.height} bmi={appointment.vitals.bmi} />
                    <div>
                        <strong>Prescribed Medicines:</strong>
                        <ul className="details-medicine-list"> 
                            {appointment.medicinesPrescribed.map((medicine, index) => (
                                <li key={index}>{medicine.name} - {medicine.dosage} - {medicine.frequency}</li>
                            ))}
                        </ul>
                    </div>
                    <p><strong>Notes:</strong> {appointment.notes}</p>

                    {/* //doctor's notes input field */}
                    <div>
                        <label htmlFor="doctorNotes"><strong>Doctor's Notes:</strong></label>
                        <textarea
                            id="doctorNotes"
                            value={appointment.notes || ''}
                            onChange={handleNotesChange}
                            className="doctor-notes-textarea"
                        />
                        <button className="save-notes-btn" onClick={handleNotesSave}>
                            Save Note
                        </button>
                    </div>
                    
                </div>
            )}
            <button className="update-btn" onClick={() => setShowUpdateModal(true)}>
                Add Medicine
            </button>
            <button className="back-btn" onClick={() => navigate(-1)}>
                Go Back
            </button>

            {showUpdateModal && (
                <UpdateAppointmentModal
                    appointment={appointment}
                    onClose={() => setShowUpdateModal(false)}
                />
            )}
        </div>
    );
}

export default AppointmentDetails;