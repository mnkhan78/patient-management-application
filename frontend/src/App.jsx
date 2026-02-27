import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import NewPatient from './pages/NewPatient';
import PatientDetails from './pages/PatientDetails';
import NewAppointment from './pages/NewAppointment';
import AppointmentDetails from './pages/AppointmentDetails';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Forbidden from './pages/Forbidden';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PatientAppointments from './pages/PatientAppointments';

function App() {

  return (
    <>
      <div>
        {/* <h1>Hi there!</h1> */}
        <Router>
          <main>
            <Routes>
              <Route path="/" element={<Home />} />

              <Route path='/dashboard' element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>}
              />

              <Route path='/newPatient' element={
                <ProtectedRoute>
                  <NewPatient />
                </ProtectedRoute>}
              />
              <Route path='/patientDetails/:id' element={<PatientDetails />} />
              <Route
                path="/patients/:patientId/new-appointment"
                element={<ProtectedRoute> <NewAppointment /> </ProtectedRoute>}
              />

              <Route path="/appointmentDetails/:id" element={<ProtectedRoute> <AppointmentDetails /> </ProtectedRoute>} />
              <Route path='/signup' element={<ProtectedRoute><Signup /> </ProtectedRoute>} />
              <Route path='/login' element={<Login />} />
              <Route path='/forbidden' element={<Forbidden />} />
              <Route path='/patients/:id/appointments' element={ <ProtectedRoute> <PatientAppointments /> </ProtectedRoute>} />

            </Routes>
          </main>
        </Router>
      </div>
    </>
  )
}

export default App
