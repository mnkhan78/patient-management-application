import { useState, useEffect } from "react";
import api from "../api/axios";
import '../style/updateModal.css'

const UpdateAppointmentModal = ({ appointment, onClose }) => {

  // const [formData, setFormData] = useState(appointment);

  // useEffect(() => {
  //   if (appointment) {
  //     setFormData(appointment);
  //   }
  // }, [appointment]);

  const [formData, setFormData] = useState(() => appointment);

  // ---------- handlers ----------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

  const handleMedicineChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMedicines = [...formData.medicinesPrescribed];
    updatedMedicines[index][name] = value;

    setFormData({
      ...formData,
      medicinesPrescribed: updatedMedicines,
    });
  };

  const addMedicine = () => {
    setFormData({
      ...formData,
      medicinesPrescribed: [
        ...formData.medicinesPrescribed,
        { name: "", dosage: "", frequency: "" },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.patch(`/appointments/${formData._id}`, formData);
      alert("Appointment updated successfully ✅");
      onClose();
      window.location.reload(); // optional: better to refetch instead
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert("Update failed ❌");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Update Appointment</h2>

        <form onSubmit={handleSubmit}>

          {/* Medicines */}
          <h4>Medicines</h4>

          {formData.medicinesPrescribed?.map((medicine, index) => (
            <div key={index} className="medicine-row">
              <input
                type="text"
                name="name"
                value={medicine.name}
                onChange={(e) => handleMedicineChange(index, e)}
                placeholder="Medicine Name"
              />
              <input
                type="text"
                name="dosage"
                value={medicine.dosage}
                onChange={(e) => handleMedicineChange(index, e)}
                placeholder="Dosage"
              />
              <input
                type="text"
                name="frequency"
                value={medicine.frequency}
                onChange={(e) => handleMedicineChange(index, e)}
                placeholder="Frequency"
              />
            </div>
          ))}

          <button type="button" onClick={addMedicine}>
            + Add Medicine
          </button>

          {/* Notes */}
          <h4>Doctor Notes</h4>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Doctor notes"
          />

          <div className="modal-actions">
            <button type="submit" className="primary-btn">
              Save Changes
            </button>
            <button type="button" onClick={onClose} className="secondary-btn">
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UpdateAppointmentModal;