import { useNavigate } from 'react-router';

import api from '../../api/axios';
const LogoutBtn = () => {
    const navigate  = useNavigate();
    const handleLogout = async () => {
        try {
            await api.post('/users/logout');
            alert("Logout successful! 🎉");
            // Optionally, you can redirect the user to the login page or home page after logout
            navigate("/login");
        } catch (error) {
            alert("Logout failed! ❌");
        }
    }
    return (
        <button onClick={handleLogout}>Logout</button>
    )
}

export default LogoutBtn;