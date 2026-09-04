const express = require("express");
const pool = require("../config/database");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const {
            device_id,
            device_name,
            latitude,
            longitude
        } = req.body;

        if (!device_id) {
            return res.status(400).json({
                success: false,
                message: "device_id is required"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO devices (
                device_id,
                device_name,
                last_latitude,
                last_longitude,
                last_seen,
                is_online
            )
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, TRUE)
            ON CONFLICT (device_id)
            DO UPDATE SET
                device_name = EXCLUDED.device_name,
                last_latitude = EXCLUDED.last_latitude,
                last_longitude = EXCLUDED.last_longitude,
                last_seen = CURRENT_TIMESTAMP,
                is_online = TRUE
            RETURNING *
            `,
            [
                device_id,
                device_name || null,
                latitude || null,
                longitude || null
            ]
        );

        res.json({
            success: true,
            message: "Device registered successfully",
            device: result.rows[0]
        });

    } catch (error) {
        console.error("Device registration error:", error);

        res.status(500).json({
            success: false,
            message: "Device registration failed"
        });
    }
});

module.exports = router;
