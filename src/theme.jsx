import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'theme';
const DARK_FILES = new Set([
	'bamba-v2.jpg',
	'blog-zodiac.jpg',
	'hero.mp4',
	'louis-v2.jpg',
	'rex-v2.jpg',
	'story-asaf.jpg',
	'story-gal.jpg',
	'story-matan.jpg',
	'story-sahar.jpg',
	'story-shon.jpg',
]);

const ThemeContext = createContext({ dark: false, toggleTheme: () => {} });

export function themedAsset(src, dark) {
	if (!dark || !src || src.includes('/dark/')) return src;
	const file = src.split('/').pop();
	if (!DARK_FILES.has(file)) return src;
	const slash = src.lastIndexOf('/');
	return slash === -1 ? `dark/${file}` : `${src.slice(0, slash + 1)}dark/${file}`;
}

function readDomTheme() {
	if (typeof document === 'undefined') return false;
	return document.documentElement.getAttribute('data-theme') === 'dark';
}

function applyTheme(dark) {
	document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
	const meta = document.querySelector('meta[name="theme-color"]');
	if (meta) meta.setAttribute('content', dark ? '#0e1613' : '#173d36');
}

export function ThemeProvider({ children }) {
	const [dark, setDark] = useState(readDomTheme);
	useEffect(() => {
		applyTheme(dark);
		try {
			localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
		} catch { /* ignore */ }
	}, [dark]);
	return <ThemeContext.Provider value={{ dark, toggleTheme: () => setDark((value) => !value) }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
	return useContext(ThemeContext);
}
