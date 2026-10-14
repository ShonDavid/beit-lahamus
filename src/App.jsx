import { useEffect, useRef, useState } from 'react';
import Page from './Page.jsx';
import BlogPage from './Blog.jsx';
import { updateBlogMetadata } from './blogMetadata.js';
import { profiles, rescueStories, footerContent, paypalMe, paypalClientId } from './content.js';
import { themedAsset, useTheme } from './theme.jsx';

function Dialog({ children, onClose, titleId, descriptionId, id }) {
	const ref = useRef(null);
	useEffect(() => {
		const opener = document.activeElement;
		ref.current.showModal();
		return () => opener?.focus();
	}, []);
	return <dialog ref={ref} id={id} aria-labelledby={titleId} aria-describedby={descriptionId}
		onCancel={(event) => { event.preventDefault(); onClose(); }}
		onClick={(event) => {
			if (event.target !== event.currentTarget) return;
			const rect = event.currentTarget.getBoundingClientRect();
			if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
		}}>
		<button className="close" aria-label="סגירה" autoFocus onClick={onClose}>×</button>
		{children}
	</dialog>;
}

let paypalSdkPromise;
function loadPayPalSdk(clientId) {
	if (window.paypal) return Promise.resolve(window.paypal);
	if (!paypalSdkPromise) {
		paypalSdkPromise = new Promise((resolve, reject) => {
			const script = document.createElement('script');
			script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=ILS&locale=he_IL&intent=capture&commit=true&disable-funding=venmo,paylater,credit`;
			script.async = true;
			script.onload = () => resolve(window.paypal);
			script.onerror = () => { paypalSdkPromise = null; reject(new Error('paypal-sdk')); };
			document.head.appendChild(script);
		});
	}
	return paypalSdkPromise;
}

function PayPalButtons({ amount, onPaid }) {
	const containerRef = useRef(null);
	const onPaidRef = useRef(onPaid);
	const [error, setError] = useState('');
	useEffect(() => { onPaidRef.current = onPaid; }, [onPaid]);
	useEffect(() => {
		const container = containerRef.current;
		let ignore = false;
		let checkout;
		loadPayPalSdk(paypalClientId).then((paypal) => {
			if (ignore || !container) return;
			checkout = paypal.Buttons({
				style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal', height: 48 },
				createOrder: (_data, actions) => actions.order.create({
					intent: 'CAPTURE',
					application_context: { shipping_preference: 'NO_SHIPPING', user_action: 'PAY_NOW' },
					purchase_units: [{
						description: 'תמיכה ביצירת האתר בית לחמוס',
						amount: { currency_code: 'ILS', value: Number(amount).toFixed(2) },
					}],
				}),
				onApprove: (_data, actions) => actions.order.capture().then(() => onPaidRef.current()),
				onError: () => setError('התשלום לא הושלם. אפשר לנסות שוב.'),
			});
			return checkout.render(container);
		}).catch(() => { if (!ignore) setError('לא הצלחנו לטעון את PayPal. אפשר לנסות שוב.'); });
		return () => { ignore = true; checkout?.close(); container?.replaceChildren(); };
	}, [amount]);
	return <>
		<div id="paypal-button-container" ref={containerRef} />
		{error && <p className="payment-notice" role="alert">{error}</p>}
	</>;
}

function PaymentDialog({ amount, onClose }) {
	const [consent, setConsent] = useState(false);
	const [paid, setPaid] = useState(false);
	const embedded = Boolean(paypalClientId);
	const checkoutUrl = `https://paypal.me/${paypalMe}/${amount}ILS`;
	return <Dialog id="payment-modal" titleId="payment-title" descriptionId="payment-disclosure" onClose={onClose}>
		<span className="eyebrow green">מידע חשוב לפני תשלום</span>
		<h2 id="payment-title">זהו אתר סאטירי.</h2>
		<p id="payment-disclosure">״בית לחמוס״ אינו עמותה רשומה. החמוסים, סיפורי ההצלה והעדויות באתר הם בדיוניים ואינם מתעדים פעילות הצלה אמיתית.</p>
		<p className="payment-purpose"><strong>כל תשלום מיועד לתמיכה בשון דוד, יוצר האתר, ובפיתוח האתר הסאטירי. הוא אינו תרומה להצלת חמוסים, אינו מממן טיפול בבעלי חיים ואינו מוצג כתרומה מוכרת לצורכי מס.</strong></p>
		<p id="payment-amount">הסכום שנבחר לתמיכה ביצירת האתר: ₪{amount}</p>
		{paid ? <p className="payment-done" role="status">התשלום התקבל. תודה על התמיכה ביצירת האתר.</p> : <>
			<label className="payment-consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /> אני מבין/ה שהאתר סאטירי ושהתשלום תומך ביצירת האתר בלבד.</label>
			{embedded && consent ? <PayPalButtons amount={amount} onPaid={() => setPaid(true)} /> : <a className="button" id="payment-continue" href={consent ? checkoutUrl : undefined} target="_blank" rel="noopener noreferrer" aria-disabled={!consent || embedded} onClick={(event) => { if (!consent) event.preventDefault(); }}>תשלום מהיר</a>}
			<p className="payment-status">{embedded
				? 'האישור נפתח בחלון של PayPal, בלי לעזוב את האתר. הסכום כבר מוגדר, ונשאר רק לאשר. האתר אינו שומר פרטי תשלום.'
				: `התשלום נפתח בלשונית חדשה והעמוד נשאר כאן. הסכום ₪${amount} כבר מוכן לאישור, בלי להקליד אותו מחדש. האתר אינו מקבל פרטי תשלום ואינו מאמת שההעברה הושלמה.`}</p>
		</>}
		<button className="payment-cancel" onClick={onClose}>ביטול וחזרה לאתר</button>
	</Dialog>;
}

export default function App({ pathname = window.location.pathname }) {
	useEffect(() => updateBlogMetadata(pathname), [pathname]);
	const { dark } = useTheme();
	const [menuOpen, setMenuOpen] = useState(false);
	const [content, setContent] = useState(null);
	const [amount, setAmount] = useState(null);
	const [videoPaused, setVideoPaused] = useState(false);
	const videoRef = useRef(null);
	const menuRef = useRef(null);
	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;
		const next = themedAsset('/assets/hero.mp4', dark);
		if (video.getAttribute('src') !== next) {
			video.setAttribute('src', next);
			video.load();
		}
		video.muted = true;
		video.play().catch(() => setVideoPaused(true));
	}, [dark, pathname]);
	useEffect(() => {
		function escape(event) {
			if (event.key === 'Escape' && menuOpen && !content && amount === null) {
				setMenuOpen(false);
				menuRef.current?.focus();
			}
		}
		document.addEventListener('keydown', escape);
		return () => document.removeEventListener('keydown', escape);
	}, [menuOpen, content, amount]);
	async function handleAction(event) {
		const target = event.target.closest('button, a');
		if (!event.target.closest('header')) setMenuOpen(false);
		if (!target) return;
		if (target.closest('#main-nav') && !target.closest('.theme-toggle')) setMenuOpen(false);
		if (target.classList.contains('menu-toggle')) setMenuOpen((open) => !open);
		if (target.dataset.profile) setContent(['החמוסים שלנו', ...profiles[target.dataset.profile]]);
		if (target.dataset.story) {
			const story = rescueStories[target.dataset.story];
			setContent([story.name + ' והחמוס', story.title, story.body]);
		}
		if (target.dataset.footer) { event.preventDefault(); setContent(footerContent[target.dataset.footer]); }
		if (target.dataset.amount) setAmount(Number(target.dataset.amount));
		if (target.id === 'video-toggle') {
			try { if (videoRef.current.paused) await videoRef.current.play(); else videoRef.current.pause(); }
			catch { setContent(['סרטון', 'הסרטון לא נטען כרגע', 'אפשר להמשיך לגלוש באתר או לנסות שוב.']); }
		}
	}
	return <>
		<div onClick={handleAction}>{pathname === '/blog' || pathname.startsWith('/blog/') ? <BlogPage {...{pathname, menuOpen, menuRef}} /> : <Page {...{menuOpen, menuRef, videoRef, videoPaused, setVideoPaused}} />}</div>
		{content && <Dialog id="modal" titleId="modal-title" descriptionId="modal-body" onClose={() => setContent(null)}>
			<span className="eyebrow green">{content[0]}</span><h2 id="modal-title">{content[1]}</h2><p id="modal-body">{content[2]}</p>
			<button className="button" onClick={() => setContent(null)}>סגירה</button>
		</Dialog>}
		{amount !== null && <PaymentDialog amount={amount} onClose={() => setAmount(null)} />}
	</>;
}
