const connectDB = require('./db/connection');
const express = require('express');
const authRoutes = require('./routes/auth-routes');
const dns = require('dns');
const adminRoute = require('./routes/admin-route');
const requestRoutes = require('./routes/requests-routes');
const cors = require('cors');
require('dotenv').config();

dns.setServers(["8.8.8.8", "1.1.1.1"])

const app = express();
app.use(cors({
    origin: (origin, callback) => {
    const allowedOrigins = ['http://localhost:5173', 'https://municipality-frontend-prototype.onrender.com', "https://municipality-frontend-prototype-kjfgbalr8-bude-team.vercel.app/"];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
    } else {
        callback(new Error('Not allowed by CORS'));
    }
    },
    credentials: true
}));

connectDB();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoute);
app.use("/api/requests", requestRoutes);

app.listen(process.env.port , () => {
    console.log(`Server is running on port ${process.env.port}`);
});
