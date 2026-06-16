-- ============================================================
-- English Coach v2 — Migraciones definitivas
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- ── 1. AMPLIAR ec_concepts ───────────────────────────────────
-- audio_url ya existe (añadida en sesión anterior)
-- Añadimos context y command

ALTER TABLE ec_concepts
  ADD COLUMN IF NOT EXISTS audio_url TEXT,
  ADD COLUMN IF NOT EXISTS context   TEXT,   -- frases: cuándo usarla
  ADD COLUMN IF NOT EXISTS command   TEXT;   -- vocab: forma imperativa en pista


-- ── 2. TABLA ec_drills ──────────────────────────────────────
-- Drills gestionados desde BD (antes hardcodeados en el cliente)

CREATE TABLE IF NOT EXISTS ec_drills (
  id            TEXT PRIMARY KEY,              -- slug: "three-man-weave"
  en            TEXT NOT NULL,                 -- nombre EN
  es            TEXT NOT NULL,                 -- nombre ES
  meta          TEXT NOT NULL,                 -- "Calentamiento · 5–8 min"
  goal_en       TEXT,                          -- objetivo del drill EN
  goal_es       TEXT,                          -- objetivo del drill ES
  setup_en      TEXT NOT NULL,                 -- descripción montaje EN
  setup_es      TEXT NOT NULL,                 -- descripción montaje ES
  setup_audio   TEXT,                          -- URL MP3 montaje
  steps         JSONB NOT NULL DEFAULT '[]',   -- [{en, es, audio_url}]
  cues          JSONB NOT NULL DEFAULT '[]',   -- [{en, es, audio_url}]  ← botones con audio
  coach_lang    JSONB NOT NULL DEFAULT '[]',   -- [{en, es}]             ← lenguaje ampliado
  corrections   JSONB NOT NULL DEFAULT '[]',   -- [{en, es}]             ← don'ts del drill
  coaching      JSONB NOT NULL DEFAULT '[]',   -- [{en, es}]             ← coaching points
  mistakes      JSONB NOT NULL DEFAULT '[]',   -- [{en, es}]             ← errores comunes
  progression   JSONB NOT NULL DEFAULT '[]',   -- [{en, es}]             ← progresión
  order_index   INT NOT NULL DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'approved'
                  CHECK (status IN ('approved', 'draft')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 3. RLS ec_drills ────────────────────────────────────────
ALTER TABLE ec_drills ENABLE ROW LEVEL SECURITY;

-- Drills aprobados: visibles para todos los autenticados
CREATE POLICY "ec_drills_read" ON ec_drills
  FOR SELECT USING (status = 'approved');

-- Solo service role puede insertar / actualizar / borrar
-- (no hace falta policy explícita: el admin client bypasea RLS)

-- ── 4. ÍNDICE ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS ec_drills_order_idx ON ec_drills(order_index);
