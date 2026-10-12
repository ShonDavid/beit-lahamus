import articles from './articles.json' with { type: 'json' };

export function blogMetadata(pathname) {
  if (pathname !== '/blog' && !pathname.startsWith('/blog/')) return null;
  const article = articles.find(item => pathname.replace(/\/$/, '') === `/blog/${item.slug}`);
  const index = pathname.replace(/\/$/, '') === '/blog';
  if (pathname.replace(/\/$/, '') === '/blog/horoscope') return {
    title: 'הורוסקופ החמוסים | בית לחמוס',
    description: 'הורוסקופ החמוסים לאוקטובר 2026: אהבה, קריירה, כסף וקולרים. בחרו מזל וגלו את התחזית של מאדאם חמוסטרה.',
    path: '/blog/horoscope', image: '/assets/blog-zodiac.jpg',
    imageAlt: 'מאדאם חמוסטרה עם כדור בדולח', type: 'website', imageWidth: 1536, imageHeight: 1024,
  };
  return {
    title: `${article ? article.title : index ? 'חמוס היום' : 'הכתבה לא נמצאה'} | בית לחמוס`,
    description: article?.excerpt || 'כל החדשות שחשוב לחמוס לדעת. וגם אלו שלא.',
    path: article ? `/blog/${article.slug}` : pathname.replace(/\/$/, ''),
    image: article?.coverImage || articles[0].coverImage,
    imageAlt: article?.coverAlt || articles[0].coverAlt,
    imageWidth: article?.coverWidth || articles[0].coverWidth || 1536,
    imageHeight: article?.coverHeight || articles[0].coverHeight || 1024,
    type: article ? 'article' : 'website',
    publishedAt: article?.publishedAt,
  };
}

export function updateBlogMetadata(pathname) {
  const data = blogMetadata(pathname);
  if (!data) return;
  const canonical = document.querySelector('link[rel="canonical"]');
  const origin = new URL(canonical?.href || window.location.origin).origin;
  document.title = data.title;
  if (canonical) canonical.href = origin + data.path;
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
    let meta = document.querySelector(`meta[${attribute}="${key}"]`);
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute(attribute, key); document.head.appendChild(meta); }
    meta.content = value;
  }
}
