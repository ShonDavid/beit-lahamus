import { useEffect, useState } from 'react';
import { signs, signForDate } from './horoscopeData.js';
import ZodiacIcon from './ZodiacIcon.jsx';

export function HoroscopeFeature() {
  return <aside className="horoscope-feature" aria-labelledby="horoscope-feature-title"><img src="/assets/blog-zodiac.jpg" alt="מאדאם חמוסטרה עם כדור בדולח" loading="lazy" width="1536" height="1024" /><div><span className="eyebrow">אסטרולוגיה · אוקטובר 2026</span><h2 id="horoscope-feature-title">גם לכוכבים מגיע <em>חמוס.</em></h2><p>אהבה, קריירה, כסף וקולרים. מאדאם חמוסטרה מגלה מה מחכה לכל אחד מ־12 המזלות.</p><a className="button" href="/blog/horoscope">להורוסקופ החמוסים ←</a></div><span className="horoscope-stars" aria-hidden="true">✦</span></aside>;
}

function Icon({ name }) {
  const paths = {
    calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M7 3v4m10-4v4M3 11h18m-12 4h2m4 0h2" /></>,
    share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m9 10 6-4m-6 8 6 4" /></>,
    copy: <><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3" /></>,
    message: <><path d="M21 11.5a8.5 8.5 0 0 1-12 7.8L3 21l1.7-6A8.5 8.5 0 1 1 21 11.5Z" /><path d="M8 8c0 4 2 6 6 6m-6-6 1-1m5 7 1-1" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 7 9 6 9-6" /></>,
  };
  return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function BirthdayPicker({ resetKey, onChange }) {
  const [parts, setParts] = useState(['', '', '']);
  useEffect(() => { setParts(['', '', '']); }, [resetKey]);
  const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
  function update(index, next) {
    const updated = parts.map((part, i) => i === index ? next : part);
    const [day, month, year] = updated;
    const days = month ? new Date(Number(year) || 2000, Number(month), 0).getDate() : 31;
    if (Number(day) > days) updated[0] = '';
    setParts(updated);
    onChange(updated[0] && month ? `${year || 2000}-${month.padStart(2, '0')}-${updated[0].padStart(2, '0')}` : '');
  }
  const dayCount = parts[1] ? new Date(Number(parts[2]) || 2000, Number(parts[1]), 0).getDate() : 31;
  return <fieldset className="birthday-card"><legend>או גלו את המזל לפי תאריך הלידה</legend><div className="birthday-caption"><span className="birthday-icon"><Icon name="calendar" /></span><div><strong>יום קטן. מזל גדול.</strong><p>בחרו יום וחודש — הכוכבים כבר יסתדרו.</p></div></div><div className="birthday-fields"><label>יום<select value={parts[0]} onChange={event => update(0, event.target.value)}><option value="">יום</option>{Array.from({ length: dayCount }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}</select></label><label>חודש<select value={parts[1]} onChange={event => update(1, event.target.value)}><option value="">חודש</option>{months.map((month, i) => <option key={month} value={i + 1}>{month}</option>)}</select></label><label>שנה <small>(לא חובה)</small><select value={parts[2]} onChange={event => update(2, event.target.value)}><option value="">שנה</option>{Array.from({ length: 127 }, (_, i) => <option key={i} value={2026 - i}>{2026 - i}</option>)}</select></label></div></fieldset>;
}

export default function Horoscope() {
  const [chosen, setChosen] = useState(6);
  const [birthdayReset, setBirthdayReset] = useState(0);
  const [sharingUrl, setSharingUrl] = useState('https://beit-lahamus.web.app/blog/horoscope');
  const [nativeSharing, setNativeSharing] = useState(false);
  useEffect(() => { setSharingUrl(new URL('/blog/horoscope', window.location.origin).href); setNativeSharing(Boolean(navigator.share)); }, []);
  const [shareStatus, setShareStatus] = useState('');
  const sign = signs[chosen];
  const values = [55 + (chosen * 13 + 17) % 44, 28 + (chosen * 17 + 9) % 70, 38 + (chosen * 11 + 21) % 60];
  function select(index) { setChosen(index); setShareStatus(''); }
  function changeBirthday(value) {
    const index = signForDate(value);
    if (index >= 0) select(index);
  }
  const shareText = `הורוסקופ החמוסים לאוקטובר 2026 | ${sign[0]}: ${sign[6]}`;
  function shareUrl() { return new URL('/blog/horoscope', window.location.origin).href; }
  async function share(method) {
    const text = shareText;
    const url = shareUrl();
    try {
      if (method === 'native' && navigator.share) await navigator.share({ title: 'הורוסקופ החמוסים', text, url });
      else if (navigator.clipboard) { await navigator.clipboard.writeText(`${text}\n${url}`); setShareStatus('התחזית הועתקה ✓'); }
      else setShareStatus('אפשר להעתיק את התחזית ואת כתובת העמוד לשיתוף.');
    } catch (error) { if (error.name !== 'AbortError') setShareStatus('השיתוף לא הושלם. אפשר להעתיק את התחזית ואת כתובת העמוד.'); }
  }
  return <article className="wrap horoscope-page"><nav className="news-breadcrumb" aria-label="מיקום באתר"><a href="/">בית לחמוס</a><span aria-hidden="true">/</span><a href="/blog">חמוס היום</a></nav><div className="horoscope-intro"><div><span className="eyebrow">אסטרולוגיה · אוקטובר 2026</span><h1>הורוסקופ <em>החמוסים.</em></h1><p>מרקורי בנסיגה, ונוס בבית הזוגיות והקולר החדש עומד לשנות הכול. מאדאם חמוסטרה חושפת את התחזית שאף יועץ פיננסי לא העז לחתום עליה.</p><p>בחרו מזל או הזינו תאריך לידה לקבלת תחזית אישית.</p></div><img src="/assets/blog-zodiac.jpg" alt="מאדאם חמוסטרה, אסטרולוגית הבית, עם כדור בדולח" width="1536" height="1024" /></div><div className="horoscope-panels"><section className="horoscope-picker" aria-labelledby="sign-picker-title"><span className="eyebrow green">מה המזל שלכם?</span><h2 id="sign-picker-title">הכוכבים מחכים.</h2><div className="horoscope-signs">{signs.map((item, index) => <button type="button" key={item[0]} aria-pressed={index === chosen} onClick={() => { select(index); setBirthdayReset(count => count + 1); }}><ZodiacIcon sign={item[1]} />{item[0]}</button>)}</div><BirthdayPicker resetKey={birthdayReset} onChange={changeBirthday} /><p className="news-meta">תאריך הלידה משמש לבחירת המזל בלבד ואינו נשמר.</p></section><section className="horoscope-result" aria-live="polite" aria-atomic="true"><span className="eyebrow green">התחזית האישית שלכם</span><div className="horoscope-sign-heading"><span className="horoscope-sign-medallion"><ZodiacIcon sign={sign[1]} /></span><div><h2>{sign[0]}</h2><p>אוקטובר 2026</p></div></div><p className="horoscope-fortune">{sign[6]}</p><div className="horoscope-meters">{['אהבה', 'כסף', 'קריירה'].map((name, index) => <div key={name}><div className="horoscope-meter-label"><strong>{name}</strong><span>{values[index]}%</span></div><div className="horoscope-track" aria-hidden="true"><div style={{ width: `${values[index]}%` }} /></div></div>)}</div><p className="horoscope-luck">צבע המזל: {['בורדו', 'טורקיז', 'זהב', 'לילך'][chosen % 4]} · מספר המזל: {chosen * 3 + 7}</p><details className="horoscope-share" onKeyDown={event => { if (event.key === 'Escape') { event.currentTarget.open = false; event.currentTarget.querySelector('summary').focus(); } }}><summary><span className="share-trigger-icon"><Icon name="share" /></span><span><strong>שתפו קצת מזל</strong><small>התחזית שלכם, לאנשים שלכם</small></span><span className="share-chevron" aria-hidden="true">⌄</span></summary><div className="share-options"><p>איך תרצו לשתף את התחזית?</p><div className="share-option-grid"><a href={`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + sharingUrl)}`} target="_blank" rel="noopener noreferrer"><Icon name="message" /><span>WhatsApp</span><small>שלחו למישהו עם מזל</small></a><a href={`mailto:?subject=${encodeURIComponent('הורוסקופ החמוסים · ' + sign[0])}&body=${encodeURIComponent(shareText + '\n' + sharingUrl)}`}><Icon name="mail" /><span>אימייל</span><small>מזל ישר לתיבת הדואר</small></a><button type="button" onClick={() => share('copy')}><Icon name="copy" /><span>העתקת התחזית</span><small>לכל מקום שתרצו</small></button>{nativeSharing && <button type="button" onClick={() => share('native')}><Icon name="share" /><span>אפשרויות נוספות</span><small>שיתוף דרך המכשיר</small></button>}</div></div></details><p className="share-status" role="status">{shareStatus}</p></section></div><p className="news-disclosure">התחזיות נכתבו על ידי מאדאם חמוסטרה, אסטרולוגית הבית. התחזית היא סאטירה, לא ייעוץ כלכלי, זוגי או רפואי.</p><a className="news-back" href="/blog">לכל החדשות מעולם החמוסים ←</a></article>;
}
