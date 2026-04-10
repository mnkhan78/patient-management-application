require('dotenv').config();

const express = require("express");
const cors = require('cors')
const passport = require('./authetication/auth');
const bodyParser = require('body-parser');
const db = require('./db')
const cookieParser = require('cookie-parser');

const patientRoutes = require('./routes/patient.routes')
const appointmentRoutes = require('./routes/appointment.routes')
const userRoutes = require('./routes/user.routes');
const pharmacyRoutes = require('./routes/pharmacy.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const { jwtAuthMiddleware, authorizeRoles } = require('./authetication/jwt.auth');

const app = express();

// app.use(cors())
app.use(cors({
  origin: process.env.CLIENT_URL, // frontend URL
  credentials: true,               // allow cookies
}));
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

const localAuthMiddleware = passport.authenticate('local', { session: false });

// app.get("/", localAuthMiddleware, (req, res) => {
//   res.send("Backend is running 🚀");
// });

app.get("/", jwtAuthMiddleware, authorizeRoles('doctor'), (req, res) => {
  res.send("Backend is running 🚀");
});

app.use('/patients', patientRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/users', userRoutes);
app.use('/pharmacy', pharmacyRoutes);
app.use('/analytics', analyticsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});