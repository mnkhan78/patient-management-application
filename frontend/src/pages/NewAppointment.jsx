import { useState } from "react";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router";
import '../style/newAppointment.css'

const NewAppointment = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();

  const [formData, setFormData] = useState({
    patientId: patientId,       //auto-attached
    appointmentDate: "",
    reason: "",
    doctorName: "",
    status: "Scheduled",
    vitals: {
      weight: "",
      bp: {
        systolic: "",
        diastolic: "",
      },
      sugar: "",
      pulse: "",
    },
    medicinesPrescribed: [
      {
        name: "",
        dosage: "",
        frequency: "",
      },
    ],
    notes: ""
  });

  // ---------------form handlers------------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // For vitals (nested object)
  const handleVitalsChange = (e) => {
    const { name, value } = e.target;

    if (name === "systolic" || name === "diastolic") {
      setFormData({
        ...formData,
        vitals: {
          ...formData.vitals,
          bp: {
            ...formData.vitals.bp,
            [name]: value,
          },
        },
      });
    } else {
      setFormData({
        ...formData,
        vitals: {
          ...formData.vitals,
          [name]: value,
        },
      });
    }
  };

  // For medicines (array)
  const handleMedicineChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMedicines = [...formData.medicinesPrescribed];

    updatedMedicines[index][name] = value;

    setFormData({
      ...formData,
      medicinesPrescribed: updatedMedicines,
    });
  };

  // Add new medicine row
  const addMedicine = () => {
    setFormData({
      ...formData,
      medicinesPrescribed: [
        ...formData.medicinesPrescribed,
        {
          name: "",
          dosage: "",
          frequency: "",
          duration: "",
          instructions: "",
        },
      ],
    });
  };

  // Remove last medicine row
  const removeMedicine = () => {
    const updatedMedicines = formData.medicinesPrescribed.slice(0, -1);

    setFormData({
      ...formData,
      medicinesPrescribed: updatedMedicines,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/appointments", formData);
      alert("Appointment scheduled successfully ✅");
      navigate(`/patientDetails/${patientId}`);
    } catch (error) {
      console.error("Error scheduling new appointment:", error);
      alert("Failed to schedule an appointment ❌");
    }
  };

  return (
    <div className="appointment-container">
      <h1 className="page-title">New Appointment</h1>

      <form className="appointment-form" onSubmit={handleSubmit}>
        <div className="section">
          <h3>Appointment Info</h3>
          <div className="form-grid">
            <input
              type="datetime-local"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="reason"
              placeholder="Reason for visit"
              value={formData.reason}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="doctorName"
              placeholder="Doctor name"
              value={formData.doctorName}
              onChange={handleChange}
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="section">


          <h3>Vitals</h3>
          <div className="form-grid">
            <input
              type="number"
              name="weight"
              placeholder="Weight (kg)"
              value={formData.vitals.weight}
              onChange={handleVitalsChange}
            />

            <input
              type="number"
              name="height"
              placeholder="Height (cm)"
              value={formData.vitals.height}
              onChange={handleVitalsChange}
            />

            <input
              type="number"
              name="systolic"
              placeholder="BP Systolic"
              value={formData.vitals.bp.systolic}
              onChange={handleVitalsChange}
            />

            <input
              type="number"
              name="diastolic"
              placeholder="BP Diastolic"
              value={formData.vitals.bp.diastolic}
              onChange={handleVitalsChange}
            />

            <input
              type="number"
              name="sugar"
              placeholder="Sugar (mg/dL)"
              value={formData.vitals.sugar}
              onChange={handleVitalsChange}
            />

            <input
              type="number"
              name="pulse"
              placeholder="Pulse (bpm)"
              value={formData.vitals.pulse}
              onChange={handleVitalsChange}
            />
          </div>
        </div>
        <div className="section">


          <h3>Medicines Prescribed</h3>

          {formData.medicinesPrescribed.map((medicine, index) => (
            <div key={index} className="medicine-row">

              <input
                type="text"
                name="name"
                placeholder="Medicine Name"
                value={medicine.name}
                onChange={(e) => handleMedicineChange(index, e)}
              />

              <input
                type="text"
                name="dosage"
                placeholder="Dosage"
                value={medicine.dosage}
                onChange={(e) => handleMedicineChange(index, e)}
              />

              <input
                type="text"
                name="frequency"
                placeholder="Frequency"
                value={medicine.frequency}
                onChange={(e) => handleMedicineChange(index, e)}
              />

            </div>
          ))}

          <button type="button" className="secondary-btn" onClick={addMedicine}>
            + Add Medicine
          </button>
          <button className="remove-btn" onClick={removeMedicine}>Remove Medicine</button>
        </div>
        <div className="section">
          <h3>Notes</h3>

          <textarea
            name="notes"
            placeholder="Additional notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>
        <button className="primary-btn" type="submit">Create Appointment</button>
      </form>
    </div>
  );
};

export default NewAppointment;