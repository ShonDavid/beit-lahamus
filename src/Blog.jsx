import React from 'react';
import articles from './articles.json' with { type: 'json' };
import { SiteHeader, SiteFooter } from './SiteLayout.jsx';
import Horoscope, { HoroscopeFeature } from './Horoscope.jsx';

export { articles };
export const disclosure = 'בית לחמוס הוא אתר סאטירי. הדמויות, סיפורי האימוץ, האירועים והדיווחים באתר הם פרי הדמיון ואינם מתארים פעילות או התרחשויות אמיתיות.';
const date = (value) => new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(value));

function CoverImage({ article, className, loading }) {
  const image = <img className={className} src={article.coverImage} alt={article.coverAlt} loading={loading} width={article.coverWidth || 1536} height={article.coverHeight || 1024} />;
  return article.slug === 'shon-and-benarosh' ? <div className={['cover-edge-crop', className].filter(Boolean).join(' ')}>{image}</div> : image;
}

function NewsCard({ article }) {
  return <article className="news-card"><a href={`/blog/${article.slug}`}>
    <CoverImage article={article} loading="lazy" />
    <div className="news-card-copy"><span className="news-category">{article.category}</span><h3>{article.title}</h3><p>{article.excerpt}</p>
      <span className="news-meta"><time dateTime={article.publishedAt}>{date(article.publishedAt)}</time> · {article.readingTime} דקות קריאה</span><span className="news-read">לכתבה המלאה ←</span>
    </div>
  </a></article>;
}

export function HomeNews() {
  return <section className="wrap home-news" id="news" aria-labelledby="home-news-title"><div className="section-heading"><div><span className="eyebrow green">04 / מהדורת בית לחמוס</span><h2 id="home-news-title">חמוס <em>היום.</em></h2></div><p>כל החדשות שחשוב לחמוס לדעת.<br />וגם אלו שלא.</p></div>
    <div className="news-grid">{articles.slice(0, 3).map(article => <NewsCard key={article.id} article={article} />)}</div><HoroscopeFeature /><div className="news-actions"><a className="button" href="/blog">לכל החדשות מעולם החמוסים</a></div>
  </section>;
}

function inline(text) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, i) => part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part);
}

function ArticleBody({ article }) {
  return <div className="article-body">{article.content.split(/\n\s*\n/).map((block, index) => {
    const lines = block.trim().split('\n');
    if (lines[0].startsWith('> ')) return <blockquote key={index}>{inline(block.trim().slice(2))}</blockquote>;
    if (block.trim() === '[VIDEO_PENDING]') return <figure className="video-pending" key={index}><img src={article.coverImage} alt={article.coverAlt} loading="lazy" /><figcaption>הסרטון המלא בקרוב</figcaption></figure>;
    if (lines[0].startsWith('### ')) return <h3 key={index}>{inline(lines[0].slice(4))}</h3>;
    if (lines[0].startsWith('## ')) return <h2 key={index}>{inline(lines[0].slice(3))}</h2>;
    if (lines[0].startsWith('|')) {
      const rows = lines.map(line => line.replace(/^\||\|$/g, '').split('|').map(cell => cell.trim()));
      return <div className="table-scroll" key={index}><table><thead><tr>{rows[0].map((cell, i) => <th scope="col" key={i}>{inline(cell)}</th>)}</tr></thead><tbody>{rows.slice(2).map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{inline(cell)}</td>)}</tr>)}</tbody></table></div>;
    }
    if (lines.every(line => /^\d+\. /.test(line))) return <ol key={index}>{lines.map((line, i) => <li key={i}>{inline(line.replace(/^\d+\. /, ''))}</li>)}</ol>;
    const listStart = lines.findIndex(line => line.startsWith('- '));
    if (listStart !== -1 && lines.slice(listStart).every(line => line.startsWith('- '))) return <React.Fragment key={index}>{listStart > 0 && <p>{inline(lines.slice(0, listStart).join('\n'))}</p>}<ul>{lines.slice(listStart).map((line, i) => <li key={i}>{inline(line.slice(2))}</li>)}</ul></React.Fragment>;
    return <p key={index}>{inline(block)}</p>;
  })}</div>;
}

function ArticleSupport() {
  return <section className="article-support" aria-labelledby="support-title"><div className="support-heading"><span className="eyebrow">אהבתם את חמוס היום?</span><h2 id="support-title">לתרומות עבור בית לחמוס</h2><p>תמיכה אופציונלית בשון דוד, יוצר האתר הסאטירי, ובפיתוחו. התשלום אינו מיועד להצלת בעלי חיים.</p></div>
    <div className="support-options" aria-label="בחירת סכום תמיכה">{[25, 50, 500, 1000].map(amount => <button key={amount} type="button" data-amount={amount} aria-label={`תמיכה בסך ${amount} שקלים`}>₪{amount.toLocaleString('he-IL')}</button>)}</div>
    <p className="support-caption">תמיכה חד־פעמית באמצעות PayPal · גילוי ואישור לפני המעבר לתשלום</p><a className="support-terms" data-footer="money" href="#where-money-goes">תנאי תמיכה והחזרים</a>
  </section>;
}

export default function BlogPage({ pathname, menuOpen, menuRef }) {
  const slug = pathname.replace(/\/$/, '').split('/')[2];
  const article = articles.find(item => pathname.replace(/\/$/, '') === `/blog/${item.slug}`);
  const lead = articles[0];
  return <><a className="skip" href="#main">דילוג לתוכן</a><SiteHeader {...{menuOpen, menuRef}} /><main id="main">
    {slug === 'horoscope' ? <Horoscope /> : !slug ? <div className="wrap news-index"><div className="news-masthead"><span className="eyebrow green">החדשות של בית לחמוס</span><h1>חמוס היום</h1><p>כל החדשות שחשוב לחמוס לדעת. וגם אלו שלא.</p></div><p className="news-disclosure" id="satire-disclosure">{disclosure}</p>
      <a className="news-lead" href={`/blog/${lead.slug}`}><CoverImage article={lead} /><div><span className="news-category">הכתבה המובילה / {lead.category}</span><h2>{lead.title}</h2><p>{lead.excerpt}</p><span className="news-read">לכתבה המלאה ←</span></div></a>
      <HoroscopeFeature /><h2 className="news-all">כל החדשות</h2><div className="news-grid">{articles.map(item => <NewsCard key={item.id} article={item} />)}</div>
    </div> : article ? <><article className="wrap news-article"><nav className="news-breadcrumb" aria-label="מיקום באתר"><a href="/">בית לחמוס</a><span aria-hidden="true">/</span><a href="/blog">חמוס היום</a></nav><span className="news-category">{article.category}</span><h1>{article.title}</h1><p className="news-deck">{article.excerpt}</p><p className="news-meta">מערכת חמוס היום · <time dateTime={article.publishedAt}>{date(article.publishedAt)}</time> · {article.readingTime} דקות קריאה</p><CoverImage article={article} className="article-cover" /><ArticleBody article={article} /><ArticleSupport /></article>
      <section className="wrap news-related" aria-labelledby="related-title"><h2 id="related-title">עוד מעולם החמוסים</h2><div className="news-grid">{articles.filter(item => item.id !== article.id).slice(0, 3).map(item => <NewsCard key={item.id} article={item} />)}</div><a className="news-back" href="/blog">לכל החדשות מעולם החמוסים ←</a></section>
    </> : <section className="wrap"><h1>הכתבה לא נמצאה</h1><a className="button" href="/blog">בחזרה לחמוס היום</a></section>}
  </main><SiteFooter /></>;
}
