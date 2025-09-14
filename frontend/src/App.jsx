// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelicopterForm } from './components/HelicopterForm';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';

// --- BİLEŞENLER ---

// Ikonlar
const ShieldCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>;
const Gem = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M12 22V9"/><path d="m3.5 8.5 17 0"/></svg>;
const Zap = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>;
const Users = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const Gauge = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>;
const ArrowRightLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>;
const ChevronDown = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
const Phone = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const Mail = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const MapPin = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const Linkedin = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>;
const Instagram = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;
const Facebook = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const X = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const Sun = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const Moon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const Briefcase = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
const Camera = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>;
const Heart = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const Map = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>;
const LogIn = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>;

const serviceIcons = { Briefcase, Camera, Heart, Map };

const AnimatedSection = ({ children, className }) => (
    <motion.section className={className} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, ease: "easeOut" }}>
        {children}
    </motion.section>
);

const Header = ({ onNavClick, theme, onThemeToggle, isLoggedIn }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleNav = (page) => { onNavClick(page); setIsMenuOpen(false); };
    return (
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <button onClick={() => handleNav('home')} className="text-2xl font-bold text-primary dark:text-white">ALPAIR AVIATION</button>
                <nav className="hidden md:flex items-center space-x-6">
                    <button onClick={() => handleNav('services')} className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors">Hizmetlerimiz</button>
                    <a href="#fleet" onClick={() => handleNav('home')} className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors">Filo</a>
                    <a href="#contact" onClick={() => handleNav('home')} className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors">İletişim</a>
                    <a href="#form" onClick={() => handleNav('home')} className="bg-accent text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-accent-hover transition-colors">Teklif Al</a>
                    <button onClick={onThemeToggle} className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white">{theme === 'light' ? <Moon /> : <Sun />}</button>
                </nav>
                <div className="md:hidden"><button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menüyü aç" className="text-primary dark:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg></button></div>
            </div>
            <AnimatePresence>{isMenuOpen && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800"><nav className="flex flex-col items-center space-y-4 py-4"><button onClick={() => handleNav('services')} className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors py-2">Hizmetlerimiz</button><a href="#fleet" onClick={() => handleNav('home')} className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors py-2">Filo</a><a href="#contact" onClick={() => handleNav('home')} className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors py-2">İletişim</a><a href="#form" onClick={() => handleNav('home')} className="bg-accent text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-accent-hover transition-colors mt-2">Teklif Al</a><button onClick={onThemeToggle} className="mt-4 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white">{theme === 'light' ? <Moon /> : <Sun />}</button></nav></motion.div>)}</AnimatePresence>
        </header>
    );
};

const FeatureCard = ({ icon, title, children, className }) => (
  <div className={`bg-white dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary dark:text-accent mb-4">{icon}</div>
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{children}</p>
  </div>
);

const FleetModal = ({ heli, onClose }) => {
    const [mainImage, setMainImage] = useState(heli.gallery[0]);
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 relative"><button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"><X /></button><h2 className="text-3xl font-bold text-primary dark:text-white">{heli.model}</h2></div>
                <div className="grid md:grid-cols-2 gap-8 p-6">
                    <div>
                        <img src={mainImage} alt={`[${heli.model} model helikopterin ana fotoğrafı]`} className="w-full h-80 object-cover rounded-lg mb-4" />
                        <div className="flex gap-2">{heli.gallery.map((img, index) => (<img key={index} src={img} alt={`[${heli.model} galerisinden ${index + 1}. fotoğraf]`} className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${mainImage === img ? 'border-accent' : 'border-transparent'}`} onClick={() => setMainImage(img)} />))}</div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-primary dark:text-white">Özellikler</h3>
                        <div className="space-y-4">
                            <div><h4 className="font-semibold text-gray-800 dark:text-gray-200">Temel Bilgiler</h4><ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mt-2"><li>Kapasite: {heli.specs.capacity}</li><li>Maksimum Hız: {heli.specs.speed}</li><li>Menzil: {heli.specs.range}</li></ul></div>
                            <div><h4 className="font-semibold text-gray-800 dark:text-gray-200">Teknik Detaylar</h4><ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mt-2">{Object.entries(heli.detailedSpecs).map(([key, value]) => (<li key={key}>{key}: {value}</li>))}</ul></div>
                            <div><h4 className="font-semibold text-gray-800 dark:text-gray-200">İdeal Kullanım Alanları</h4><div className="flex flex-wrap gap-2 mt-2">{heli.usageAreas.map(area => (<span key={area} className="bg-primary/10 text-primary dark:bg-accent/20 dark:text-accent text-xs font-medium px-2.5 py-0.5 rounded-full">{area}</span>))}</div></div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const FleetSection = ({ onHeliSelect }) => {
    const [fleet, setFleet] = useState([]);
    useEffect(() => { fetch('http://localhost:3001/api/fleet').then(res => res.json()).then(data => setFleet(data)).catch(err => console.error("Failed to fetch fleet data:", err)); }, []);
    if (fleet.length === 0) return null;
    return (
        <div id="fleet" className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-6">
                <div className="mx-auto max-w-2xl lg:max-w-4xl text-center"><h2 className="text-3xl font-bold tracking-tight text-primary dark:text-white sm:text-4xl">Modern Filomuz</h2><p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Her ihtiyaca uygun, son teknoloji hava araçlarımızla tanışın.</p></div>
                <div className="mt-16 flex gap-8 overflow-x-auto pb-4 lg:grid lg:grid-cols-3 lg:pb-0 lg:overflow-visible">
                    {fleet.map(item => (<div key={item.id} className="flex-shrink-0 w-80 lg:w-auto bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md overflow-hidden group flex flex-col"><img src={item.imageUrl} alt={`[${item.model} model helikopterin fotoğrafı]`} className="w-full h-56 object-cover" /><div className="p-6 flex flex-col flex-grow"><h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.model}</h3><p className="text-gray-600 dark:text-gray-300 mt-2 mb-4 flex-grow">{item.description}</p><div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4 text-sm text-gray-700 dark:text-gray-300"><span className="flex items-center gap-2"><Users /> {item.specs.capacity}</span><span className="flex items-center gap-2"><Gauge /> {item.specs.speed}</span><span className="flex items-center gap-2"><ArrowRightLeft /> {item.specs.range}</span></div><button onClick={() => onHeliSelect(item)} className="mt-4 w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Detayları Gör</button></div></div>))}
                </div>
            </div>
        </div>
    );
};

