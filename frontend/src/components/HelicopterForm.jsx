// frontend/src/components/HelicopterForm.jsx
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../api/config';


// --- İKONLAR ---
const PlaneTakeoff = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22h20" /><path d="M6.36 17.4 4 17l-2-4 2.1.84c.9.36 1.8.36 2.7.03l1.84-.73c.96-.38 2-.38 2.98.02l1.83.73c.94.37 1.92.37 2.86.0l2.12-.85L22 13l-2 4-2.36-.6" /><path d="M5.33 17.4V9.6C5.33 5.4 9.1 2 13.5 2s8.17 3.4 8.17 7.6v7.8" /></svg>;
const PlaneLand = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22h20" /><path d="M6.36 17.4 4 17l-2-4 2.1.84c.9.36 1.8.36 2.7.03l1.84-.73c.96-.38 2-.38 2.98.02l1.83.73c.94.37 1.92.37 2.86.0l2.12-.85L22 13l-2 4-2.36-.6" /><path d="M5.33 17.4V9.6C5.33 5.4 9.1 2 13.5 2s8.17 3.4 8.17 7.6v7.8" /></svg>;
const Users = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const Calendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>;
const ChevronRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>;

const InputField = ({ label, children, error, className }) => (
    <div className={className}>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">{label}</label>
        <div className="relative group">{children}</div>
        {error && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium flex items-center gap-1">⚠️ {error}</p>}
    </div>
);

export function HelicopterForm() {
    const [step, setStep] = useState(1);
    const [airports, setAirports] = useState([]);
    const [formData, setFormData] = useState({
        plan: { departure: '', arrival: '', date: '', passengers: 1 },
        contact: { name: '', email: '', phone: '', note: '', termsAccepted: false },
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/api/airports`)
            .then((res) => res.json())
            .then((data) => {
                setAirports(data);
                if (data.length > 1) {
                    setFormData(prev => ({ ...prev, plan: { ...prev.plan, departure: data[0].code, arrival: data[1].code } }))
                }
            })
            .catch((err) => console.error('Failed to fetch airports:', err));
    }, []);

    const handlePlanChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, plan: { ...prev.plan, [name]: value } }));
    };

    const handleContactChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'phone') {
            let numbers = value.replace(/\D/g, '');
            if (numbers.startsWith('0')) numbers = numbers.substring(1);
            numbers = numbers.substring(0, 10);

            let formatted = numbers;
            if (numbers.length > 0) formatted = `(${numbers.substring(0, 3)}`;
            if (numbers.length > 3) formatted += `) ${numbers.substring(3, 6)}`;
            if (numbers.length > 6) formatted += ` ${numbers.substring(6, 8)}`;
            if (numbers.length > 8) formatted += ` ${numbers.substring(8, 10)}`;

            setFormData(prev => ({ ...prev, contact: { ...prev.contact, phone: formatted } }));
            return;
        }

        setFormData((prev) => ({ ...prev, contact: { ...prev.contact, [name]: type === 'checkbox' ? checked : value } }));
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.plan.departure) newErrors.departure = 'Lütfen kalkış noktası seçin.';
        if (!formData.plan.arrival) newErrors.arrival = 'Lütfen varış noktası seçin.';
        if (formData.plan.departure === formData.plan.arrival) newErrors.arrival = 'Başlangıç ve bitiş aynı olamaz.';
        if (!formData.plan.date) newErrors.date = 'Uçuş tarihi seçiniz.';
        if (formData.plan.passengers < 1) newErrors.passengers = 'En az 1 yolcu.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.contact.name.trim()) newErrors.name = 'İsminizi giriniz.';
        if (!/^\S+@\S+\.\S+$/.test(formData.contact.email)) newErrors.email = 'Geçerli bir e-posta giriniz.';
        if (!/^\(\d{3}\) \d{3} \d{2} \d{2}$/.test(formData.contact.phone)) newErrors.phone = 'Numarayı eksiksiz giriniz: (5XX) XXX XX XX';
        if (!formData.contact.termsAccepted) newErrors.termsAccepted = 'Onay gereklidir.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = () => { if (validateStep1()) { setStep(2); } };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep2()) return;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (!response.ok) { throw new Error(result.message || 'Hata oluştu.'); }

            toast.success(result.message, {
                style: { background: '#10B981', color: '#fff' },
                iconTheme: { primary: '#fff', secondary: '#10B981' },
            });

            setFormData({
                plan: { departure: airports[0]?.code || '', arrival: airports[1]?.code || '', date: '', passengers: 1 },
                contact: { name: '', email: '', phone: '', note: '', termsAccepted: false }
            });
            setStep(1);
        } catch (error) {
            toast.error("Talebiniz iletilemedi. Lütfen tekrar deneyin.");
        } finally {
            setIsLoading(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];
    const formVariants = { hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 } };

    return (
        <div className="glass md:bg-white/80 dark:md:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-3xl p-6 sm:p-8 max-w-lg mx-auto transform transition-all hover:scale-[1.01]">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        {step === 1 ? 'Rotanızı Belirleyin' : 'Son Bir Adım'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {step === 1 ? 'Size en uygun uçuşu planlayalım.' : 'İletişim bilgilerinizi girin.'}
                    </p>
                </div>
                {/* Adım Göstergesi */}
                <div className="flex items-center gap-1">
                    <div className={`h-2 w-8 rounded-full transition-all duration-300 ${step === 1 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                    <div className={`h-2 w-8 rounded-full transition-all duration-300 ${step === 2 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="relative overflow-hidden min-h-[340px]">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" variants={formVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-5">
                            <InputField label="Nereden" error={errors.departure}>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                    <PlaneTakeoff />
                                </div>
                                <select name="departure" value={formData.plan.departure} onChange={handlePlanChange} className="w-full pl-10 pr-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none text-gray-900 dark:text-white font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                                    {airports.map(a => <option key={a.code} value={a.code}>{a.name}</option>)}
                                </select>
                            </InputField>

                            <InputField label="Nereye" error={errors.arrival}>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors">
                                    <PlaneLand />
                                </div>
                                <select name="arrival" value={formData.plan.arrival} onChange={handlePlanChange} className="w-full pl-10 pr-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all appearance-none text-gray-900 dark:text-white font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                                    {airports.map(a => <option key={a.code} value={a.code}>{a.name}</option>)}
                                </select>
                            </InputField>

                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Tarih" error={errors.date}>
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                        <Calendar />
                                    </div>
                                    <input type="date" name="date" min={today} value={formData.plan.date} onChange={handlePlanChange} className="w-full pl-10 pr-2 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white font-medium cursor-pointer" />
                                </InputField>

                                <InputField label="Yolcu" error={errors.passengers}>
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                        <Users />
                                    </div>
                                    <input type="number" name="passengers" value={formData.plan.passengers} onChange={handlePlanChange} min="1" max="12" className="w-full pl-10 pr-2 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white font-medium text-center" />
                                </InputField>
                            </div>

                            <button type="button" onClick={handleNextStep} className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group transform active:scale-95">
                                Devam Et <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" variants={formVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-5">
                            <InputField label="Ad Soyad" error={errors.name}>
                                <input type="text" name="name" placeholder="Örn: Ahmet Yılmaz" value={formData.contact.name} onChange={handleContactChange} className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white font-medium" />
                            </InputField>

                            <InputField label="E-posta Adresi" error={errors.email}>
                                <input type="email" name="email" placeholder="ornek@sirket.com" value={formData.contact.email} onChange={handleContactChange} className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white font-medium" />
                            </InputField>

                            <InputField label="Telefon Numarası" error={errors.phone}>
                                <input type="tel" name="phone" placeholder="(555) 555 55 55" value={formData.contact.phone} onChange={handleContactChange} className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white font-medium" />
                            </InputField>

                            <InputField label="Özel Notlar (Opsiyonel)">
                                <textarea name="note" placeholder="Ekstra talepleriniz..." value={formData.contact.note} onChange={handleContactChange} rows="3" className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white font-medium resize-none"></textarea>
                            </InputField>

                            <div className="flex items-start bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                <input id="terms" name="termsAccepted" type="checkbox" checked={formData.contact.termsAccepted} onChange={handleContactChange} className="h-5 w-5 mt-0.5 text-accent bg-white border-gray-300 rounded focus:ring-accent dark:bg-gray-700 dark:border-gray-600 cursor-pointer" />
                                <div className="ml-3">
                                    <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer select-none">Hizmet şartlarını okudum ve kabul ediyorum.</label>
                                    {errors.termsAccepted && <p className="text-red-500 text-xs mt-1 font-bold">{errors.termsAccepted}</p>}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white font-bold py-3.5 px-4 rounded-xl transition-colors">Geri</button>
                                <button type="submit" disabled={isLoading} className="w-2/3 bg-accent hover:bg-accent-hover text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-lg shadow-accent/25 disabled:opacity-70 disabled:cursor-wait">
                                    {isLoading ? 'İşleniyor...' : 'Teklif İste'}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </div>
    );
}
