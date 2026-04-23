import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const TodayAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/appointments/today");
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClick = (patientId) => {
    navigate(`/patientDetails/${patientId}`);
  };

  return (
    <div className="appointments-container">
      <h2 className="appointments-title">Today's Appointments</h2>

      {appointments.length === 0 ? (
        <p className="empty-text">No appointments today</p>
      ) : (
        appointments.map((appt) => (
          <div
            key={appt._id}
            className="appointment-card"
            onClick={() => handleClick(appt.patientId._id)}
          >
            <p className="patient-name">
              {appt.patientId?.fullName || "Unknown Patient"}
            </p>

            <p className="appointment-time">
              Time:{" "}
              {new Date(appt.appointmentDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default TodayAppointments;