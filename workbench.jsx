// Workbench — block-based linear composer
const { useState: useWS, useRef: useWR, useEffect: useWE, useCallback: useWC } = React;

const BLOCK_TYPES = [
  { type: 'text',     label: 'Paragraph',    sub: 'prose' },
  { type: 'heading',  label: 'Section head', sub: 'chapter' },
  { type: 'quote',    label: 'Quote',        sub: 'pull' },
  { type: 'hand',     label: 'Handwritten',  sub: 'fragment' },
  { type: 'image',    label: 'Image',        sub: 'photo' },
  { type: 'gallery',  label: 'Gallery',      sub: 'photos' },
  { type: 'youtube',  label: 'YouTube',      sub: 'video' },
  { type: 'audio',    label: 'Voice note',   sub: 'audio' },
  { type: 'music',    label: 'Music',        sub: 'spotify' },
];

const uid = () => Math.random().toString(36).slice(2, 9);

// Sample finished project
const SAMPLE = {
  title: "The dog who came back.",
  subtitle: "A story about a stray, a dead-end road, and the small grace of a few good days at the end.",
  tags: ['home', 'dogs', 'kindness', 'grief'],
  cover: true,
  blocks: [
    { id: uid(), type: 'text', content: "It was Christmas. I was home for the holidays, and we'd worked late at the workshop — the one opposite our gate, where we sometimes set up shop when deadlines get loud." },
    { id: uid(), type: 'text', content: "I'd stepped outside to walk and talk with one of our staff, the way you do when the work is done and the night is quiet. That's when the dog came sprinting down our road." },
    { id: uid(), type: 'text', content: "He looked like a German Shepherd. He ran past us without slowing, without a glance — straight into the forest at the dead end of our street. Just <em>vanished</em>." },
    { id: uid(), type: 'quote', content: "His own disowned him, madam. Third time I've seen him this week.", attribution: '— one of our guys, as matter-of-fact as the weather' },
    { id: uid(), type: 'text', content: "I told our dogs' caretaker to leave some food out, in case he came back. At the very least, he'd be fed." },
    { id: uid(), type: 'hand', content: "and then i forgot about him.\nthe way you forget most things\nthat don't ask you to remember." },
    { id: uid(), type: 'heading', content: "Two months ago" },
    { id: uid(), type: 'text', content: "I left the house for work. Three hundred metres down the road, I saw him again — the same dog, thinner now, trying to jump across the kanal and failing. I pulled over." },
    { id: uid(), type: 'image', variant: 'moon-photo', caption: "The morning I stopped on the road. He was trying to cross the kanal." },
    { id: uid(), type: 'text', content: "I took a photo, sent it to our caretaker, asked him to bring food and get the dog to our garden — the small one next to the workshop. Then I called our vet." },
    { id: uid(), type: 'heading', content: "What the vet said" },
    { id: uid(), type: 'text', content: "He was <em>over eighteen years old</em>. That's what the vet told us. He'd had an owner for most of those years — everything about him said so — and somewhere along the line, someone had decided he wasn't theirs anymore." },
    { id: uid(), type: 'text', content: "I still can't work out the arithmetic of that. Eighteen years of showing up, and then — what? What do you tell yourself the morning you walk a dog that old out of your life?" },
    { id: uid(), type: 'quote', content: "He has a lot of fleas. The infections are from months of scavenging — for food, for warmth. He is very weak.", attribution: '— the vet, gentle' },
    { id: uid(), type: 'text', content: "He was fragile. He flinched at sudden movements the way you flinch when you've learned the world mostly happens <em>to</em> you. But when my mother knelt down and tried to pet him, he let her. He just closed his eyes and let her." },
    { id: uid(), type: 'text', content: "His eyes showed his age. His whole body did. But there was something else in there too — something that hadn't forgotten how to be a good dog." },
    { id: uid(), type: 'heading', content: "The afternoon with the football" },
    { id: uid(), type: 'text', content: "Our other dogs were playing football with the caretakers in the garden that afternoon. Running, tumbling, barking, being ridiculous in the way happy dogs are." },
    { id: uid(), type: 'text', content: "He watched them from where he was lying. And then — I'll never forget this — <em>he stood up</em>." },
    { id: uid(), type: 'hand', content: "he stood up.\nhe knew exactly what was going on.\nhe wanted to play." },
    { id: uid(), type: 'text', content: "He was too weak. His legs wouldn't carry him more than a few steps. But for a moment I watched an old, terminal dog remember what it felt like to be young, and it broke something in me that I don't think has fully fixed itself yet." },
    { id: uid(), type: 'heading', content: "The blood report" },
    { id: uid(), type: 'text', content: "The vet came back later with results. Terminal. The infections had spread further than the food and warmth could reach. A week, maybe — he said it the way vets say these things, carefully, so you have time to catch up to the words." },
    { id: uid(), type: 'text', content: "I felt like shit. I still feel it sometimes, in that small place where the regret you didn't earn lives anyway. <em>If I'd stopped the first time. If I'd looked harder. If I'd known.</em>" },
    { id: uid(), type: 'text', content: "But then I think about the garden. The bowl of food. My mother's hand on his head. The football he almost got up to chase. The fact that he died somewhere soft, and not in a kanal on a road that doesn't go anywhere." },
    { id: uid(), type: 'quote', content: "He was the most decent dog I have ever met.", attribution: '— a thing I said out loud, to no one, the night he was gone' },
    { id: uid(), type: 'hand', content: "some lives ask for very little\nand deserve so much more\nthan we manage to give them in time." },
    { id: uid(), type: 'text', content: "I don't know who he belonged to, before. I hope, for their sake, that it was a long time ago — that whatever decision they made, they've had to live with it since. And I hope the last thing he remembered was the garden, and the football, and the soft." },
    { id: uid(), type: 'text', content: "Goodnight, old boy. Wherever you are. The moon was listening." },
  ]
};

