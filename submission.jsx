// Multi-step submission flow for Letters to the Moon
const { useState: useS2 } = React;

function SubmissionFlow() {
  const [step, setStep] = useS2(0);
  const [text, setText] = useS2("");
  const [hasPhoto, setHasPhoto] = useS2(false);
  const [photoName, setPhotoName] = useS2("");
  const [signMode, setSignMode] = useS2("anon");
  const [name, setName] = useS2("");
  const [sent, setSent] = useS2(false);

  const maxLen = 500;
  const canProceed = [
    text.trim().length >= 10,
    true, // photo optional
    signMode === 'anon' || (signMode === 'name' && name.trim().length > 0),
    true,
  ][step];

  const reset = () => {
    setStep(0); setText(""); setHasPhoto(false); setPhotoName("");
    setSignMode("anon"); setName(""); setSent(false);
  };

  if (sent) {
    return (
      <div className="paper">
        <div className="sent-state">
          <div className="big-moon" />
          <h3>Your whisper is on its way.</h3>
          <p>It'll join the constellation above once it's been gently reviewed. Thank you for trusting the night with it.</p>
          <button className="write-another" onClick={reset}>write another ↗</button>
        </div>
      </div>
    );
  }

  return (
    <div className="paper">
      <div className="step-head">
        <span className="step-n">step {step + 1} of 4</span>
        <div className="dots">
          {[0,1,2,3].map(i => (
            <div key={i} className={`dot ${i === step ? 'active' : i < step ? 'done' : ''}`} />
          ))}
        </div>
      </div>

      {step === 0 && (
        <>
          <h3 className="step-prompt">What would you like to say tonight?</h3>
          <textarea
            className="letter-textarea"
            placeholder="Not all thoughts are meant to be spoken aloud..."
            value={text}
            onChange={e => setText(e.target.value.slice(0, maxLen))}
            autoFocus
          />
          <div className="counter">{text.length} / {maxLen}</div>
        </>
      )}

      {step === 1 && (
        <>
          <h3 className="step-prompt">Have a photo of the moon you've taken?</h3>
          <div
            className={`moon-drop ${hasPhoto ? 'has-image' : ''}`}
            onClick={() => {
              setHasPhoto(true);
              setPhotoName(`moon_${new Date().toISOString().slice(0,10)}.jpg`);
            }}
          >
            {hasPhoto ? (
              <>
                <div className="preview"><div className="sample-moon" /></div>
                <div className="file-name">{photoName} · click to replace</div>
              </>
            ) : (
              <>
                <div className="icon-moon" />
                <div className="drop-label">Drop a moon photo here</div>
                <div className="drop-sub">or click to choose · optional</div>
              </>
            )}
          </div>
          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <button
              className="text-btn"
              style={{ background: 'transparent', border: 'none', color: 'var(--ink-faint)', fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer' }}
              onClick={() => { setHasPhoto(false); setPhotoName(""); }}
            >
              skip this step
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h3 className="step-prompt">How would you like to sign it?</h3>
          <div className="sign-options">
            <div
              className={`sign-opt ${signMode === 'anon' ? 'selected' : ''}`}
              onClick={() => setSignMode('anon')}
            >
              <div className="radio" />
              <div className="opt-text">
                <div className="opt-title">— someone under the same moon</div>
                <div className="opt-sub">anonymous</div>
              </div>
            </div>
            <div
              className={`sign-opt ${signMode === 'name' ? 'selected' : ''}`}
              onClick={() => setSignMode('name')}
            >
              <div className="radio" />
              <div className="opt-text" style={{ width: '100%' }}>
                <div className="opt-title">Sign with your name or initial</div>
                <div className="opt-sub">or a secret signature</div>
                {signMode === 'name' && (
                  <input
                    className="sign-input"
                    placeholder="e.g. — M. · Priya · the wanderer"
                    value={name}
                    onChange={e => setName(e.target.value.slice(0, 40))}
                    autoFocus
                    onClick={e => e.stopPropagation()}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h3 className="step-prompt">Ready to send?</h3>
          <div className="send-review">
            <div className="mini-moon" />
            <p className="preview-body">"{text || 'Your whisper will appear here…'}"</p>
            <div className="preview-sig">
              {signMode === 'anon' ? '— someone under the same moon' : `— ${name.trim() || 'you'}`}
            </div>
            {hasPhoto && (
              <div style={{ fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-faint)' }}>
                + moon photo attached
              </div>
            )}
          </div>
        </>
      )}

      <div className="step-actions">
        <button
          className="text-btn"
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          ← back
        </button>
        {step < 3 ? (
          <button
            className="btn primary"
            style={{ padding: '10px 20px', fontSize: 11 }}
            onClick={() => canProceed && setStep(s => s + 1)}
            disabled={!canProceed}
          >
            continue <span className="arrow">→</span>
          </button>
        ) : (
          <button
            className="btn primary"
            style={{ padding: '10px 22px', fontSize: 11 }}
            onClick={() => setSent(true)}
          >
            whisper it <span className="arrow">✦</span>
          </button>
        )}
      </div>
    </div>
  );
}

window.SubmissionFlow = SubmissionFlow;
