import React, { useEffect, useState } from "react";
import api from "../api/axios";
import '../style/pharmacy.css';

const Pharmacy = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMedicineQueue = async () => {
    try {
      const response = await api.get("/pharmacy/medicine-queue");
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching medicine queue:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsDispensed = async (id) => {
    try {
      await api.patch(`/pharmacy/dispense/${id}`);

      // Update UI instantly after success
      setAppointments((prev) =>
        prev.map((item) =>
          item._id === id
            ? { ...item, medicineStatus: "Dispensed" }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    fetchMedicineQueue(); // Initial load

    const interval = setInterval(() => {
      fetchMedicineQueue();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading pharmacy queue...</p>;

  return (
    <div className="pharmacy-container">
      <h2>Today's Medicine Queue</h2>

      <div className="card-container">
        {appointments.map((appointment) => (
          <div key={appointment._id} className="prescription-card">
            <h3>{appointment.patientId.fullName}</h3>

            <ul>
              {appointment.medicinesPrescribed.map((med, index) => (
                <li key={index}>
                  {med.name} - {med.dosage} ({med.frequency})
                </li>
              ))}
            </ul>

            <div className="status-section">
              <span
                className={
                  appointment.medicineStatus === "Pending"
                    ? "status pending"
                    : "status dispensed"
                }
              >
                {appointment.medicineStatus}
              </span>

              {appointment.medicineStatus === "Pending" && (
                <button
                  className="dispense-btn"
                  onClick={() => markAsDispensed(appointment._id)}
                >
                  Mark as Dispensed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pharmacy;