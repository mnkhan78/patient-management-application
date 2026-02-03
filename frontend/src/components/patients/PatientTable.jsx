import { Link } from "react-router-dom";
import '../../style/dashboard.css';
import api from "../../api/axios";

const PatientTable = ({patients, onDelete}) => {
    if (patients.length === 0) {
        return <p className="no-patients">No Patient Found</p>
    }

    return (
        <div className="patient-table-wrapper">
        <table className="patient-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Age</th>
                    <th>Gender</th>
                </tr>
            </thead>
            <tbody>
                {patients.map ((patient) => (
                    <tr>
                        <th>{patient.fullName}</th>
                        <th>{patient.phone}</th>
                        <th>{patient.age}</th>
                        <th>{patient.gender}</th>
                        <th><Link to={`/patientDetails/${patient._id}`}>
                            <button className="view-btn" type="button"> view details
                            </button>
                        </Link></th>
                        <th>
                            <button className="delete-btn" type="button" 
                            onClick={() => onDelete(patient._id)}>Delete</button>
                        </th>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    )
};

export default PatientTable;