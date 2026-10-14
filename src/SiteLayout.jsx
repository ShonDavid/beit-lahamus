import { useTheme } from './theme.jsx';

function ThemeToggle({ className = '' }) {
	const { dark, toggleTheme } = useTheme();
	return <button type="button" className={['theme-toggle', className].filter(Boolean).join(' ')} role="switch" aria-checked={dark} onClick={toggleTheme} aria-label={dark ? 'הפעלת מצב בהיר' : 'הפעלת מצב כהה'} suppressHydrationWarning>
		<span className="theme-toggle-label">{dark ? 'מצב בהיר' : 'מצב כהה'}</span>
		<span className="theme-toggle-track" aria-hidden="true" suppressHydrationWarning><span className="theme-toggle-thumb" /></span>
	</button>;
}

export function SiteHeader({ menuOpen, menuRef }) {
	return <header>
		<a className="brand" href="/"><span className="brand-mark">ב</span><span>בית לחמוס<small>בית קטן. שליחות ארוכה.</small></span></a>
		<button aria-controls="main-nav" className="menu-toggle" ref={menuRef} aria-expanded={menuOpen} aria-label={menuOpen ? 'סגירת תפריט' : 'פתיחת תפריט'}>תפריט</button>
		<nav aria-label="ניווט ראשי" id="main-nav" className={menuOpen ? 'is-open' : ''}>
			<a className="nav-news" href="/blog">חמוס היום <span className="nav-new">חדש</span></a>
			<a href="/#ferrets">החמוסים שלנו</a>
			<a href="/#story">סיפורי הצלה</a>
			<a href="/#about">עלינו</a>
			<a href="/#guide">מדריך החמוס</a>
			<ThemeToggle className="theme-toggle--menu" />
		</nav>
		<div className="header-actions">
			<ThemeToggle className="theme-toggle--header" />
			<a className="button small" href="/#help">אני רוצה לעזור <svg aria-hidden="true" className="heart-icon" height="17" viewBox="0 0 24 24" width="17"><path d="M12 21s-9-5.5-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.5-9 12-9 12Z" fill="currentColor"></path></svg></a>
		</div>
	</header>;
}

export function SiteFooter() {
	return <footer>
		<div className="footer-top"><a className="brand" href="/"><span className="brand-mark">ב</span><span>בית לחמוס<small>לכל חמוס מגיע בית.</small></span></a><a href="#main">חזרה למעלה ↑</a></div>
		<div className="footer-bottom">
			<div className="footer-links">
				<a data-footer="about" href="#about-association">אודות העמותה</a>
				<a data-footer="money" href="#where-money-goes">לאן הכסף הולך</a>
				<a data-footer="accessibility" href="#accessibility">הצהרת נגישות</a>
			</div>
			<a href="https://www.pexels.com/video/37649665/" rel="noopener" target="_blank">צילום וסרטון: Pexels</a>
			<p className="creator-credit">נוצר על ידי שון דוד</p>
		</div>
	</footer>;
}
