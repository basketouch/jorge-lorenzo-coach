-- Añadir columna audio_url a ec_concepts
ALTER TABLE ec_concepts ADD COLUMN IF NOT EXISTS audio_url TEXT;
