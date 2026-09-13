import { Link } from "react-router-dom";
// import '../../style/dashboard.css';
import UpdatePatientModal from "./PatientUpdateModal";
import { useState } from "react";
import {
    FiEye,
    FiEdit2,
    FiTrash2,
    FiCalendar
} from "react-icons/fi";
import '../../style/patients.css';

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
                        <th>Patient</th>
                        <th>Phone</th>
                        <th>Gender</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {patients.map((patient) => (

                        <tr key={patient._id}>

                            <td>
                                <span className="patient-id-badge">
                                    {patient.patientId}
                                </span>
                            </td>

                            <td>
                                <div className="patient-name-cell">

                                    <div className="patient-avatar">
                                        {patient.fullName?.charAt(0)?.toUpperCase()}
                                    </div>

                                    <div className="patient-name-info">
                                        <strong>{patient.fullName}</strong>
                                        <span>Patient</span>
                                    </div>

                                </div>
                            </td>

                            <td>
                                <span className="patient-phone">
                                    {patient.phone}
                                </span>
                            </td>

                            <td>
                                <span
                                    className={`gender-badge ${patient.gender?.toLowerCase()
                                        }`}
                                >
                                    {patient.gender}
                                </span>
                            </td>

                            <td>

                                <div className="patient-actions">

                                    {/* View */}
                                    <Link
                                        to={`/patientDetails/${patient._id}`}
                                        title="View patient"
                                    >
                                        <button
                                            className="patient-action view-action"
                                            type="button"
                                        >
                                            <FiEye />
                                        </button>
                                    </Link>


                                    {/* Update */}
                                    <button
                                        className="patient-action edit-action"
                                        type="button"
                                        title="Update patient"
                                        onClick={() => handleOpenModal(patient)}
                                    >
                                        <FiEdit2 />
                                    </button>


                                    {/* New Appointment */}
                                    <Link
                                        to={`/patients/${patient._id}/new-appointment`}
                                        title="New appointment"
                                    >
                                        <button
                                            className="patient-action appointment-action"
                                            type="button"
                                        >
                                            <FiCalendar />
                                        </button>
                                    </Link>


                                    {/* Delete */}
                                    <button
                                        className="patient-action delete-action"
                                        type="button"
                                        title="Delete patient"
                                        onClick={() => onDelete(patient._id)}
                                    >
                                        <FiTrash2 />
                                    </button>

                                </div>

                            </td>

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
                    fetchPatients();
                }}
            />

        </div>
    )
};

export default PatientTable;