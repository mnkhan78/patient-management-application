import { useNavigate } from "react-router";
import {
    FaHome,
    FaCalendarAlt,
    FaUser,
    FaFileMedical,
} from "react-icons/fa";
import "./styles/dashboard.css";

const BottomNavigation = ({ user }) => {

    const navigate = useNavigate();

    return (
        <div className="mobile-bottom-nav">

            <button
                onClick={() => navigate("/frontal")}
            >
                <FaHome size={20} />
                <span>Dashboard</span>
            </button>

            <button
                onClick={() => navigate("/appointments/today")}
            >
                <FaCalendarAlt size={20} />
                <span>Appointments</span>
            </button>

            <button
                onClick={() =>
                    navigate('/dashboard')
                }
            >
                <FaUser size={20} />
                <span>Patients</span>
            </button>

            <button
                onClick={() =>
                    navigate('/pharmacy')
                }
            >
                <FaFileMedical size={20} />
                <span>Medicine Queue</span>
            </button>

        </div>
    );
};

export default BottomNavigation;