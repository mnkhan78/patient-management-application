import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from '../api/axios'
import '../style/dashboard.css'

import PatientSearch from "../components/patients/PatientSearch";
import PatientTable from "../components/patients/PatientTable";

const Dashboard = () => {
    const [patients, setPatients] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {

            const res = await api.get('/patients');
            setPatients(res.data);

        } catch (error) {

            console.error("error fetching patients:", error);

        }
    };

    const handleDeletePatient = async (patientId) => {
        try {
            await api.delete(`/patients/${patientId}`);

            alert('Patient deleted successfully ❌');

            // Update UI instantly (no reload needed)
            setPatients(prev =>
                prev.filter(patient => patient._id !== patientId)
            );

        } catch (error) {
            console.error("Error deleting patient:", error);
        }
    };


    const filteredPatients = patients.filter((patient) => {
        const query = searchQuery.toLowerCase(); //case insensitive

        return (
            patient.fullName.toLowerCase().includes(query) ||
            patient.phone.includes(query)
        )
    })

    return (
        <div className="dashboard-container">
            <h3>Welcome, Dr. E.S. Khan</h3>
            <h1>Dashboard</h1>
            <div className="dashboard-actions">

                {/* new patient button: */}
                <Link to='/newPatient' >
                    <button className="new-patient-btn" type="submit">New Patient</button>
                </Link>

                {/* searching for patients:  */}
                <PatientSearch
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
            </div>

            {/* showing patients table:  */}
            <div className="patient-table-wrapper">
                <PatientTable patients={filteredPatients} onDelete={handleDeletePatient} />
            </div>
        </div>
    )
}

export default Dashboard;