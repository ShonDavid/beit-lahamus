// Drawn as paths so every platform uses the same zodiac marks.
const zodiacPaths = {
  aries: 'M12 21V8c0-3-1.7-5-4-5S4 5 4 7s1 3 2.5 3M12 8c0-3 1.7-5 4-5s4 2 4 4-1 3-2.5 3',
  taurus: 'M5 3c0 4 3 6 7 6s7-2 7-6M18 15a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z',
  gemini: 'M5 3c4 2 10 2 14 0M5 21c4-2 10-2 14 0M8 5v14M16 5v14',
  cancer: 'M4 8c3-5 10-5 16-1M10 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM20 16c-3 5-10 5-16 1M20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  leo: 'M10 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9 14C7 11 6 9 6 7a4 4 0 0 1 8 0c0 4-2 7-2 10 0 2 1 4 3 4s4-2 4-4',
  virgo: 'M3 6v13M3 9c0-4 5-4 5 0v10M8 9c0-4 5-4 5 0v10M13 10c2-6 7-5 7 0 0 5-4 9-8 11M16 7v9c0 3 2 5 5 5',
  libra: 'M3 20h18M3 15h5a5 5 0 1 1 8 0h5',
  scorpio: 'M3 6v13M3 9c0-4 5-4 5 0v10M8 9c0-4 5-4 5 0v7c0 2 1 3 3 3h5M18 16l3 3-3 3',
  sagittarius: 'M4 20 20 4M12 4h8v8M5 10l9 9',
  capricorn: 'M3 7l4 11 4-14v12c0 3 2 5 5 5s5-2 5-5-2-5-5-5-5 2-5 5',
  aquarius: 'M3 9l3-3 3 3 3-3 3 3 3-3 3 3M3 17l3-3 3 3 3-3 3 3 3-3 3 3',
  pisces: 'M5 3c6 5 6 13 0 18M19 3c-6 5-6 13 0 18M3 12h18',
};

export default function ZodiacIcon({ sign, className = '' }) {
  return <svg className={`zodiac-icon ${className}`} data-zodiac={sign} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={zodiacPaths[sign]} /></svg>;
}
