import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useEffect } from 'react';

const AppointmentDetails = () => {
    const { id } = useParams();
    const [appointment, setAppointment] = useState(null);
    const navigate = useNavigate();

    const fetchAppointmentDetails = async () => {
        try {
            const response = await api.get(`/appointments/${id}`);
            setAppointment(response.data);
        } catch (error) {
            console.error("Error fetching appointment details:", error);
        }
    };

    useEffect(() => {
        fetchAppointmentDetails();
    }, [id]);

    return (
        <div>
            <h1>Appointment Details Page - {id}</h1>
            {appointment && (
                <div>
                    <p><strong>Patient ID:</strong> {appointment.patientId}</p>
                    <p><strong>Date:</strong> {appointment.appointmentDate}</p>
                    <p><strong>Reason:</strong> {appointment.reason}</p>
                    <p><strong>Weight:</strong> {appointment.vitals.weight}</p>
                    {/* <p><strong>Height:</strong> {appointment.vitals.height}</p> */}
                    <p><strong>Blood Pressure:</strong> {appointment.vitals.bp.systolic}/{appointment.vitals.bp.diastolic}</p>
                    <p><strong>Sugar:</strong> {appointment.vitals.sugar}</p>
                    <p><strong>Pulse:</strong> {appointment.vitals.pulse}</p>
                    <div>
                        <strong>Medicines Prescribed:</strong>
                        <ul> 
                            {appointment.medicinesPrescribed.map((medicine, index) => (
                                <li key={index}>{medicine.name} - {medicine.dosage} - {medicine.frequency}</li>
                            ))}
                        </ul>
                    </div>
                    <p><strong>Notes:</strong> {appointment.notes}</p>
                </div>
            )}
            <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
    );
}

export default AppointmentDetails;