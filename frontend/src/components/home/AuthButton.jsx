import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthConetxt'
import '../../style/home.css';

const AuthButton = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    if (isAuthenticated) {
        return <button className="auth-btn logout-btn" onClick={logout}>Logout</button>;
    }

    return <button className="auth-btn login-btn" onClick={() => navigate("/login")}>Login</button>;
};

export default AuthButton;