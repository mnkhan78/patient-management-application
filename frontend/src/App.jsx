import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import NewPatient from './pages/NewPatient';
import PatientDetails from './pages/PatientDetails';
import NewAppointment from './pages/NewAppointment';

function App() {

  return (
    <>
      <div>
        {/* <h1>Hi there!</h1> */}
        <Router>
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/newPatient' element={<NewPatient />} />
              <Route path='/patientDetails/:id' element={<PatientDetails />} />
              <Route
                path="/patients/:patientId/new-appointment"
                element={<NewAppointment />}
              />

            </Routes>
          </main>
        </Router>
      </div>
    </>
  )
}

export default App
