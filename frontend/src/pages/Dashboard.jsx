import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from '../api/axios'
import '../style/dashboard.css'

import PatientSearch from "../components/patients/PatientSearch";
import PatientTable from "../components/patients/PatientTable";
// import Navbar from "../components/home/Navbar";

const Dashboard = () => {
    const [patients, setPatients] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchPatients(page);
    }, [page, search]);

    const fetchPatients = async (page) => {
        try {

            const res = await api.get(`/patients?page=${page}&limit=10&search=${search}`);
            setPatients(res.data.data);
            setPage(res.data.currentPage);
            setTotalPages(res.data.totalPages);

        } catch (error) {

            console.error("error fetching patients:", error);

        }
    };

    const handleDeletePatient = async (patientId) => {
        if (!window.confirm("Are you sure you want to delete this patient? This action cannot be undone.")) {
            return;
        }
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
            patient.phone.includes(query) ||
            patient.patientId.toLowerCase().includes(query)
        )
    })

    return (
        <div className="dashboard-container">
            <h3>Welcome, Dr. Khan</h3>
            <h1>Dashboard</h1>
            <div className="dashboard-actions">

                <Link to='/pharmacy' >
                    <button className="pharmacy-btn" type="submit">Medicine Queue</button>
                </Link>

                <Link to='/appointments/today'>
                    <button className="today-appointments-btn" type="submit">Today's Appointments</button>
                </Link>

                {/* new patient button: */}
                <Link to='/newPatient' >
                    <button className="new-patient-btn" type="submit">New Patient</button>
                </Link>


                {/* searching for patients:  */}
                {/* <PatientSearch
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                /> */}
                <PatientSearch
                    searchQuery={search}
                    setSearchQuery={setSearch}
                    setPage={setPage}
                />
            </div>

            <div style={{ marginTop: "20px" }}>
                <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                >
                    Prev
                </button>

                <span style={{ margin: "0 10px" }}>
                    Page {page} of {totalPages}
                </span>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                >
                    Next
                </button>
            </div>

            {/* showing patients table:  */}
            <div className="patient-table-wrapper">
                <PatientTable patients={filteredPatients} onDelete={handleDeletePatient} fetchPatients={fetchPatients} />
            </div>
        </div>
    )
}

export default Dashboard;