// frontend/src/components/HelicopterForm.jsx
// BU YENİ BİR DOSYADIR. LÜTFEN İÇERİĞİNİ KOPYALAYIN.
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Ikonlar
const PlaneTakeoff = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22h20"/><path d="M6.36 17.4 4 17l-2-4 2.1.84c.9.36 1.8.36 2.7.03l1.84-.73c.96-.38 2-.38 2.98.02l1.83.73c.94.37 1.92.37 2.86.0l2.12-.85L22 13l-2 4-2.36-.6"/><path d="M5.33 17.4V9.6C5.33 5.4 9.1 2 13.5 2s8.17 3.4 8.17 7.6v7.8"/></svg>;
const PlaneLand = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22h20"/><path d="M6.36 17.4 4 17l-2-4 2.1.84c.9.36 1.8.36 2.7.03l1.84-.73c.96-.38 2-.38 2.98.02l1.83.73c.94.37 1.92.37 2.86.0l2.12-.85L22 13l-2 4-2.36-.6"/><path d="M5.33 17.4V9.6C5.33 5.4 9.1 2 13.5 2s8.17 3.4 8.17 7.6v7.8"/></svg>;
const Users = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const Calendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;

const InputField = ({ label, children, error }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <div className="relative mt-1">{children}</div>
    {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
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
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetch('http://localhost:3001/api/airports').then((res) => res.json()).then((data) => {
        setAirports(data);
        if (data.length > 1) {
          setFormData(prev => ({ ...prev, plan: { ...prev.plan, departure: data[0].code, arrival: data[1].code } }))
        }
      }).catch((err) => console.error('Failed to fetch airports:', err));
  }, []);

  const handlePlanChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({...prev, plan: { ...prev.plan, [name]: value }}));
  };

  const handleContactChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({...prev, contact: { ...prev.contact, [name]: type === 'checkbox' ? checked : value }}));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.plan.departure) newErrors.departure = 'Kalkış lokasyonu zorunludur.';
    if (!formData.plan.arrival) newErrors.arrival = 'Varış lokasyonu zorunludur.';
    if (formData.plan.departure === formData.plan.arrival) newErrors.arrival = 'Kalkış ve varış farklı olmalıdır.';
    if (!formData.plan.date) newErrors.date = 'Tarih zorunludur.';
    if (formData.plan.passengers < 1) newErrors.passengers = 'Yolcu sayısı en az 1 olmalıdır.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.contact.name.trim()) newErrors.name = 'Ad Soyad zorunludur.';
    if (!/^\S+@\S+\.\S+$/.test(formData.contact.email)) newErrors.email = 'Geçerli bir e-posta adresi girin.';
    if (!formData.contact.termsAccepted) newErrors.termsAccepted = 'Hüküm ve koşulları kabul etmelisiniz.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => { if (validateStep1()) { setStep(2); } };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setIsLoading(true);
    setFormMessage({ type: '', text: '' });
    try {
      const response = await fetch('http://localhost:3001/api/request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const result = await response.json();
      if (!response.ok) { throw new Error(result.message || 'Bir hata oluştu.'); }
      setFormMessage({ type: 'success', text: result.message });
      setFormData({ plan: { departure: airports[0]?.code || '', arrival: airports[1]?.code || '', date: '', passengers: 1 }, contact: { name: '', email: '', phone: '', note: '', termsAccepted: false } });
      setStep(1);
    } catch (error) {
      setFormMessage({ type: 'error', text: "Talebiniz işlenirken bir hata oluştu." });
    } finally {
      setIsLoading(false);
    }
  };
  
  const today = new Date().toISOString().split('T')[0];
  const formVariants = { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -30 } };

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
      <h3 className="text-xl font-bold text-center mb-1 text-gray-900 dark:text-white">Hızlı Teklif Alın</h3>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-sm">Uçuşunuzu saniyeler içinde planlayın.</p>
      
      {formMessage.text && (<div className={`p-3 rounded-lg mb-4 text-center text-sm font-medium ${formMessage.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>{formMessage.text}</div>)}

      <form onSubmit={handleSubmit} className="overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={formVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-4">
              <InputField label="Kalkış" error={errors.departure}>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><PlaneTakeoff /></span>
                <select name="departure" value={formData.plan.departure} onChange={handlePlanChange} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none appearance-none text-gray-900 dark:text-white">
                  {airports.map(a => <option key={a.code} value={a.code}>{a.name}</option>)}
                </select>
              </InputField>
              <InputField label="Varış" error={errors.arrival}>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><PlaneLand /></span>
                <select name="arrival" value={formData.plan.arrival} onChange={handlePlanChange} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none appearance-none text-gray-900 dark:text-white">
                  {airports.map(a => <option key={a.code} value={a.code}>{a.name}</option>)}
                </select>
              </InputField>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Tarih" error={errors.date}>
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><Calendar /></span>
                  <input type="date" name="date" min={today} value={formData.plan.date} onChange={handlePlanChange} className="w-full pl-10 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none text-gray-900 dark:text-white" />
                </InputField>
                <InputField label="Yolcu" error={errors.passengers}>
                   <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><Users /></span>
                  <input type="number" name="passengers" value={formData.plan.passengers} onChange={handlePlanChange} min="1" max="12" className="w-full pl-10 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none text-gray-900 dark:text-white" />
                </InputField>
              </div>
              <button type="button" onClick={handleNextStep} className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-sm">İletişim Bilgileri</button>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="step2" variants={formVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-4">
              <InputField label="Ad Soyad" error={errors.name}><input type="text" name="name" value={formData.contact.name} onChange={handleContactChange} className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none text-gray-900 dark:text-white" /></InputField>
              <InputField label="E-posta" error={errors.email}><input type="email" name="email" value={formData.contact.email} onChange={handleContactChange} className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none text-gray-900 dark:text-white" /></InputField>
              <InputField label="Notunuz (Opsiyonel)"><textarea name="note" value={formData.contact.note} onChange={handleContactChange} rows="3" className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none text-gray-900 dark:text-white"></textarea></InputField>
              <div className="flex items-start">
                  <input id="terms" name="termsAccepted" type="checkbox" checked={formData.contact.termsAccepted} onChange={handleContactChange} className="h-4 w-4 mt-1 text-accent bg-gray-100 border-gray-300 rounded focus:ring-accent dark:bg-gray-700 dark:border-gray-600"/>
                  <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="text-gray-600 dark:text-gray-300">Hüküm ve koşulları okudum, kabul ediyorum.</label>
                      {errors.termsAccepted && <p className="text-red-600 text-xs mt-1">{errors.termsAccepted}</p>}
                  </div>
              </div>
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold py-3 px-4 rounded-lg transition-colors">Geri</button>
                <button type="submit" disabled={isLoading} className="w-2/3 bg-accent hover:bg-accent-hover text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? 'Gönderiliyor...' : 'Teklif İste'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
