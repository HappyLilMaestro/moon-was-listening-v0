// Letters to the Moon — constellation gallery + modal reader
const { useState, useEffect, useRef, useMemo } = React;

const SAMPLE_LETTERS = [
  { id: 1, x: 14, y: 30, date: "April 19, 2026", body: "I didn't tell anyone I got the job. I wanted one quiet night of knowing it was real, just me and you.", sig: "— someone under the same moon", hint: "on a quiet win" },
  { id: 2, x: 26, y: 62, date: "March 2, 2026", body: "Today she laughed at something I said, and I thought — maybe this is what it feels like when things are okay.", sig: "— Arjun", hint: "on small joys" },
  { id: 3, x: 40, y: 22, date: "February 14, 2026", body: "I loved him the way mornings love the first bird. Soft. Without asking for anything back.", sig: "— anonymous", hint: "on loving quietly" },
  { id: 4, x: 52, y: 50, date: "April 3, 2026", body: "You kept me company through the worst year. I don't know how to thank the sky, but thank you.", sig: "— M.", hint: "on being held by the night" },
  { id: 5, x: 64, y: 18, date: "January 11, 2026", body: "I'm moving across oceans next week. Keep watching. I'll find you from the other side.", sig: "— Priya", hint: "on leaving home" },
  { id: 6, x: 72, y: 72, date: "March 27, 2026", body: "She's gone three years now. I still tell you everything I would've told her. I think you pass it along.", sig: "— someone under the same moon", hint: "on grief" },
  { id: 7, x: 84, y: 38, date: "April 8, 2026", body: "I'm not ready. But I'm going anyway. Wish me a little of your light.", sig: "— R.", hint: "before something hard" },
  { id: 8, x: 35, y: 82, date: "December 19, 2025", body: "I forgive her. Finally. Tonight, under you, it stopped being heavy.", sig: "— anonymous", hint: "on letting go" },
  { id: 9, x: 58, y: 88, date: "April 11, 2026", body: "My daughter is four today. She asked if the moon is my friend. I said yes. I hope she always believes me.", sig: "— Nadia", hint: "on motherhood" },
  { id: 10, x: 90, y: 60, date: "February 28, 2026", body: "I said yes. Nobody knows yet. You do.", sig: "— J.", hint: "on a secret yes" },
  { id: 11, x: 20, y: 44, date: "April 15, 2026", body: "The nights are long and I'm tired, but you're always there. That counts for something.", sig: "— someone under the same moon", hint: "on hanging on" },
  { id: 12, x: 46, y: 72, date: "March 14, 2026", body: "I wrote a book. Nobody will read it but you. That's enough tonight.", sig: "— Leo", hint: "on finishing things" },
];

// Connect pairs for constellation lines
const CONNECTIONS = [
  [0, 2], [2, 4], [4, 6], [1, 3], [3, 7], [7, 8], [5, 9], [10, 1], [11, 3], [0, 10]
];

function ConstellationGallery() {
  const [open, setOpen] = useState(null);
  const [layout, setLayout] = useState('constellation');
  const wrapRef = useRef(null);
  const [dims, setDims] = useState({ w: 1, h: 1 });

  useEffect(() => {
    const ro = new ResizeObserver(() => {
      if (wrapRef.current) {
        const r = wrapRef.current.getBoundingClientRect();
        setDims({ w: r.width, h: r.height });
      }
    });
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const innerStars = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 80; i++) {
      arr.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: Math.random() * 1.5 + 0.5,
        d: Math.random() * 4 + 2,
        delay: Math.random() * 4,
        op: Math.random() * 0.5 + 0.3,
      });
    }
    return arr;
  }, []);

  return (
    <>
      <div className="constellation-wrap" ref={wrapRef}>
        <div className="inner-stars">
          {innerStars.map((s, i) => (
            <div
              key={i}
              className="star"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.s}px`,
                height: `${s.s}px`,
                animationDuration: `${s.d}s`,
                animationDelay: `${s.delay}s`,
                '--star-op': s.op,
              }}
            />
          ))}
        </div>

        <svg className="conn" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {CONNECTIONS.map(([a, b], i) => {
            const A = SAMPLE_LETTERS[a], B = SAMPLE_LETTERS[b];
            return (
              <line
                key={i}
                x1={`${A.x}%`} y1={`${A.y}%`}
                x2={`${B.x}%`} y2={`${B.y}%`}
                stroke="rgba(212, 217, 232, 0.1)"
                strokeWidth="1"
                strokeDasharray="2 4"
              />
            );
          })}
        </svg>

        {SAMPLE_LETTERS.map((L) => (
          <div
            key={L.id}
            className="note-dot"
            style={{ left: `${L.x}%`, top: `${L.y}%` }}
            onClick={() => setOpen(L)}
          >
            <div className="halo" style={{ animationDelay: `${L.id * 0.3}s` }} />
            <div className="glow" />
            <div className="tooltip">{L.hint}</div>
          </div>
        ))}

        {/* signature large constellation moon, off to the corner */}
        <div style={{
          position: 'absolute',
          right: '-40px',
          bottom: '-60px',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, rgba(244, 239, 230, 0.18) 0%, rgba(244, 239, 230, 0.06) 40%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      </div>

      <div className="constellation-footer">
        <span>{SAMPLE_LETTERS.length} whispers · click a light to read</span>
        <span style={{ fontFamily: 'var(--hand)', fontSize: 18, textTransform: 'none', letterSpacing: 0, color: 'var(--silver-dim)' }}>
          · the moon is listening ·
        </span>
      </div>

      <div className={`letter-modal ${open ? 'open' : ''}`} onClick={() => setOpen(null)}>
        <div className="letter-card" onClick={e => e.stopPropagation()}>
          <button className="close" onClick={() => setOpen(null)}>×</button>
          <div className="mini-moon" />
          <div className="date">{open?.date}</div>
          <p className="body">{open?.body}</p>
          <div className="signature">{open?.sig}</div>
        </div>
      </div>
    </>
  );
}

window.ConstellationGallery = ConstellationGallery;
