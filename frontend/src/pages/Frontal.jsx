import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import api from "../api/axios";
import Layout from "../components/Layout";

import {
    FaUsers,
    FaCalendarDay,
    FaCheckCircle,
    FaClock,
    FaArrowRight,
    FaChartLine,
    FaUserPlus,
    FaCalendarPlus,
} from "react-icons/fa";

import "../style/frontal.css";

const Frontal = () => {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        totalPatients: 0,
        todayAppointments: 0,
        completedAppointments: 0,
        pendingAppointments: 0,
    });

    const [todayAppointments, setTodayAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate("/login");
        }

    }, [navigate]);

    const fetchDashboardData = async () => {

        try {

            setLoading(true);
            const todayResponse = await api.get("/appointments/today");
            const appointments = Array.isArray(todayResponse.data) ? todayResponse.data : [];

            setTodayAppointments(appointments);

            const completed = appointments.filter(
                (appointment) =>
                    appointment.status === "completed"
            ).length;

            const pending = appointments.filter(
                (appointment) =>
                    appointment.status === "pending" ||
                    appointment.status === "Scheduled" ||
                    appointment.status === "pending_approval" ||
                    appointment.status === "awaiting_payment"
            ).length;

            const totalPatientsResponse = await api.get("/patients");
            const totalPatients = totalPatientsResponse.data.totalPatients ? totalPatientsResponse.data.totalPatients : 0;
            setDashboardData({
                totalPatients: totalPatients,
                todayAppointments: appointments.length,
                completedAppointments: completed,
                pendingAppointments: pending,
            });

        } catch (error) {

            console.error(
                "Error loading dashboard:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        if (user) {
            fetchDashboardData();
        }

    }, [user]);

    const formatTime = (time) => {

        if (!time) return "--";

        return new Date(time).toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };


    const getStatusLabel = (status) => {

        if (!status) return "Unknown";

        return status
            .replaceAll("_", " ")
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );
    };


    const getStatusClass = (status) => {

        switch (status) {

            case "completed":
                return "status-completed";

            case "pending":
            case "pending_approval":
                return "status-pending";

            case "awaiting_payment":
                return "status-payment";

            case "confirmed":
                return "status-confirmed";

            case "cancelled":
            case "rejected":
                return "status-cancelled";

            default:
                return "status-default";
        }
    };


    if (!user) {

        return (
            <div className="dashboard-loading">
                Loading dashboard...
            </div>
        );

    }

    return (

        <Layout user={user}>

            <main className="frontal-page">

                <section className="frontal-header">

                    <div>

                        <p className="frontal-eyebrow">
                            Clinic Overview
                        </p>

                        <h1>
                            Welcome back,{" "}
                            <span>
                                {user?.name}
                            </span>
                        </h1>

                        <p className="frontal-subtitle">
                            Here's what's happening at your
                            clinic today.
                        </p>

                    </div>

                    <div className="header-date">

                        <span>
                            Today
                        </span>

                        <strong>
                            {new Date().toLocaleDateString(
                                "en-IN",
                                {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                }
                            )}
                        </strong>

                    </div>

                </section>

                <section className="stats-grid">

                    {/* TOTAL PATIENTS */}

                    <div className="stat-card">

                        <div className="stat-card-top">

                            <div className="stat-icon patients">
                                <FaUsers />
                            </div>

                            <span className="stat-label">
                                Patients
                            </span>

                        </div>

                        <div className="stat-value">

                            {loading
                                ? "—"
                                : dashboardData.totalPatients}

                        </div>

                        <p className="stat-description">
                            Total registered patients
                        </p>

                    </div>


                    {/* TODAY APPOINTMENTS */}

                    <div className="stat-card">

                        <div className="stat-card-top">

                            <div className="stat-icon appointments">
                                <FaCalendarDay />
                            </div>

                            <span className="stat-label">
                                Today's Appointments
                            </span>

                        </div>

                        <div className="stat-value">

                            {loading
                                ? "—"
                                : dashboardData.todayAppointments}

                        </div>

                        <p className="stat-description">
                            Appointments scheduled today
                        </p>

                    </div>


                    {/* COMPLETED */}

                    <div className="stat-card">

                        <div className="stat-card-top">

                            <div className="stat-icon completed">
                                <FaCheckCircle />
                            </div>

                            <span className="stat-label">
                                Completed
                            </span>

                        </div>

                        <div className="stat-value">

                            {loading
                                ? "—"
                                : dashboardData.completedAppointments}

                        </div>

                        <p className="stat-description">
                            Appointments completed today
                        </p>

                    </div>


                    {/* PENDING */}

                    <div className="stat-card">

                        <div className="stat-card-top">

                            <div className="stat-icon pending">
                                <FaClock />
                            </div>

                            <span className="stat-label">
                                Pending
                            </span>

                        </div>

                        <div className="stat-value">

                            {loading
                                ? "—"
                                : dashboardData.pendingAppointments}

                        </div>

                        <p className="stat-description">
                            Appointments requiring attention
                        </p>

                    </div>

                </section>


                {/* =====================================
                    QUICK ACTIONS
                ====================================== */}

                <section className="quick-actions">

                    <button
                        className="quick-action"
                        onClick={() =>
                            navigate("/newPatient")
                        }
                    >

                        <span className="quick-action-icon">
                            <FaUserPlus />
                        </span>

                        <span>
                            <strong>
                                Add Patient
                            </strong>

                            <small>
                                Register a new patient
                            </small>
                        </span>

                        <FaArrowRight />

                    </button>


                    <button
                        className="quick-action"
                        onClick={() =>
                            navigate("/appointments/new")
                        }
                    >

                        <span className="quick-action-icon">
                            <FaCalendarPlus />
                        </span>

                        <span>
                            <strong>
                                New Appointment
                            </strong>

                            <small>
                                Schedule an appointment
                            </small>
                        </span>

                        <FaArrowRight />

                    </button>

                </section>

                <section className="dashboard-content-grid">

                    <div className="dashboard-panel appointments-panel">

                        <div className="panel-header">

                            <div>

                                <p className="panel-eyebrow">
                                    Schedule
                                </p>

                                <h2>
                                    Today's Appointments
                                </h2>

                            </div>

                            <button
                                className="view-all-btn"
                                onClick={() =>
                                    navigate("/appointments/today")
                                }
                            >
                                View All
                                <FaArrowRight />
                            </button>

                        </div>


                        {loading ? (

                            <div className="panel-loading">
                                Loading appointments...
                            </div>

                        ) : todayAppointments.length === 0 ? (

                            <div className="panel-empty">

                                <FaCalendarDay />

                                <h3>
                                    No appointments today
                                </h3>

                                <p>
                                    Your schedule is clear for today.
                                </p>

                            </div>

                        ) : (

                            <div className="appointment-list">

                                {todayAppointments
                                    .slice(0, 6)
                                    .map((appointment) => (

                                        <div
                                            className="dashboard-appointment"
                                            key={appointment._id}
                                        >

                                            <div className="appointment-time">

                                                <strong>
                                                    {formatTime(
                                                        appointment.startTime
                                                    )}
                                                </strong>

                                                <span>
                                                    {formatTime(
                                                        appointment.endTime
                                                    )}
                                                </span>

                                            </div>


                                            <div className="appointment-info">

                                                <h3>
                                                    {
                                                        appointment.customerName ||
                                                        appointment.patientId?.fullName ||
                                                        "Patient"
                                                    }
                                                </h3>

                                                <p>
                                                    {
                                                        appointment.serviceId?.name ||
                                                        "Consultation"
                                                    }
                                                </p>

                                            </div>


                                            <span
                                                className={`appointment-status ${getStatusClass(
                                                    appointment.status
                                                )}`}
                                            >
                                                {getStatusLabel(
                                                    appointment.status
                                                )}
                                            </span>

                                        </div>

                                    ))}

                            </div>

                        )}

                    </div>


                    {/* =================================
                        ANALYTICS
                    ================================== */}

                    <div className="dashboard-panel analytics-panel">

                        <div className="panel-header">

                            <div>

                                <p className="panel-eyebrow">
                                    Insights
                                </p>

                                <h2>
                                    Appointment Analytics
                                </h2>

                            </div>

                            <div className="analytics-icon">
                                <FaChartLine />
                            </div>

                        </div>


                        <div className="analytics-summary">

                            <div className="analytics-number">
                                {dashboardData.todayAppointments}
                            </div>

                            <div>
                                <strong>
                                    Appointments today
                                </strong>

                                <p>
                                    Keep track of your clinic
                                    activity.
                                </p>
                            </div>

                        </div>


                        <div className="progress-section">

                            <div className="progress-row">

                                <span>
                                    Completed
                                </span>

                                <strong>
                                    {
                                        dashboardData.completedAppointments
                                    }
                                </strong>

                            </div>

                            <div className="progress-bar">

                                <div
                                    className="progress-fill completed-fill"
                                    style={{
                                        width:
                                            dashboardData.todayAppointments
                                                ? `${(
                                                    dashboardData.completedAppointments /
                                                    dashboardData.todayAppointments
                                                ) * 100}%`
                                                : "0%",
                                    }}
                                />

                            </div>

                        </div>


                        <div className="progress-section">

                            <div className="progress-row">

                                <span>
                                    Pending
                                </span>

                                <strong>
                                    {
                                        dashboardData.pendingAppointments
                                    }
                                </strong>

                            </div>

                            <div className="progress-bar">

                                <div
                                    className="progress-fill pending-fill"
                                    style={{
                                        width:
                                            dashboardData.todayAppointments
                                                ? `${(
                                                    dashboardData.pendingAppointments /
                                                    dashboardData.todayAppointments
                                                ) * 100}%`
                                                : "0%",
                                    }}
                                />

                            </div>

                        </div>


                        <button
                            className="analytics-button"
                            onClick={() =>
                                navigate("/analytics")
                            }
                        >
                            View Detailed Analytics
                            <FaArrowRight />
                        </button>

                    </div>

                </section>


                {/* =====================================
                    FUTURE FEATURES
                ====================================== */}

                <section className="future-section">

                    <div className="future-header">

                        <div>

                            <p className="panel-eyebrow">
                                Coming Soon
                            </p>

                            <h2>
                                More Clinic Insights
                            </h2>

                        </div>

                    </div>


                    <div className="future-grid">

                        <div className="future-card">

                            <FaChartLine />

                            <h3>
                                Revenue Overview
                            </h3>

                            <p>
                                Track consultation revenue,
                                payments and financial trends.
                            </p>

                        </div>


                        <div className="future-card">

                            <FaUsers />

                            <h3>
                                Patient Growth
                            </h3>

                            <p>
                                Understand new and returning
                                patient trends.
                            </p>

                        </div>


                        <div className="future-card">

                            <FaCalendarDay />

                            <h3>
                                Clinic Performance
                            </h3>

                            <p>
                                Monitor appointments,
                                completion rates and workload.
                            </p>

                        </div>

                    </div>

                </section>

            </main>

        </Layout>

    );
};

export default Frontal;