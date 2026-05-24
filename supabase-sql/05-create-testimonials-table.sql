-- ============================================
-- STEP 5: Create Testimonials Table (OPTIONAL)
-- ============================================
-- This table stores client testimonials for your About page
-- You can skip this if you don't need testimonials yet

CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_title TEXT,
  client_company TEXT,
  testimonial_text TEXT NOT NULL,
  client_photo_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_testimonials_active ON testimonials(is_active);
CREATE INDEX idx_testimonials_display_order ON testimonials(display_order);

-- Add comments
COMMENT ON TABLE testimonials IS 'Client testimonials for About page';
COMMENT ON COLUMN testimonials.is_active IS 'Controls whether testimonial is displayed on website';
