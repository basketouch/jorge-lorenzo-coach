"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import "./english.css";
import { saveEcProgress } from "./actions";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Concept {
  id: string;
  type: "term" | "phrase" | "drill";
  category: string;
  en: string;
  es: string;
  say: string | null;
  note: string | null;
  audio_url: string | null;
}

interface Progress {
  concept_id: string;
  level: number;
  streak: number;
  attempts: number;
  correct_count: number;
  next_review: string;
  last_seen: string;
}

interface Props {
  userId: string;
  userAccessLevel: "free" | "member";
  concepts: Concept[];
  initialProgress: Progress[];
}

// ─── Static drills data ──────────────────────────────────────────────────────

const DRILLS = [
  {
    id: "three-man-weave", en: "Three-man weave", es: "Tres en zigzag (onda)", meta: "Calentamiento · 5–8 min",
    setup: { en: "Three lines on the baseline. Middle line has the ball.", es: "Tres filas en la línea de fondo. La del medio con balón." },
    steps: [
      { en: "Middle player starts with the ball.", es: "El jugador del medio empieza con balón." },
      { en: "Pass, then run behind the player you passed to.", es: "Pasa y corre por detrás del que recibe." },
      { en: "Fill the outside lane, catch, and pass again.", es: "Ocupa el carril exterior, recibe y vuelve a pasar." },
      { en: "Two dribbles maximum - keep it moving.", es: "Máximo dos botes - mantenedlo fluido." },
      { en: "Finish with a layup.", es: "Terminad con una bandeja." },
      { en: "Grab the rebound and bring it back the other way.", es: "Coged el rebote y volved por el otro lado." },
    ],
    cues: [{ en: "Follow your pass!", es: "¡Sigue tu pase!" }, { en: "Sharp passes!", es: "¡Pases precisos!" }],
  },
  {
    id: "shell-drill", en: "Shell drill (4-on-4)", es: "Defensivo 4x4 (shell)", meta: "Defensa · 10 min",
    setup: { en: "Four on offense around the perimeter, four on defense matched up.", es: "Cuatro en ataque por el perímetro, cuatro en defensa emparejados." },
    steps: [
      { en: "Offense, pass the ball around - no dribble yet.", es: "Ataque, mover el balón - todavía sin bote." },
      { en: "On every pass, defense jumps to the ball.", es: "En cada pase, la defensa salta hacia el balón." },
      { en: "On the ball: pressure. One pass away: deny.", es: "Al balón: presión. A un pase: negar." },
      { en: "Two passes away: drop and help.", es: "A dos pases: bajar y ayudar." },
      { en: "Talk on every screen - call it out.", es: "Hablad en cada bloqueo - avisad." },
      { en: "On the whistle, we go live.", es: "Al silbato, se juega libre." },
    ],
    cues: [{ en: "Jump to the ball!", es: "¡Salta al balón!" }, { en: "Talk to each other!", es: "¡Comunicaos!" }, { en: "Close out under control.", es: "Bascula controlado." }],
  },
  {
    id: "closeout-1v1", en: "Closeout 1-on-1", es: "Basculación y 1x1", meta: "Defensa · 8 min",
    setup: { en: "Defender starts under the rim with the ball. Attacker waits on the wing.", es: "El defensor empieza bajo el aro con balón. El atacante espera en el ala." },
    steps: [
      { en: "Defender passes out to the attacker and closes out.", es: "El defensor pasa al atacante y bascula." },
      { en: "Close out high, short steps, hand up.", es: "Bascula alto, pasos cortos, mano arriba." },
      { en: "Attacker reads it: shoot or drive.", es: "El atacante lee: tira o penetra." },
      { en: "Live until a stop or a basket.", es: "Se juega hasta parada o canasta." },
      { en: "Then switch roles.", es: "Después, cambiad de rol." },
    ],
    cues: [{ en: "Break down - don't fly by!", es: "¡Frena - no te pases de largo!" }, { en: "Contest, don't foul.", es: "Disputa, sin falta." }],
  },
  {
    id: "layup-lines", en: "Layup lines", es: "Filas de bandejas", meta: "Calentamiento · 5 min",
    setup: { en: "Two lines: one to shoot, one to rebound.", es: "Dos filas: una tira, otra rebotea." },
    steps: [
      { en: "Shooting line starts on the wing.", es: "La fila de tiro empieza en el ala." },
      { en: "Drive in and finish with a layup.", es: "Penetra y termina con bandeja." },
      { en: "Rebound line grabs it before it hits the floor.", es: "La fila de rebote la coge antes de que toque el suelo." },
      { en: "Pass out to the next shooter.", es: "Pasa al siguiente tirador." },
      { en: "Then go to the back of the other line.", es: "Luego, al final de la otra fila." },
    ],
    cues: [{ en: "Use the backboard!", es: "¡Usa el tablero!" }, { en: "High off the glass.", es: "Alto contra el tablero." }],
  },
  {
    id: "defensive-slides", en: "Defensive slides", es: "Desplazamientos defensivos", meta: "Físico · 4 min",
    setup: { en: "Players spread out, low in a defensive stance.", es: "Jugadores repartidos, abajo en posición defensiva." },
    steps: [
      { en: "Get low - wide stance, hands up.", es: "Abajo - postura ancha, manos arriba." },
      { en: "Slide on my hand: left, right.", es: "Deslizaos según mi mano: izquierda, derecha." },
      { en: "Don't cross your feet.", es: "No crucéis los pies." },
      { en: "Stay on the balls of your feet.", es: "Sobre la planta de los pies." },
      { en: "Thirty seconds - push through it.", es: "Treinta segundos - apretad." },
    ],
    cues: [{ en: "Lower!", es: "¡Más abajo!" }, { en: "Don't stand up!", es: "¡No os levantéis!" }],
  },
];

