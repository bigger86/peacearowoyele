-- ============================================
-- STEP 1: Enable UUID Extension
-- ============================================
-- This enables the UUID generation function
-- Run this FIRST before creating any tables

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verify it worked (optional)
-- You should see a success message
