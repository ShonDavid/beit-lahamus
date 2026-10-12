import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const articles = JSON.parse(await readFile('src/articles.json', 'utf8'));
const home = await readFile('dist/index.html', 'utf8');
const index = await readFile('dist/blog/index.html', 'utf8');
assert.equal(articles.length, 10);
assert.equal(new Set(articles.map(article => article.slug)).size, articles.length);
assert.equal((home.match(/class="news-card"/g) || []).length, 3);
assert.equal((index.match(/class="news-card"/g) || []).length, articles.length);
assert.equal((index.match(/id="satire-disclosure"/g) || []).length, 1);
assert.match(index, /class="news-lead"/);
const text = html => html.replace(/<[^>]*>/g, '').replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#x27;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>').replace(/\s+/g, ' ').trim();
const homeImages = [...home.matchAll(/<img[^>]*src="([^"]+)"/g)].map(match => match[1]);
for (const src of homeImages) await access(`dist/${src.replace(/^\//, '')}`);
for (const article of articles) {
  const html = await readFile(`dist/blog/${article.slug}/index.html`, 'utf8');
  assert.ok(html.includes(`<title>${article.title} | בית לחמוס</title>`));
  assert.ok(html.includes(`content="https://beit-lahamus.web.app/blog/${article.slug}"`));
  assert.ok(html.includes(`content="https://beit-lahamus.web.app${article.coverImage}"`));
  assert.ok(html.includes('property="og:type" content="article"'));
  assert.ok(html.includes('property="article:published_time"'));
  assert.equal((html.match(/class="news-card"/g) || []).length, 3);
  assert.equal((html.match(/data-amount=/g) || []).length, 4);
  assert.ok(html.includes('נוצר על ידי שון דוד'));
  assert.ok(html.includes('dir="rtl"'));
  assert.ok(html.includes('id="main-nav"'));
  for (const line of article.content.split('\n').filter(line => line.trim())) {
    if (line === '[VIDEO_PENDING]') { assert.ok(html.includes('הסרטון המלא בקרוב')); continue; }
    if (/^\|/.test(line)) continue;
    const plain = line.replace(/^> /, '').replace(/^#{1,3} /, '').replace(/^\d+\. /, '').replace(/^- /, '').replaceAll('**', '');
    assert.ok(text(html).includes(text(plain)), `Missing article text: ${article.slug}: ${plain}`);
  }
  assert.ok(html.includes('href="/blog"'));
  assert.ok(html.includes('href="/#ferrets"'));
  for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"#]+)"/g)) await access(`dist${match[1]}`);
  await access(`dist${article.coverImage}`);
}
const festival = await readFile('dist/blog/ferret-olympics-family-festival/index.html', 'utf8');
assert.match(festival, /<table>/);
assert.match(festival, /<th scope="col">/);
const party = await readFile('dist/blog/simchat-torah-ferret-party/index.html', 'utf8');
assert.match(party, /<figure class="video-pending">/);
assert.ok(!party.includes('<video'));
assert.match(await readFile('dist/blog/kubeh-hamusta/index.html', 'utf8'), /<ol>/);
console.log('Passed: homepage cards, blog index, ten full articles, related links, assets, SEO, support buttons, RTL, recipe lists, festival table, and video placeholder.');
