const express = require("express");
const cors = require("cors");
const pool = require("./config/database");
const deviceRoutes = require("./routes/devices");
const sosRoutes = require("./routes/sos");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Device API routes
app.use("/api/devices", deviceRoutes);

// SOS API routes
app.use("/api/sos", sosRoutes);

// Basic backend test
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "RESQNET Backend is running"
    });
});

// Database connection test
app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT NOW() AS current_time"
        );

        res.json({
            success: true,
            message: "RESQNET Database connected",
            database_time: result.rows[0].current_time
        });
    } catch (error) {
        console.error("Database connection error:", error);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`RESQNET Backend running on port ${PORT}`);
});