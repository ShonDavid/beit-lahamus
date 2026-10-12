import { build } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { blogMetadata } from '../src/blogMetadata.js';

// Import JSON through fs so the build script also works on Node 20.
const articles = JSON.parse(await readFile(new URL('../src/articles.json', import.meta.url), 'utf8'));
await build();
await build({ build: { ssr: 'src/render.jsx', outDir: 'node_modules/.cache/blog-ssr', emptyOutDir: true } });
const { render } = await import(pathToFileURL(resolve('node_modules/.cache/blog-ssr/render.js')));
const template = await readFile('dist/index.html', 'utf8');
const origin = new URL(template.match(/rel="canonical" href="([^"]+)"/)[1]).origin;
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
for (const pathname of ['/', '/blog', '/blog/horoscope', ...articles.map(article => `/blog/${article.slug}`)]) {
  let html = template.replace('<div id="root"></div>', `<div id="root">${render(pathname)}</div>`);
  const data = blogMetadata(pathname);
  if (data) {
    html = html.replace(/<title>.*?<\/title>/s, `<title>${escape(data.title)}</title>`);
    html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${origin + data.path}" />`);
    const values = {
      description: data.description, 'og:title': data.title, 'og:description': data.description,
      'og:url': origin + data.path, 'og:type': data.type, 'og:image': origin + data.image,
      'og:image:secure_url': origin + data.image, 'og:image:alt': data.imageAlt,
      'og:image:width': String(data.imageWidth || 1536), 'og:image:height': String(data.imageHeight || 1024),
      'twitter:title': data.title, 'twitter:description': data.description,
      'twitter:image': origin + data.image, 'twitter:image:alt': data.imageAlt,
    };
    if (data.publishedAt) values['article:published_time'] = data.publishedAt;
    for (const [key, value] of Object.entries(values)) {
      const attribute = key.startsWith('og:') || key.startsWith('article:') ? 'property' : 'name';
      const tag = `<meta ${attribute}="${key}" content="${escape(value)}" />`;
      const pattern = new RegExp(`<meta ${attribute}="${key}"[^>]*>`);
      html = pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `${tag}\n</head>`);
    }
  }
  const directory = pathname === '/' ? 'dist' : `dist${pathname}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, html);
}
console.log(`Prerendered homepage, blog index, horoscope, and ${articles.length} articles.`);
