import { useState } from 'react';
import { useNavigate } from 'react-router';

import api from '../api/axios';

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
        <div>
                <h1>Login Page</h1>
                <form className='login-form' onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <button type="submit">Login</button>
                </form>
        </div>
    )
}

export default Login;