// ─── Icons ───────────────────────────────────────────────────────────────────

function Icon({ name, size = 22, stroke = 2 }: { name: string; size?: number; stroke?: number }) {
  const paths: Record<string, React.ReactNode> = {
    home: <><path d="M4 11.5 12 5l8 6.5M6 10v9h12v-9" /><path d="M9.5 19v-5h5v5"/></>,
    vocab: <><path d="M5 5.5A1.5 1.5 0 0 1 6.5 4H18v15H6.5A1.5 1.5 0 0 0 5 20.5z"/><path d="M5 20.5A1.5 1.5 0 0 1 6.5 19H18"/></>,
    phrases: <path d="M4 5.5h16v10H9l-4 3.5v-3.5H4z"/>,
    drills: <><rect x="6" y="3.5" width="12" height="17" rx="2"/><path d="M9 3.5h6v2.5H9z"/><path d="M9.5 11.5l2 2 3.5-4"/></>,
    practice: <><circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="3.5"/></>,
    speaker: <><path d="M4 9.5v5h3.5L13 19V5L7.5 9.5z"/><path d="M16 9c1.2 1 1.2 5 0 6M18.2 7c2.4 2 2.4 8 0 10"/></>,
    play: <path d="M7 4.5v15l13-7.5z"/>,
    pause: <><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></>,
    back: <path d="M15 5l-7 7 7 7"/>,
    chev: <path d="M9 5l7 7-7 7"/>,
    check: <path d="M5 12.5l4.5 4.5L19 7"/>,
    refresh: <><path d="M19 12a7 7 0 1 1-2-4.9"/><path d="M19 4v3.5h-3.5"/></>,
    whistle: <><circle cx="9" cy="14" r="4.5"/><path d="M12.8 11.5 21 8.5l-1 4-7 1.2M9 9.5V6h4"/></>,
  };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

// ─── Audio ───────────────────────────────────────────────────────────────────

// audioUrl map: concept text → URL (populated from DB)
const audioMap = new Map<string, string>();

function useSpeak() {
  const currentAudio = useRef<HTMLAudioElement | null>(null);

  return useCallback((text: string, opts: { onend?: () => void } = {}) => {
    // Stop any playing audio
    if (currentAudio.current) {
      currentAudio.current.pause();
      currentAudio.current = null;
    }

    const url = audioMap.get(text);
    if (url) {
      const audio = new Audio(url);
      currentAudio.current = audio;
      audio.onended = () => { currentAudio.current = null; opts.onend?.(); };
      audio.onerror = () => { currentAudio.current = null; opts.onend?.(); };
      audio.play().catch(() => opts.onend?.());
      return;
    }

    // Fallback: speechSynthesis (for drills steps that have no audio_url)
    if (typeof window === "undefined" || !window.speechSynthesis) { opts.onend?.(); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const vs = speechSynthesis.getVoices();
    const v = vs.find(v => /en[-_]US/i.test(v.lang) && /Samantha|Google US|Aaron|Allison/i.test(v.name))
      || vs.find(v => /en[-_]US/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null;
    if (v) u.voice = v;
    u.lang = "en-US"; u.rate = 0.9; u.pitch = 1;
    if (opts.onend) u.onend = opts.onend;
    speechSynthesis.speak(u);
  }, []);
}

function SpeakBtn({ text, speak, big }: { text: string; speak: (t: string, o?: { onend?: () => void }) => void; big?: boolean }) {
  const [on, setOn] = useState(false);
  const go = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOn(true);
    speak(text, { onend: () => setOn(false) });
  };
  return (
    <button className={"bb-speak" + (on ? " is-on" : "") + (big ? " big" : "")} onClick={go} aria-label="Escuchar">
      <Icon name="speaker" size={big ? 24 : 19} />
      {on && <span className="bb-wave"><i/><i/><i/></span>}
    </button>
  );
}

// ─── SM-2 ────────────────────────────────────────────────────────────────────

function calcNextReview(level: number): string {
  const days = ({ 0: 1, 1: 2, 2: 4, 3: 8, 4: 16 } as Record<number, number>)[Math.min(level, 4)] ?? 1;
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function applyAnswer(prog: Progress, correct: boolean): Progress {
  const now = new Date().toISOString();
  const nowPlus5 = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  const newLevel = correct ? Math.min(prog.level + 1, 4) : Math.max(prog.level - 1, 0);
  return {
    ...prog,
    level: newLevel,
    streak: correct ? prog.streak + 1 : 0,
    attempts: prog.attempts + 1,
    correct_count: prog.correct_count + (correct ? 1 : 0),
    next_review: correct ? calcNextReview(newLevel) : nowPlus5,
    last_seen: now,
  };
}

function shuffle<T>(a: T[]): T[] {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
}

// ─── Screens ─────────────────────────────────────────────────────────────────

function HomeScreen({ go, speak, terms, phrases }: {
  go: (tab: string) => void;
  speak: ReturnType<typeof useSpeak>;
  terms: Concept[];
  phrases: Concept[];
}) {
  const phraseOfDay = phrases[2] ?? phrases[0];
  const focusTerms = terms.slice(0, 3);
  return (
    <div className="bb-scroll">
      <header className="bb-top">
        <div className="bb-kicker" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Hoy en la pista</span>
          <span style={{ fontWeight: 500, letterSpacing: "0.02em", color: "#6C7382", textTransform: "none", fontSize: 11 }}>by Jorge Lorenzo Coach</span>
        </div>
        <h1 className="bb-h1">Buenos días,<br/>coach.</h1>
      </header>
      <div className="bb-pad">
        {phraseOfDay && (
          <div className="bb-card bb-feature">
            <div className="bb-feature-label">Frase del día</div>
            <div className="bb-feature-en">{phraseOfDay.en}</div>
            <div className="bb-feature-es">{phraseOfDay.es}</div>
            <div className="bb-feature-foot">
              <span className="bb-say">{phraseOfDay.say}</span>
              <SpeakBtn text={phraseOfDay.en} speak={speak} big />
            </div>
          </div>
        )}
        <button className="bb-cta" onClick={() => go("practice")}>
          <span><Icon name="practice" size={20}/> Repaso rápido</span>
          <span className="bb-cta-sub">5 tarjetas · 2 min</span>
        </button>
        <div className="bb-sec-head">
          <span className="t">Foco de hoy</span>
          <span>repite hasta que se quede</span>
        </div>
        <div className="bb-focus-list">
          {focusTerms.map((t) => (
            <div key={t.id} className="bb-row bb-card" role="button" onClick={() => speak(t.en)}>
              <div className="bb-row-main">
                <div className="bb-row-en">{t.en}</div>
                <div className="bb-row-es">{t.es}</div>
              </div>
              <SpeakBtn text={t.en} speak={speak} />
            </div>
          ))}
        </div>
        <div className="bb-quick">
          <button className="bb-quick-btn" onClick={() => go("drills")}>
            <Icon name="drills" size={22}/><span>Explicar un<br/>ejercicio</span>
          </button>
          <button className="bb-quick-btn" onClick={() => go("phrases")}>
            <Icon name="phrases" size={22}/><span>Frases de<br/>instrucción</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function VocabScreen({ speak, concepts }: { speak: ReturnType<typeof useSpeak>; concepts: Concept[] }) {
  const [openCat, setOpenCat] = useState<string | null>(null);

  const cats = useMemo(() => {
    const map = new Map<string, Concept[]>();
    concepts.filter(c => c.type === "term").forEach(c => {
      if (!map.has(c.category)) map.set(c.category, []);
      map.get(c.category)!.push(c);
    });
    return Array.from(map.entries()).map(([cat, terms]) => ({ cat, terms }));
  }, [concepts]);

  const active = cats.find(c => c.cat === openCat);

  if (active) {
    return (
      <div className="bb-scroll">
        <header className="bb-top with-back">
          <button className="bb-back" onClick={() => setOpenCat(null)}><Icon name="back" size={22}/></button>
          <div className="bb-kicker">{active.cat}</div>
          <h1 className="bb-h1 sm">{active.cat}</h1>
        </header>
        <div className="bb-pad">
          {active.terms.map(t => (
            <div key={t.id} className="bb-row bb-card term">
              <div className="bb-row-main">
                <div className="bb-row-en">{t.en}</div>
                <div className="bb-row-es">{t.es}</div>
                {t.say && <div className="bb-say">{t.say}</div>}
                {t.note && <div className="bb-note">{t.note}</div>}
              </div>
              <SpeakBtn text={t.en} speak={speak} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bb-scroll">
      <header className="bb-top">
        <div className="bb-kicker">Diccionario</div>
        <h1 className="bb-h1">Vocabulario</h1>
      </header>
      <div className="bb-pad">
        {cats.map(({ cat, terms }) => (
          <button key={cat} className="bb-row bb-card cat" onClick={() => setOpenCat(cat)}>
            <div className="bb-cat-glyph">{terms.length}</div>
            <div className="bb-row-main">
              <div className="bb-row-en">{cat}</div>
              <div className="bb-row-es">{terms.length} términos</div>
            </div>
            <Icon name="chev" size={20}/>
          </button>
        ))}
      </div>
    </div>
  );
}

function PhrasesScreen({ speak, concepts }: { speak: ReturnType<typeof useSpeak>; concepts: Concept[] }) {
  const groups = useMemo(() => {
    const map = new Map<string, Concept[]>();
    concepts.filter(c => c.type === "phrase").forEach(c => {
      if (!map.has(c.category)) map.set(c.category, []);
      map.get(c.category)!.push(c);
    });
    return Array.from(map.entries()).map(([cat, items]) => ({ cat, items }));
  }, [concepts]);

  return (
    <div className="bb-scroll">
      <header className="bb-top">
        <div className="bb-kicker">Para dirigir</div>
        <h1 className="bb-h1">Frases</h1>
      </header>
      <div className="bb-pad">
        {groups.map(({ cat, items }) => (
          <section key={cat} className="bb-group">
            <div className="bb-group-head">{cat}</div>
            <div className="bb-card bb-group-card">
              {items.map((p) => (
                <div key={p.id} className="bb-prow" role="button" onClick={() => speak(p.en)}>
                  <div className="bb-row-main">
                    <div className="bb-row-en sm">{p.en}</div>
                    <div className="bb-row-es">{p.es}</div>
                  </div>
                  <SpeakBtn text={p.en} speak={speak} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function DrillScript({ drill, speak, back }: { drill: typeof DRILLS[0]; speak: ReturnType<typeof useSpeak>; back: () => void }) {
  const [playing, setPlaying] = useState(false);
  const [idx, setIdx] = useState(-1);
  const seq = useMemo(() => [{ en: "Setup. " + drill.setup.en }, ...drill.steps], [drill]);

  const stop = useCallback(() => {
    if (typeof window !== "undefined") speechSynthesis?.cancel();
    setPlaying(false); setIdx(-1);
  }, []);

  const playAll = () => {
    if (playing) { stop(); return; }
    setPlaying(true);
    let i = 0;
    const next = () => {
      if (i >= seq.length) { setPlaying(false); setIdx(-1); return; }
      setIdx(i);
      speak(seq[i].en, { onend: () => { i++; setTimeout(next, 420); } });
    };
    next();
  };

  useEffect(() => () => { if (typeof window !== "undefined") speechSynthesis?.cancel(); }, []);

  return (
    <div className="bb-scroll">
      <header className="bb-top with-back">
        <button className="bb-back" onClick={() => { stop(); back(); }}><Icon name="back" size={22}/></button>
        <div className="bb-kicker">{drill.meta}</div>
        <h1 className="bb-h1 sm">{drill.en}</h1>
        <div className="bb-h1-sub">{drill.es}</div>
      </header>
      <div className="bb-pad">
        <button className={"bb-cta playall" + (playing ? " on" : "")} onClick={playAll}>
          <span><Icon name={playing ? "pause" : "play"} size={18}/> {playing ? "Parar" : "Leer todo en voz alta"}</span>
          <span className="bb-cta-sub">{seq.length} pasos</span>
        </button>
        <div className={"bb-step bb-card setup" + (idx === 0 ? " active" : "")}>
          <div className="bb-step-tag">Montaje</div>
          <div className="bb-row-en sm">{drill.setup.en}</div>
          <div className="bb-row-es">{drill.setup.es}</div>
          <div className="bb-step-speak"><SpeakBtn text={drill.setup.en} speak={speak} /></div>
        </div>
        {drill.steps.map((s, i) => (
          <div key={i} className={"bb-step bb-card" + (idx === i + 1 ? " active" : "")}>
            <div className="bb-step-n">{i + 1}</div>
            <div className="bb-step-body">
              <div className="bb-row-en sm">{s.en}</div>
              <div className="bb-row-es">{s.es}</div>
            </div>
            <div className="bb-step-speak"><SpeakBtn text={s.en} speak={speak} /></div>
          </div>
        ))}
        <div className="bb-cues">
          <div className="bb-cues-head"><Icon name="whistle" size={18}/> Para corregir en marcha</div>
          {drill.cues.map((c, i) => (
            <button key={i} className="bb-cue" onClick={() => speak(c.en)}>
              <span className="bb-cue-en">"{c.en}"</span>
              <span className="bb-cue-es">{c.es}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DrillsScreen({ speak, isMember }: { speak: ReturnType<typeof useSpeak>; isMember: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  const drill = DRILLS.find(d => d.id === open);

  if (!isMember) {
    return (
      <div className="bb-scroll">
        <header className="bb-top">
          <div className="bb-kicker">Guiones listos</div>
          <h1 className="bb-h1">Ejercicios</h1>
        </header>
        <div className="bb-locked">
          <div className="bb-locked-icon">🔒</div>
          <h3>Acceso para miembros</h3>
          <p>Los guiones de ejercicios completos en inglés son exclusivos de la comunidad.</p>
          <a href="https://www.skool.com/jorge-lorenzo-coach/plans" target="_blank" rel="noopener noreferrer">Unirse a la comunidad</a>
        </div>
      </div>
    );
  }

  if (drill) return <DrillScript drill={drill} speak={speak} back={() => setOpen(null)} />;

  return (
    <div className="bb-scroll">
      <header className="bb-top">
        <div className="bb-kicker">Guiones listos</div>
        <h1 className="bb-h1">Ejercicios</h1>
      </header>
      <div className="bb-pad">
        <p className="bb-lead">Explica un ejercicio entero en inglés, paso a paso. Pulsa <strong>Leer todo</strong> y sígueme.</p>
        {DRILLS.map(d => (
          <button key={d.id} className="bb-row bb-card drill" onClick={() => setOpen(d.id)}>
            <div className="bb-drill-icon"><Icon name="drills" size={22}/></div>
            <div className="bb-row-main">
              <div className="bb-row-en">{d.en}</div>
              <div className="bb-row-es">{d.es}</div>
              <div className="bb-drill-meta">{d.meta}</div>
            </div>
            <Icon name="chev" size={20}/>
          </button>
        ))}
      </div>
    </div>
  );
}

function FlashMode({ speak, terms, progressMap, onProgress }: {
  speak: ReturnType<typeof useSpeak>;
  terms: Concept[];
  progressMap: Map<string, Progress>;
  onProgress: (id: string, p: Progress) => void;
}) {
  const deck = useMemo(() => shuffle(terms).slice(0, 20), [terms]);
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const [known, setKnown] = useState(0);

  const card = deck[i % deck.length];
  const progress = progressMap.get(card?.id) ?? { concept_id: card?.id ?? "", level: 0, streak: 0, attempts: 0, correct_count: 0, next_review: new Date().toISOString(), last_seen: new Date().toISOString() };

  const next = async (correct: boolean) => {
    const updated = applyAnswer(progress, correct);
    onProgress(card.id, updated);
    if (correct) setKnown(k => k + 1);
    setFlip(false);
    setI(v => v + 1);
    try { await saveEcProgress(card.id, updated); } catch {}
  };

  if (!card) return null;

  return (
    <div className="bb-practice">
      <div className="bb-prog"><span style={{ width: `${((i % deck.length) / deck.length) * 100}%` }}/></div>
      <div className="bb-prog-label">{(i % deck.length) + 1} / {deck.length} · {known} acertadas</div>
      <div className={"bb-flash" + (flip ? " flipped" : "")} role="button" onClick={() => { if (!flip) { setFlip(true); speak(card.en); } }}>
        <div className="bb-flash-inner">
          <div className="bb-flash-face front">
            <div className="bb-flash-tag">Dilo en inglés</div>
            <div className="bb-flash-es">{card.es}</div>
            <div className="bb-flash-hint">Toca para ver la respuesta</div>
          </div>
          <div className="bb-flash-face back">
            <div className="bb-flash-tag">{card.category}</div>
            <div className="bb-flash-en">{card.en}</div>
            {card.say && <div className="bb-say big">{card.say}</div>}
            <div style={{ fontSize: "12px", color: "#6C7382", marginTop: "8px" }}>Nivel {progress.level}/4 · {progress.streak} racha</div>
            <div className="bb-flash-speak"><SpeakBtn text={card.en} speak={speak} big/></div>
          </div>
        </div>
      </div>
      <div className={"bb-rate" + (flip ? " show" : "")}>
        <button className="bb-rate-btn again" onClick={() => next(false)}><Icon name="refresh" size={18}/> Otra vez</button>
        <button className="bb-rate-btn got" onClick={() => next(true)}><Icon name="check" size={18}/> La sé</button>
      </div>
    </div>
  );
}

function ListenMode({ speak, terms, progressMap, onProgress }: {
  speak: ReturnType<typeof useSpeak>;
  terms: Concept[];
  progressMap: Map<string, Progress>;
  onProgress: (id: string, p: Progress) => void;
}) {
  const deck = useMemo(() => shuffle(terms).slice(0, 20), [terms]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<Concept | null>(null);

  const correct = deck[i % deck.length];
  const progress = progressMap.get(correct?.id) ?? { concept_id: correct?.id ?? "", level: 0, streak: 0, attempts: 0, correct_count: 0, next_review: new Date().toISOString(), last_seen: new Date().toISOString() };

  const options = useMemo(() => {
    if (!correct) return [];
    const others = shuffle(deck.filter(d => d.es !== correct.es)).slice(0, 2);
    return shuffle([correct, ...others]);
  }, [i, deck, correct]);

  useEffect(() => {
    if (!correct) return;
    const t = setTimeout(() => speak(correct.en), 280);
    return () => clearTimeout(t);
  }, [i, correct?.en]);

  const pick = async (o: Concept) => {
    if (picked || !correct) return;
    const got = o.es === correct.es;
    const updated = applyAnswer(progress, got);
    onProgress(correct.id, updated);
    setPicked(o);
    try { await saveEcProgress(correct.id, updated); } catch {}
  };

  const next = () => { setPicked(null); setI(v => v + 1); };

  if (!correct) return null;

  return (
    <div className="bb-practice">
      <div className="bb-listen-q">
        <div className="bb-flash-tag">¿Qué he dicho? (Nivel {progress.level}/4)</div>
        <button className="bb-listen-play" onClick={() => speak(correct.en)}>
          <Icon name="speaker" size={30}/> <span>Escuchar de nuevo</span>
        </button>
      </div>
      <div className="bb-opts">
        {options.map((o) => {
          let cls = "bb-opt";
          if (picked) {
            if (o.es === correct.es) cls += " right";
            else if (o.es === picked.es) cls += " wrong";
            else cls += " dim";
          }
          return <button key={o.id} className={cls} onClick={() => pick(o)}>{o.es}</button>;
        })}
      </div>
      {picked && (
        <div className="bb-listen-foot">
          <div className="bb-listen-ans">{correct.en} {correct.say && <span className="bb-say">{correct.say}</span>}</div>
          <button className="bb-rate-btn got" onClick={next}>Siguiente <Icon name="chev" size={16}/></button>
        </div>
      )}
    </div>
  );
}

function PracticeScreen({ speak, terms, progressMap, onProgress, isMember }: {
  speak: ReturnType<typeof useSpeak>;
  terms: Concept[];
  progressMap: Map<string, Progress>;
  onProgress: (id: string, p: Progress) => void;
  isMember: boolean;
}) {
  const [mode, setMode] = useState<"flash" | "listen">("flash");

  if (!isMember) {
    return (
      <div className="bb-scroll">
        <header className="bb-top">
          <div className="bb-kicker">Que se quede</div>
          <h1 className="bb-h1">Práctica</h1>
        </header>
        <div className="bb-locked">
          <div className="bb-locked-icon">🔒</div>
          <h3>Acceso para miembros</h3>
          <p>Las tarjetas de práctica con repetición espaciada son exclusivas de la comunidad.</p>
          <a href="https://www.skool.com/jorge-lorenzo-coach/plans" target="_blank" rel="noopener noreferrer">Unirse a la comunidad</a>
        </div>
      </div>
    );
  }

  return (
    <div className="bb-scroll">
      <header className="bb-top">
        <div className="bb-kicker">Que se quede</div>
        <h1 className="bb-h1">Práctica</h1>
      </header>
      <div className="bb-pad">
        <div className="bb-seg">
          <button className={mode === "flash" ? "on" : ""} onClick={() => setMode("flash")}>Tarjetas</button>
          <button className={mode === "listen" ? "on" : ""} onClick={() => setMode("listen")}>Escucha</button>
        </div>
        {mode === "flash"
          ? <FlashMode key="f" speak={speak} terms={terms} progressMap={progressMap} onProgress={onProgress} />
          : <ListenMode key="l" speak={speak} terms={terms} progressMap={progressMap} onProgress={onProgress} />}
      </div>
    </div>
  );
}

// ─── Main app ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: "home", label: "Hoy", icon: "home" },
  { id: "vocab", label: "Vocab", icon: "vocab" },
  { id: "phrases", label: "Frases", icon: "phrases" },
  { id: "drills", label: "Drills", icon: "drills" },
  { id: "practice", label: "Práctica", icon: "practice" },
];

export default function EnglishClient({ userId, userAccessLevel, concepts, initialProgress }: Props) {
  const [tab, setTab] = useState("home");
  const [progressMap, setProgressMap] = useState<Map<string, Progress>>(() => {
    const m = new Map<string, Progress>();
    initialProgress.forEach(p => m.set(p.concept_id, p));
    return m;
  });

  // Populate audio map from concepts
  useEffect(() => {
    concepts.forEach(c => { if (c.audio_url) audioMap.set(c.en, c.audio_url); });
  }, [concepts]);

  const speak = useSpeak();
  const isMember = userAccessLevel === "member";

  const terms = useMemo(() => concepts.filter(c => c.type === "term"), [concepts]);
  const phrases = useMemo(() => concepts.filter(c => c.type === "phrase"), [concepts]);

  const handleProgress = useCallback((id: string, p: Progress) => {
    setProgressMap(m => new Map(m).set(id, p));
  }, []);

  const screen: Record<string, React.ReactNode> = {
    home: <HomeScreen go={setTab} speak={speak} terms={terms} phrases={phrases} />,
    vocab: <VocabScreen speak={speak} concepts={concepts} />,
    phrases: <PhrasesScreen speak={speak} concepts={concepts} />,
    drills: <DrillsScreen speak={speak} isMember={isMember} />,
    practice: <PracticeScreen speak={speak} terms={terms} progressMap={progressMap} onProgress={handleProgress} isMember={isMember} />,
  };

  return (
    <div className="bb-wrap">
      <div className="bb-app">
        <div className="bb-app-body">{screen[tab]}</div>
        <div className="bb-tabs" role="tablist">
          {TABS.map(t => (
            <button key={t.id} className={"bb-tab" + (tab === t.id ? " on" : "")} onClick={() => setTab(t.id)}>
              <Icon name={t.icon} size={23} stroke={tab === t.id ? 2.4 : 1.9} />
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
