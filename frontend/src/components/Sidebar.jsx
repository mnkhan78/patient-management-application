import { useNavigate } from "react-router";
import {
    FaHome,
    FaCalendarAlt,
    FaUser,
    FaFileMedical,
} from "react-icons/fa";
import "./styles/dashboard.css";

const Sidebar = ({ user }) => {

    const navigate = useNavigate();

    return (
        <aside className="sidebar">

            <div className="sidebar-top">

                <div className="sidebar-logo">
                    <h2>PMA</h2>
                </div>

                <div className="sidebar-user">
                    <div className="sidebar-avatar">
                        {user?.name?.charAt(0)}
                    </div>

                    <h4>{user?.name}</h4>
                </div>

            </div>

            <div className="sidebar-menu">

                <button
                    className="sidebar-link"
                    onClick={() => navigate("/frontal")}
                >
                    <FaHome />
                    <span>Dashboard</span>
                </button>

                <button
                    className="sidebar-link"
                    onClick={() => navigate("/appointments/today")}
                >
                    <FaCalendarAlt />
                    <span>Appointments</span>
                </button>

                <button
                    className="sidebar-link"
                    onClick={() =>
                        navigate('/dashboard')
                    }
                >
                    <FaUser />
                    <span>Patients</span>
                </button>

                <button
                    className="sidebar-link"
                    onClick={() => navigate("/pharmacy")}
                >
                    <FaFileMedical />
                    <span>Medicine Queue</span>
                </button>

            </div>

        </aside>
    );
};

export default Sidebar;