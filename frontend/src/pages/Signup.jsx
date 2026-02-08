import { useState } from 'react';
import api from '../api/axios';



const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        role: "",
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
            await api.post('/users/signup', formData);
            alert("Signup successful! 🎉");

        } catch (error) {
            console.error("Error during signup:", error);
            alert("Signup failed! ❌");
        }
    }
    return (
        <div>
            <h1>Signup Page</h1>
            <form method="post" className='signup-form' onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
                <input type="text" name="username" placeholder='Username' value={formData.username} onChange={handleChange} />
                <input type="email" name="email" placeholder='Email' value={formData.email} onChange={handleChange} />
                <input type="password" name="password" placeholder='Password' value={formData.password} onChange={handleChange} />
                <select name="role" id="role" value={formData.role} onChange={handleChange}>
                    <option value="">Select Role</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                </select>
                <button type='submit'>Sign Up</button>
            </form>
        </div>
    )
}

export default Signup;