import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from '../api/axios'
import '../style/patients.css'

import PatientSearch from "../components/patients/PatientSearch";
import PatientTable from "../components/patients/PatientTable";
import {
    FiChevronLeft,
    FiChevronRight
} from "react-icons/fi";

import { FaUserPlus } from "react-icons/fa";
import Layout from "../components/Layout";

const Dashboard = () => {
    const [patients, setPatients] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [user, setUser] = useState(null);

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

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <Layout user={user}>
            <div className="patients-page">
                <div className="patients-header">

                    <div className="patients-title-section">
                        <h1>Patients</h1>
                        <p>Manage and view your registered patients</p>
                    </div>

                    <div className="patients-header-actions">
                        <PatientSearch
                            searchQuery={search}
                            setSearchQuery={setSearch}
                            setPage={setPage}
                        />
                        <Link to="/newPatient">
                            <FaUserPlus />
                        </Link>
                    </div>
                </div>

                <div className="patients-content">
                    <PatientTable
                        patients={filteredPatients}
                        onDelete={handleDeletePatient}
                        fetchPatients={fetchPatients}
                    />

                    <div className="patients-pagination">

                        <button
                            className="pagination-btn"
                            disabled={page === 1}
                            onClick={() => setPage((prev) => prev - 1)}
                        >
                            <FiChevronLeft />
                            <span>Prev</span>
                        </button>

                        <span className="pagination-info">
                            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                        </span>

                        <button
                            className="pagination-btn"
                            disabled={page === totalPages}
                            onClick={() => setPage((prev) => prev + 1)}
                        >
                            <span>Next</span>
                            <FiChevronRight />
                        </button>

                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard;