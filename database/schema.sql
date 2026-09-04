-- ============================================
-- RESQNET DATABASE SCHEMA
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================
-- DEVICES
-- ============================================

CREATE TABLE IF NOT EXISTS devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    device_id VARCHAR(100) UNIQUE NOT NULL,

    device_name VARCHAR(150),

    last_latitude DECIMAL(10, 7),

    last_longitude DECIMAL(10, 7),

    last_seen TIMESTAMP WITH TIME ZONE,

    is_online BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- SOS ALERTS
-- ============================================

CREATE TABLE IF NOT EXISTS sos_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    sos_id VARCHAR(100) UNIQUE NOT NULL,

    device_id UUID NOT NULL,

    latitude DECIMAL(10, 7) NOT NULL,

    longitude DECIMAL(10, 7) NOT NULL,

    people_count INTEGER DEFAULT 1,

    emergency_type VARCHAR(50),

    description TEXT,

    priority VARCHAR(20) DEFAULT 'HIGH',

    status VARCHAR(20) DEFAULT 'NEW',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    accepted_at TIMESTAMP WITH TIME ZONE,

    resolved_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_sos_device
        FOREIGN KEY (device_id)
        REFERENCES devices(id)
        ON DELETE CASCADE,

    CONSTRAINT check_sos_priority
        CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),

    CONSTRAINT check_sos_status
        CHECK (status IN ('NEW', 'ACTIVE', 'RESOLVED')),

    CONSTRAINT check_people_count
        CHECK (people_count > 0)
);


-- ============================================
-- RESPONSES
-- ============================================

CREATE TABLE IF NOT EXISTS responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    sos_id UUID NOT NULL,

    officer_id VARCHAR(100),

    status VARCHAR(30) DEFAULT 'ACCEPTED',

    accepted_at TIMESTAMP WITH TIME ZONE,

    dispatched_at TIMESTAMP WITH TIME ZONE,

    arrived_at TIMESTAMP WITH TIME ZONE,

    completed_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_response_sos
        FOREIGN KEY (sos_id)
        REFERENCES sos_alerts(id)
        ON DELETE CASCADE,

    CONSTRAINT check_response_status
        CHECK (
            status IN (
                'ACCEPTED',
                'DISPATCHED',
                'ARRIVED',
                'COMPLETED'
            )
        )
);


-- ============================================
-- LOCATION HISTORY
-- ============================================

CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    device_id UUID NOT NULL,

    latitude DECIMAL(10, 7) NOT NULL,

    longitude DECIMAL(10, 7) NOT NULL,

    accuracy DECIMAL(10, 2),

    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_location_device
        FOREIGN KEY (device_id)
        REFERENCES devices(id)
        ON DELETE CASCADE
);


-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_sos_status
    ON sos_alerts(status);

CREATE INDEX IF NOT EXISTS idx_sos_created_at
    ON sos_alerts(created_at);

CREATE INDEX IF NOT EXISTS idx_sos_device
    ON sos_alerts(device_id);

CREATE INDEX IF NOT EXISTS idx_locations_device
    ON locations(device_id);

CREATE INDEX IF NOT EXISTS idx_locations_recorded_at
    ON locations(recorded_at);

CREATE INDEX IF NOT EXISTS idx_responses_sos
    ON responses(sos_id);

CREATE INDEX IF NOT EXISTS idx_responses_status
    ON responses(status);