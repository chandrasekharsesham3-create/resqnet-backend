const express = require("express");
const pool = require("../config/database");

const router = express.Router();

// Get all SOS alerts
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                s.id,
                s.sos_id,
                s.latitude,
                s.longitude,
                s.people_count,
                s.emergency_type,
                s.description,
                s.priority,
                s.status,
                s.created_at,
                s.accepted_at,
                s.resolved_at,
                d.device_id,
                d.device_name
            FROM sos_alerts s
            JOIN devices d ON d.id = s.device_id
            ORDER BY s.created_at DESC
            `
        );

        res.json({
            success: true,
            sos: result.rows
        });

    } catch (error) {
        console.error("SOS fetch error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch SOS alerts"
        });
    }
});

// Create SOS alert
router.post("/", async (req, res) => {
    try {
        const {
            id,
            name,
            phone,
            emergencyType,
            people,
            description,
            location,
            latitude,
            longitude,
            timestamp,
            device_id
        } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "SOS id is required"
            });
        }

        if (
            latitude === undefined ||
            longitude === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "SOS location is required"
            });
        }

        let deviceResult;

        if (device_id) {
            deviceResult = await pool.query(
                `
                SELECT id
                FROM devices
                WHERE device_id = $1
                LIMIT 1
                `,
                [device_id]
            );
        } else {
            deviceResult = await pool.query(
                `
                SELECT id
                FROM devices
                ORDER BY created_at ASC
                LIMIT 1
                `
            );
        }

        if (deviceResult.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No registered RESQNET device found"
            });
        }

        const databaseDeviceId = deviceResult.rows[0].id;

        const result = await pool.query(
            `
            INSERT INTO sos_alerts (
                sos_id,
                device_id,
                latitude,
                longitude,
                people_count,
                emergency_type,
                description,
                priority,
                status
            )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                'HIGH',
                'NEW'
            )
            RETURNING *
            `,
            [
                id,
                databaseDeviceId,
                latitude,
                longitude,
                Number(people) || 1,
                emergencyType || "Other",
                description || null
            ]
        );

        await pool.query(
            `
            UPDATE devices
            SET
                last_latitude = $1,
                last_longitude = $2,
                last_seen = CURRENT_TIMESTAMP,
                is_online = TRUE
            WHERE id = $3
            `,
            [
                latitude,
                longitude,
                databaseDeviceId
            ]
        );

        console.log(`RESQNET SOS RECEIVED: ${id}`);

        res.status(201).json({
            success: true,
            message: "SOS received successfully",
            sos: result.rows[0]
        });

    } catch (error) {
        console.error("SOS creation error:", error);

        res.status(500).json({
            success: false,
            message: "SOS creation failed"
        });
    }
});

module.exports = router;