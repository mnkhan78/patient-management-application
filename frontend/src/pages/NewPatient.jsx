import { useState } from "react";
import api from '../api/axios'
import { useNavigate } from "react-router";
import '../style/newPatient.css'

const NewPatient = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        patientId: "",
        fullName: "",
        age: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
        bloodGroup: "",
        medicalHistory: "",
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

            await api.post("/patients", formData);
            alert("patient added successfully");
            navigate("/dashboard");

        } catch (error) {
            console.error("Error adding patient:", error);
            alert("Failed to add patient ❌");
        }
    }
    return (
        <div className="new-patient-container">
            <h1 className="page-title">New Patient</h1>
            <form className="patient-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <input
                        name="patientId"
                        placeholder="Patient ID"
                        value={formData.patientId}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>

                    <input
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                    >
                        <option value="">Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>

                    <input
                        className="full-width"
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
                    />

                    <textarea
                        className="full-width"
                        name="medicalHistory"
                        placeholder="Medical History"
                        value={formData.medicalHistory}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Submit Details</button>
            </form>
        </div>
    )
}

export default NewPatient;