function Block({ block, isPublic, onChange, onDelete, dragProps, isDragOver }) {
  const ref = useWR(null);
  const saveText = (key = 'content') => {
    if (!ref.current) return;
    onChange({ ...block, [key]: ref.current.innerHTML });
  };

  const common = {
    contentEditable: !isPublic,
    suppressContentEditableWarning: true,
    onBlur: () => saveText(),
    dangerouslySetInnerHTML: { __html: block.content || '' },
    ref,
  };

  const renderInner = () => {
    switch (block.type) {
      case 'text':
        return <div className="b-text" {...common} />;
      case 'heading':
        return <div className="b-heading" {...common} />;
      case 'quote':
        return (
          <div className="b-quote">
            <div contentEditable={!isPublic} suppressContentEditableWarning ref={ref}
                 onBlur={() => saveText()}
                 dangerouslySetInnerHTML={{ __html: block.content || '' }} />
            <span className="attribution" contentEditable={!isPublic} suppressContentEditableWarning
                  onBlur={(e) => onChange({ ...block, attribution: e.currentTarget.innerHTML })}
                  dangerouslySetInnerHTML={{ __html: block.attribution || '' }} />
          </div>
        );
      case 'hand':
        return (
          <div className="b-hand" contentEditable={!isPublic} suppressContentEditableWarning
               onBlur={(e) => onChange({ ...block, content: e.currentTarget.innerText })}>
            {block.content}
          </div>
        );
      case 'image':
        return (
          <div className={`b-image ${block.variant === 'moon-photo' ? 'moon-photo' : ''}`}>
            {block.variant !== 'moon-photo' && (
              <>
                <div className="placeholder-stripes" />
                <div className="plabel">click to add photo</div>
              </>
            )}
            <div className="caption" contentEditable={!isPublic} suppressContentEditableWarning
                 onBlur={(e) => onChange({ ...block, caption: e.currentTarget.innerText })}>
              {block.caption || ''}
            </div>
          </div>
        );
      case 'gallery':
        return (
          <div className="b-gallery">
            <div className="g-tile tile-1" />
            <div className="g-tile tile-2" />
            <div className="g-tile tile-3" />
          </div>
        );
      case 'youtube':
        return (
          <div className="b-yt">
            <div className="yt-moon" />
            <div className="play" />
            <div className="yt-meta">
              <div className="yt-title">{block.title || 'untitled'}</div>
              <div className="yt-host">{block.channel || 'youtube'}</div>
            </div>
          </div>
        );
      case 'audio':
        return (
          <div className="b-audio">
            <button className="play-a" />
            <span className="a-title">{block.title || 'voice note'}</span>
            <div className="wave">
              {Array.from({ length: 48 }).map((_, i) => (
                <span key={i} style={{ height: (20 + Math.sin(i * 0.8) * 10 + Math.random() * 8) + '%' }} />
              ))}
            </div>
            <span className="a-meta">{block.duration || '0:00'}</span>
          </div>
        );
      case 'music':
        return (
          <div className="b-music">
            <div className="cover-sq" />
            <div className="m-info">
              <div className="m-title" contentEditable={!isPublic} suppressContentEditableWarning
                   onBlur={(e) => onChange({ ...block, song: e.currentTarget.innerText })}>
                {block.song}
              </div>
              <div className="m-artist" contentEditable={!isPublic} suppressContentEditableWarning
                   onBlur={(e) => onChange({ ...block, artist: e.currentTarget.innerText })}>
                {block.artist}
              </div>
            </div>
            <div className="m-src">{block.source || 'spotify'}</div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className={`block ${isDragOver ? 'drag-over' : ''}`} {...dragProps}>
      {!isPublic && <div className="handle" draggable="true">⋮⋮</div>}
      {!isPublic && <button className="del" onClick={() => onDelete(block.id)} title="Remove block">×</button>}
      {renderInner()}
    </div>
  );
}

function AddBlock({ onAdd }) {
  const [open, setOpen] = useWS(false);
  const ref = useWR(null);

  useWE(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    setTimeout(() => document.addEventListener('click', h), 0);
    return () => document.removeEventListener('click', h);
  }, [open]);

  return (
    <div className="add-block" ref={ref}>
      <div className="line" />
      <button className="add-btn" onClick={() => setOpen(o => !o)}>+</button>
      {open && (
        <div className="block-picker">
          {BLOCK_TYPES.map(t => (
            <button key={t.type} onClick={() => { onAdd(t.type); setOpen(false); }}>
              <span className="pk-label">{t.label}</span>
              <span className="pk-sub">{t.sub}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FormatBar() {
  const [state, setState] = useWS({ visible: false, x: 0, y: 0 });
  useWE(() => {
    const onSel = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        setState(s => ({ ...s, visible: false }));
        return;
      }
      const r = sel.getRangeAt(0);
      // Only show inside editable text blocks
      let node = r.commonAncestorContainer;
      if (node.nodeType === 3) node = node.parentElement;
      const editable = node?.closest?.('[contenteditable="true"]');
      if (!editable) { setState(s => ({ ...s, visible: false })); return; }
      const rect = r.getBoundingClientRect();
      setState({
        visible: true,
        x: rect.left + rect.width / 2 - 76 + window.scrollX,
        y: rect.top - 46 + window.scrollY,
      });
    };
    document.addEventListener('selectionchange', onSel);
    return () => document.removeEventListener('selectionchange', onSel);
  }, []);

  const wrap = (tag, className) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const r = sel.getRangeAt(0);
    const el = document.createElement(tag);
    if (className) el.className = className;
    try { el.appendChild(r.extractContents()); r.insertNode(el); } catch (e) {}
    sel.removeAllRanges();
  };

  return (
    <div className={`fmt-bar ${state.visible ? 'visible' : ''}`}
         style={{ left: state.x, top: state.y }}
         onMouseDown={(e) => e.preventDefault()}>
      <button className="italic" onMouseDown={(e) => { e.preventDefault(); wrap('em'); }}>I</button>
      <button className="sc" onMouseDown={(e) => { e.preventDefault(); wrap('span', 'smallcaps'); }}>Sc</button>
      <button className="qu" onMouseDown={(e) => { e.preventDefault(); wrap('em'); }}>"</button>
    </div>
  );
}

function Workbench() {
  const [title, setTitle] = useWS(SAMPLE.title);
  const [subtitle, setSubtitle] = useWS(SAMPLE.subtitle);
  const [tags, setTags] = useWS(SAMPLE.tags);
  const [blocks, setBlocks] = useWS(SAMPLE.blocks);
  const [isPublic, setIsPublic] = useWS(false);
  const [isPublished, setIsPublished] = useWS(false);
  const [savedAt, setSavedAt] = useWS("the moon remembers");
  const dragId = useWR(null);
  const [dragOverId, setDragOverId] = useWS(null);
  const [newTag, setNewTag] = useWS("");

  // Autosave heartbeat
  useWE(() => {
    const i = setInterval(() => {
      const phrases = ["the moon remembers", "saved under moonlight", "tucked away safely", "the night is holding it"];
      setSavedAt(phrases[Math.floor(Math.random() * phrases.length)]);
    }, 8000);
    return () => clearInterval(i);
  }, []);

  // Word count + read time
  const { words, readMin } = (() => {
    const textTypes = ['text', 'heading', 'quote', 'hand'];
    const text = blocks.filter(b => textTypes.includes(b.type))
      .map(b => {
        const raw = (b.content || '') + ' ' + (b.attribution || '');
        return raw.replace(/<[^>]+>/g, ' ');
      }).join(' ') + ' ' + title + ' ' + subtitle;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return { words, readMin: Math.max(1, Math.round(words / 220)) };
  })();

  const addBlock = (afterId, type) => {
    const nb = { id: uid(), type, content: '' };
    if (type === 'youtube') Object.assign(nb, { title: 'untitled video', channel: 'youtube · paste a url' });
    if (type === 'audio') Object.assign(nb, { title: 'voice note', duration: '0:00' });
    if (type === 'music') Object.assign(nb, { song: 'song title', artist: 'artist', source: 'spotify' });
    if (type === 'quote') Object.assign(nb, { attribution: '— ' });
    setBlocks(bs => {
      if (afterId == null) return [...bs, nb];
      const i = bs.findIndex(b => b.id === afterId);
      return [...bs.slice(0, i + 1), nb, ...bs.slice(i + 1)];
    });
  };

  const updateBlock = (nb) => setBlocks(bs => bs.map(b => b.id === nb.id ? nb : b));
  const deleteBlock = (id) => setBlocks(bs => bs.filter(b => b.id !== id));

  const dragProps = (block) => ({
    onDragStart: (e) => { dragId.current = block.id; e.currentTarget.classList.add('dragging'); },
    onDragEnd: (e) => { dragId.current = null; e.currentTarget.classList.remove('dragging'); setDragOverId(null); },
    onDragOver: (e) => { e.preventDefault(); setDragOverId(block.id); },
    onDrop: (e) => {
      e.preventDefault();
      const from = dragId.current; const to = block.id;
      if (!from || from === to) return;
      setBlocks(bs => {
        const fi = bs.findIndex(b => b.id === from);
        const ti = bs.findIndex(b => b.id === to);
        const arr = [...bs];
        const [m] = arr.splice(fi, 1);
        arr.splice(ti, 0, m);
        return arr;
      });
      setDragOverId(null);
    },
    draggable: !isPublic,
  });

  const addTag = () => {
    const t = newTag.trim().toLowerCase();
    if (!t || tags.includes(t)) return;
    setTags([...tags, t]);
    setNewTag("");
  };

  return (
    <>
      <div className="wb-chrome">
        <div className="left">
          <div className="crumb">
            <span className="brand-mini">the moon was listening</span>
            <span className="sep">/</span>
            <span>Workbench</span>
            <span className="sep">/</span>
            <span style={{ color: 'var(--ink)' }}>{isPublished ? 'published' : 'draft'}</span>
          </div>
          <div className="status">
            <span className="dot-live" />
            <span style={{ fontStyle: 'italic', textTransform: 'none', letterSpacing: 0, fontFamily: 'var(--serif)', fontSize: 14 }}>
              {savedAt}
            </span>
          </div>
        </div>
        <div className="right">
          <div className="mode-toggle">
            <button className={!isPublic ? 'active' : ''} onClick={() => setIsPublic(false)}>Edit</button>
            <button className={isPublic ? 'active' : ''} onClick={() => setIsPublic(true)}>Preview</button>
          </div>
          <button className={`wb-btn ${isPublished ? '' : 'primary'}`}
                  onClick={() => setIsPublished(p => !p)}>
            {isPublished ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Reader nav (appears in preview mode) */}
      <nav className="reader-nav">
        <a href="index.html" className="brand-mini">the moon was listening</a>
        <div style={{ display: 'flex', gap: 28 }}>
          <a href="index.html">Home</a>
          <a href="index.html#letters">Letters</a>
          <a href="#" style={{ color: 'var(--ink)' }}>Workbench</a>
          <a href="#">Journal</a>
          <a href="#">Say hello</a>
        </div>
      </nav>

      <div className="wb-stage">
        <div className="cover">
          <div className="cover-moon" />
          <div className="cover-label">Cover · moon photograph</div>
          <button className="cover-replace">Replace cover</button>
        </div>

        <div className="title-area">
          <div className="title-input" contentEditable={!isPublic} suppressContentEditableWarning
               onBlur={(e) => setTitle(e.currentTarget.innerText)}
               data-placeholder="An untitled piece">
            {title}
          </div>
          <div className="subtitle-input" contentEditable={!isPublic} suppressContentEditableWarning
               onBlur={(e) => setSubtitle(e.currentTarget.innerText)}>
            {subtitle}
          </div>
        </div>

        <div className="meta-row">
          <div className="tags-wrap">
            {tags.map(t => (
              <span key={t} className="tag-chip">
                {t}
                {!isPublic && <span className="x" onClick={() => setTags(tags.filter(x => x !== t))}>×</span>}
              </span>
            ))}
            {!isPublic && (
              <span className="tag-chip hide-public">
                <input
                  placeholder="+ tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') addTag(); }}
                  onBlur={addTag}
                />
              </span>
            )}
          </div>
          <div className="spacer" />
          <div className="metric"><b>{words}</b> words</div>
          <div className="metric"><b>{readMin}</b> min read</div>
          <div className="metric hide-public"><b>{blocks.length}</b> blocks</div>
        </div>

        {!isPublic && <AddBlock onAdd={(t) => addBlock(null, t)} />}

        {blocks.map((b) => (
          <React.Fragment key={b.id}>
            <Block
              block={b}
              isPublic={isPublic}
              onChange={updateBlock}
              onDelete={deleteBlock}
              dragProps={dragProps(b)}
              isDragOver={dragOverId === b.id}
            />
            {!isPublic && <AddBlock onAdd={(t) => addBlock(b.id, t)} />}
          </React.Fragment>
        ))}

        {isPublic && (
          <div className="reader-footer">
            <div className="author-mini">— Pooja</div>
            <div>
              written at the workbench, under a full moon<br />
              <span style={{ fontSize: 14, color: 'var(--faint)', fontStyle: 'normal', fontFamily: 'var(--sans)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                April 2026 · home
              </span>
            </div>
          </div>
        )}
      </div>

      <FormatBar />
    </>
  );
}

window.Workbench = Workbench;
