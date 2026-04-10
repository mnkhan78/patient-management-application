import { Link } from "react-router-dom";
import '../../style/dashboard.css';
import UpdatePatientModal from "./PatientUpdateModal";
import { useState } from "react";

const PatientTable = ({ patients, onDelete, fetchPatients }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const handleOpenModal = (patient) => {
        setSelectedPatient(patient);
        setIsModalOpen(true);
    };

    if (patients.length === 0) {
        return <p className="no-patients">No Patient Found</p>
    }

    return (
        <div className="patient-table-wrapper">
            <table className="patient-table">
                <thead>
                    <tr>
                        <th>Patient ID</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Gender</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map((patient) => (
                        <tr>

                            <th>{patient.patientId}</th>
                            <th>{patient.fullName}</th>
                            <th>{patient.phone}</th>
                            <th>{patient.gender}</th>
                            <th><Link to={`/patientDetails/${patient._id}`}>
                                <button className="view-btn" type="button"> View Details
                                </button>
                            </Link></th>
                            <th>
                                <button className="delete-btn" type="button"
                                    onClick={() => onDelete(patient._id)}>Delete</button>
                            </th>

                            <th>
                                <button className="update-btn" onClick={() => handleOpenModal(patient)}>
                                    Update
                                </button>
                            </th>
                        </tr>
                    ))}
                </tbody>
            </table>
            <UpdatePatientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                patient={selectedPatient}
                onUpdateSuccess={() => {
                    setIsModalOpen(false);
                    fetchPatients(); // Refresh list after update
                }}
            />
        </div>
    )
};

export default PatientTable;