const TestimonialsSection = () => {
    const [testimonials, setTestimonials] = useState([]);
    useEffect(() => { fetch('http://localhost:3001/api/testimonials').then(res => res.json()).then(data => setTestimonials(data)).catch(err => console.error("Failed to fetch testimonials data:", err)); }, []);
    if (testimonials.length === 0) return null;
    return (
        <div id="testimonials" className="py-24 sm:py-32">
            <div className="container mx-auto px-6">
                <div className="mx-auto max-w-2xl lg:max-w-4xl text-center"><h2 className="text-3xl font-bold tracking-tight text-primary dark:text-white sm:text-4xl">Müşterilerimiz Ne Diyor?</h2><p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Sunduğumuz ayrıcalıklı hizmeti bir de onlardan dinleyin.</p></div>
                <div className="mt-16 flex gap-8 overflow-x-auto pb-4 lg:grid lg:grid-cols-3 lg:pb-0 lg:overflow-visible">
                    {testimonials.map(testimonial => (<div key={testimonial.id} className="flex-shrink-0 w-80 lg:w-auto bg-white dark:bg-gray-800/50 p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"><p className="text-gray-700 dark:text-gray-300 italic">"{testimonial.quote}"</p><div className="mt-6 flex items-center gap-4"><img className="h-12 w-12 rounded-full object-cover" src={testimonial.avatarUrl} alt={`[${testimonial.name} adlı kişinin fotoğrafı]`} onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/48x48/cccccc/FFFFFF?text=..'; }} /><div><p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p><p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.title}</p></div></div></div>))}
                </div>
            </div>
        </div>
    );
};

const FaqSection = () => {
    const [faqData, setFaqData] = useState([]);
    const [openId, setOpenId] = useState(null);
    useEffect(() => { fetch('http://localhost:3001/api/faq').then(res => res.json()).then(data => setFaqData(data)).catch(err => console.error("Failed to fetch FAQ data:", err)); }, []);
    const toggleFaq = (id) => { setOpenId(openId === id ? null : id); };
    if (faqData.length === 0) return null;
    return (
        <div id="faq" className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-6">
                <div className="mx-auto max-w-2xl lg:max-w-4xl text-center"><h2 className="text-3xl font-bold tracking-tight text-primary dark:text-white sm:text-4xl">Sıkça Sorulan Sorular</h2><p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Aklınıza takılan bir soru mu var? Cevabı burada olabilir.</p></div>
                <div className="mt-16 max-w-3xl mx-auto space-y-4">
                    {faqData.map(item => (<div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800/50 overflow-hidden"><button onClick={() => toggleFaq(item.id)} className="w-full flex justify-between items-center text-left p-6 font-semibold text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"><span>{item.question}</span><motion.div animate={{ rotate: openId === item.id ? 180 : 0 }} transition={{ duration: 0.2 }}><ChevronDown /></motion.div></button><AnimatePresence>{openId === item.id && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden"><div className="p-6 pt-0 text-gray-600 dark:text-gray-300">{item.answer}</div></motion.div>)}</AnimatePresence></div>))}
                </div>
            </div>
        </div>
    );
};

const ContactSection = ({ contactEmail, contactPhone, address }) => (
    <div id="contact" className="py-24 sm:py-32">
        <div className="container mx-auto px-6">
            <div className="mx-auto max-w-2xl lg:max-w-4xl text-center"><h2 className="text-3xl font-bold tracking-tight text-primary dark:text-white sm:text-4xl">Bize Ulaşın</h2><p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Sorularınız veya özel talepleriniz için bizimle iletişime geçmekten çekinmeyin.</p></div>
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <div className="flex items-start gap-4"><div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary dark:text-accent rounded-lg flex items-center justify-center"><Phone /></div><div><h3 className="text-lg font-semibold">Telefon</h3><p className="text-gray-600 dark:text-gray-300 mt-1">{contactPhone || "Bilgi mevcut değil"}</p></div></div>
                    <div className="flex items-start gap-4"><div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary dark:text-accent rounded-lg flex items-center justify-center"><Mail /></div><div><h3 className="text-lg font-semibold">E-posta</h3><p className="text-gray-600 dark:text-gray-300 mt-1">{contactEmail || "Bilgi mevcut değil"}</p></div></div>
                    <div className="flex items-start gap-4"><div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary dark:text-accent rounded-lg flex items-center justify-center"><MapPin /></div><div><h3 className="text-lg font-semibold">Adres</h3><p className="text-gray-600 dark:text-gray-300 mt-1">{address || "Bilgi mevcut değil"}</p></div></div>
                </div>
                <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400"><p>Harita Entegrasyon Alanı</p></div>
            </div>
        </div>
    </div>
);

const Footer = ({ socialLinks, onNavClick }) => (
    <footer className="bg-primary text-white">
        <div className="container mx-auto px-6 py-12">
            <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
                <div><h3 className="text-xl font-bold text-white">ALPAIR AVIATION</h3><p className="text-gray-300 mt-2">Gökyüzündeki lüks ve güvenilir partneriniz.</p></div>
                <div><h4 className="font-semibold text-white">Hızlı Linkler</h4><nav className="mt-4 space-y-2"><button onClick={() => onNavClick('services')} className="block text-gray-300 hover:text-white">Hizmetlerimiz</button><a href="#fleet" onClick={() => onNavClick('home')} className="block text-gray-300 hover:text-white">Filo</a><a href="#faq" onClick={() => onNavClick('home')} className="block text-gray-300 hover:text-white">SSS</a></nav></div>
                <div><h4 className="font-semibold text-white">Bizi Takip Edin</h4><div className="mt-4 flex justify-center md:justify-start space-x-4">
                        {socialLinks?.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white"><Linkedin /></a>}
                        {socialLinks?.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white"><Instagram /></a>}
                        {socialLinks?.facebook && <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white"><Facebook /></a>}
                </div></div>
            </div>
            <div className="mt-12 border-t border-primary-light pt-8 text-center text-gray-400">
                <p>&copy; {new Date().getFullYear()} ALPAIR AVIATION. Tüm hakları saklıdır.</p>
                {/* YENİ BUTON */}
                <button onClick={() => onNavClick('login')} className="mt-4 text-xs text-gray-500 hover:text-white">Admin Girişi</button>
            </div>
        </div>
    </footer>
);

const GridBackground = () => (
  <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-900 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:6rem_4rem]">
    <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#dbeafe,transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,#0D2B4F,transparent)]"></div>
  </div>
);

// HomePage Bileşeni
const HomePage = ({ siteData, onHeliSelect }) => (
    <>
        <section id="hero" className="container mx-auto px-6 py-12 sm:py-20 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="text-center lg:text-left">
                <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary dark:text-white leading-tight">{siteData.heroTitle || 'Gökyüzündeki İmzanız'}</motion.h2>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0">{siteData.heroSubtitle || 'ALPAIR AVIATION ile lüks ve güvenliği bir arada yaşayın.'}</motion.p>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="mt-8 flex gap-4 justify-center lg:justify-start">
                    <a href="#form" className="bg-accent text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-accent-hover transition-colors">Hemen Teklif Al</a>
                    <a href="#fleet" className="bg-white dark:bg-gray-800 text-primary dark:text-white font-semibold px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Filomuzu Keşfet</a>
                </motion.div>
            </div>
            <motion.div id="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}><HelicopterForm /></motion.div>
        </section>
        <AnimatedSection className="py-24 sm:py-32">
            <div id="features" className="container mx-auto px-6">
                <div className="mx-auto max-w-2xl lg:max-w-4xl text-center"><h2 className="text-3xl font-bold tracking-tight text-primary dark:text-white sm:text-4xl">Neden ALPAIR AVIATION?</h2><p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Mükemmeliyetçiliği her uçuşun merkezine koyuyoruz.</p></div>
                <div className="mt-16 flex gap-8 overflow-x-auto pb-4 lg:grid lg:grid-cols-3 lg:pb-0 lg:overflow-visible">
                    <FeatureCard className="flex-shrink-0 w-80 lg:w-auto" icon={<ShieldCheck />} title="Önce Güvenlik">Tüm uçuşlarımız, en yüksek sivil havacılık standartlarına ve periyodik bakımlara uygun olarak gerçekleştirilir.</FeatureCard>
                    <FeatureCard className="flex-shrink-0 w-80 lg:w-auto" icon={<Gem />} title="Benzersiz Konfor">Geniş ve lüks kabinlerimiz, VIP ikramlarımız ve kişiselleştirilmiş hizmetlerimizle yolculuğunuzu keyfe dönüştürün.</FeatureCard>
                    <FeatureCard className="flex-shrink-0 w-80 lg:w-auto" icon={<Zap />} title="Hız ve Esneklik">Zamanınızın değerini biliyoruz. İhtiyaçlarınıza özel planlama ile sizi tam zamanında istediğiniz yere ulaştırıyoruz.</FeatureCard>
                </div>
            </div>
        </AnimatedSection>
        <AnimatedSection><FleetSection onHeliSelect={onHeliSelect} /></AnimatedSection>
        <AnimatedSection><TestimonialsSection /></AnimatedSection>
        <AnimatedSection><FaqSection /></AnimatedSection>
        <AnimatedSection><ContactSection contactEmail={siteData.contactEmail} contactPhone={siteData.contactPhone} address={siteData.address} /></AnimatedSection>
    </>
);

// YENİ SAYFA: ServicesPage
const ServicesPage = () => {
    const [services, setServices] = useState([]);
    useEffect(() => { fetch('http://localhost:3001/api/services').then(res => res.json()).then(data => setServices(data)).catch(err => console.error("Failed to fetch services data:", err)); }, []);

    return (
        <div className="container mx-auto px-6 py-16">
            <motion.div initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y:0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-4xl font-bold text-primary dark:text-white mb-4 text-center">Hizmetlerimiz</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto">ALPAIR AVIATION olarak sunduğumuz ayrıcalıklı hizmetlerle seyahat deneyiminizi yeniden tanımlıyoruz. Her ihtiyaca yönelik çözümlerimizle tanışın.</p>
            </motion.div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                {services.map((service, index) => {
                    const IconComponent = serviceIcons[service.icon];
                    return (
                        <motion.div 
                            key={service.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800/50 p-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-start gap-6"
                        >
                            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary dark:text-accent rounded-lg flex items-center justify-center">
                                {IconComponent && <IconComponent />}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{service.title}</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-300">{service.description}</p>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    );
};


function App() {
  const [siteData, setSiteData] = useState({});
  const [selectedHeli, setSelectedHeli] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    fetch('http://localhost:3001/api/veriler')
      .then(res => res.json())
      .then(data => setSiteData(data))
      .catch(err => console.error("Failed to fetch site data:", err));
  }, []);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLoginSuccess = () => {
    sessionStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    setCurrentPage('admin');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setCurrentPage('home');
  };
  
  const handleNav = (page) => {
      // Admin'e gitmeye çalışırken giriş yapmamışsa, login sayfasına yönlendir
      if (page === 'admin' && !isLoggedIn) {
          setCurrentPage('login');
      } else {
          setCurrentPage(page);
      }
  };

  const renderPage = () => {
    if (isLoggedIn && currentPage === 'admin') {
        return <AdminDashboard onLogout={handleLogout} />;
    }
    
    switch (currentPage) {
        case 'home':
            return <HomePage siteData={siteData} onHeliSelect={setSelectedHeli} />;
        case 'services':
            return <ServicesPage />;
        case 'login':
            return <LoginPage onLoginSuccess={handleLoginSuccess} />;
        default:
            return <HomePage siteData={siteData} onHeliSelect={setSelectedHeli} />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300">
      {currentPage !== 'login' && currentPage !== 'admin' && (
        <Header onNavClick={handleNav} theme={theme} onThemeToggle={handleThemeToggle} isLoggedIn={isLoggedIn} />
      )}
      
      <main>
        {renderPage()}
      </main>
      
      {currentPage !== 'login' && currentPage !== 'admin' && (
        <Footer socialLinks={siteData.socialLinks} onNavClick={handleNav} />
      )}

      <AnimatePresence>
        {selectedHeli && <FleetModal heli={selectedHeli} onClose={() => setSelectedHeli(null)} />}
      </AnimatePresence>
    </div>
  );
}

export default App;
