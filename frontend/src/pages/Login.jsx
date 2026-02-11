import { useState } from 'react';
import { useNavigate } from 'react-router';

import api from '../api/axios';
import '../style/auth.css';

const Login = () => {
    const navigate  = useNavigate();
    const [formData, setFormData] = useState ({
        username: "",
        password: "",

    });
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post('/users/login', formData);
            alert("Login successful! 🎉");
            navigate("/dashboard");
        } catch (error) {
            alert("Login failed! ❌");
        }
    }
    return (
        <div className='auth-container'>
                <h1 className='auth-title'>Login</h1>
                <form className='auth-form' onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
        </div>
    )
}

export default Login;