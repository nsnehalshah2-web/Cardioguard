import { Check, CheckCircle2, Droplets, Moon, Save, Smile, Sun, Waves } from 'lucide-react';
import { useState } from 'react';

const STORAGE_KEY = 'cardioguard_daily_checkins';
const moods = ['Low', 'Okay', 'Good', 'Great'];

function readCheckIns() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export default function CheckIn() {
  const [form, setForm] = useState({ mood: 'Good', sleep: 7, movement: false, water: 4, note: '' });
  const [saved, setSaved] = useState(false);
  const [entries, setEntries] = useState(readCheckIns);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const save = (event) => {
    event.preventDefault();
    const entry = { ...form, id: Date.now(), date: new Date().toISOString() };
    const next = [entry, ...entries].slice(0, 7);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setEntries(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return <div className="checkin-page">
    <div className="page-heading">
      <div><span className="eyebrow"><Sun size={13} /> Daily wellbeing</span><h1>How are you feeling today?</h1><p>A quick private check-in helps you notice patterns between assessments.</p></div>
      <span className="privacy-badge"><CheckCircle2 size={14} /> Saved on this device</span>
    </div>
    <form className="checkin-grid" onSubmit={save}>
      <section className="panel checkin-main">
        <div className="checkin-section"><div className="checkin-title"><Smile size={18} /><div><h2>Your mood</h2><p>Choose the closest fit, without overthinking it.</p></div></div><div className="mood-grid">{moods.map((mood) => <button className={`mood-choice ${form.mood === mood ? 'selected' : ''}`} key={mood} onClick={() => update('mood', mood)} type="button"><span>{mood === 'Low' ? '•' : mood === 'Okay' ? '◦' : mood === 'Good' ? '●' : '✦'}</span>{mood}</button>)}</div></div>
        <div className="checkin-section"><div className="checkin-title"><Moon size={18} /><div><h2>Sleep last night</h2><p>Hours of sleep, approximately.</p></div><strong className="checkin-value">{form.sleep}h</strong></div><input className="checkin-range" type="range" min="3" max="12" value={form.sleep} onChange={(event) => update('sleep', Number(event.target.value))} /><div className="range-labels"><span>3 hours</span><span>12 hours</span></div></div>
        <div className="checkin-section"><div className="checkin-title"><Waves size={18} /><div><h2>Small wins</h2><p>Mark anything you have done today.</p></div></div><label className={`win-toggle ${form.movement ? 'selected' : ''}`}><input checked={form.movement} onChange={(event) => update('movement', event.target.checked)} type="checkbox" /><span className="win-check">{form.movement && <Check size={14} />}</span><span><strong>Moved for at least 10 minutes</strong><small>A walk, stretch, or anything that got you moving.</small></span></label></div>
      </section>
      <aside className="checkin-side"><section className="panel water-panel"><div className="checkin-title"><Droplets size={18} /><div><h2>Water check</h2><p>Glasses so far today.</p></div></div><div className="water-count"><strong>{form.water}</strong><span>glasses</span></div><input className="checkin-range" type="range" min="0" max="10" value={form.water} onChange={(event) => update('water', Number(event.target.value))} /><div className="range-labels"><span>0</span><span>10</span></div></section><section className="panel note-panel"><label htmlFor="checkin-note"><span className="eyebrow">Private note</span><h2>Anything to remember?</h2></label><textarea id="checkin-note" value={form.note} onChange={(event) => update('note', event.target.value)} placeholder="A small observation, symptom, or win..." rows="5" /></section><button className="btn btn-primary checkin-save" type="submit"><Save size={16} /> {saved ? 'Check-in saved' : 'Save today’s check-in'}</button></aside>
    </form>
    {entries.length > 0 && <section className="panel checkin-history"><div className="panel-heading"><div><span className="eyebrow">Your recent rhythm</span><h2>Last check-ins</h2></div><span className="last-updated">{entries.length} saved locally</span></div><div className="checkin-entry-list">{entries.slice(0, 3).map((entry) => <div className="checkin-entry" key={entry.id}><span className="entry-date">{new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span><strong>{entry.mood}</strong><span><Moon size={13} /> {entry.sleep}h sleep</span><span><Droplets size={13} /> {entry.water} glasses</span>{entry.movement && <span className="entry-win"><Check size={13} /> Movement</span>}</div>)}</div></section>}
  </div>;
}
