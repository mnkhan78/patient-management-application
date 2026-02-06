require('dotenv').config();

const express = require("express");
const cors = require('cors')
const passport = require('./authetication/auth');
const bodyParser = require('body-parser');
const db = require('./db')

const patientRoutes = require('./routes/patient.routes')
const appointmentRoutes = require('./routes/appointment.routes')
const userRoutes = require('./routes/user.routes');
const { jwtAuthMiddleware } = require('./authetication/jwt.auth');

const app = express();

app.use(cors())
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const localAuthMiddleware = passport.authenticate('local', { session: false });

// app.get("/", localAuthMiddleware, (req, res) => {
//   res.send("Backend is running 🚀");
// });

app.get("/", jwtAuthMiddleware, (req, res) => {
  res.send("Backend is running 🚀");
});

app.use('/patients', patientRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});