// frontend/src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../api/config';


// --- İKONLAR ---
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
const XCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

// Durumlar için renk belirleyici
const getStatusBadge = (status) => {
    switch (status) {
        case 'Yeni': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20';
        case 'İncelendi': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20';
        case 'Onaylandı': return 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20';
        case 'İptal Edildi': return 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20';
        default: return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20';
    }
};

const statusOptions = ['Yeni', 'İncelendi', 'Onaylandı', 'İptal Edildi'];

// İstatistik Kartı
const StatCard = ({ title, value, icon: Icon, colorClass, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay }}
        className="glass-card p-6 flex items-center justify-between relative overflow-hidden group"
    >
        <div className="relative z-10">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 dark:bg-opacity-20`}>
            <Icon />
        </div>
        <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-500 ${colorClass.replace('text-', 'bg-')}`}></div>
    </motion.div>
);

// Detay Modalı
const RequestDetailModal = ({ request, onClose, airports }) => {
    if (!request) return null;
    const getAirportName = (code) => airports.find(a => a.code === code)?.name || code;

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Talep Detayı #{request.id.slice(-6)}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"><XIcon /></button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div><label className="text-xs font-bold text-gray-500 uppercase">Müşteri</label><p className="text-gray-900 dark:text-white font-medium">{request.contact.name}</p></div>
                            <div><label className="text-xs font-bold text-gray-500 uppercase">E-posta</label><p className="text-gray-900 dark:text-white">{request.contact.email}</p></div>
                            <div><label className="text-xs font-bold text-gray-500 uppercase">Telefon</label><p className="text-gray-900 dark:text-white">{request.contact.phone || '-'}</p></div>
                        </div>
                        <div className="space-y-4">
                            <div><label className="text-xs font-bold text-gray-500 uppercase">Tarih</label><p className="text-gray-900 dark:text-white font-medium">{new Date(request.plan.date).toLocaleDateString('tr-TR')}</p></div>
                            <div><label className="text-xs font-bold text-gray-500 uppercase">Yolcu Sayısı</label><p className="text-gray-900 dark:text-white">{request.plan.passengers} Kişi</p></div>
                            <div><label className="text-xs font-bold text-gray-500 uppercase">Durum</label><span className={`inline-block mt-1 px-2 py-1 text-xs font-bold rounded-full ${getStatusBadge(request.status)}`}>{request.status}</span></div>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Uçuş Rotası</label>
                        <div className="flex items-center gap-4 text-lg font-semibold text-gray-900 dark:text-white">
                            <span>{getAirportName(request.plan.departure)}</span>
                            <span className="text-gray-400">✈️</span>
                            <span>{getAirportName(request.plan.arrival)}</span>
                        </div>
                    </div>
                    {request.contact.note && (
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Müşteri Notu</label>
                            <p className="mt-1 text-gray-600 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-900/30 italic">"{request.contact.note}"</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export const AdminDashboard = ({ onLogout }) => {
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [airports, setAirports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Verileri Çek (Talepler + Havalimanları)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const headers = { 'Authorization': `Bearer ${token}` };

                const [reqRes, airRes] = await Promise.all([
                    fetch(`${API_URL}/api/requests`, { headers }),
                    fetch(`${API_URL}/api/airports`)
                ]);

                if (!reqRes.ok || !airRes.ok) throw new Error('Veriler yüklenemedi.');

                const reqData = await reqRes.json();
                const airData = await airRes.json();

                const sortedReqs = reqData.sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt));
                setRequests(sortedReqs);
                setFilteredRequests(sortedReqs);
                setAirports(airData);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Arama Filtresi
    useEffect(() => {
        const lowerTerm = searchTerm.toLocaleLowerCase('tr-TR');
        const getAirportName = (code) => airports.find(a => a.code === code)?.name.toLocaleLowerCase('tr-TR') || code.toLocaleLowerCase('tr-TR');

        const filtered = requests.filter(req =>
            req.contact.name.toLocaleLowerCase('tr-TR').includes(lowerTerm) ||
            getAirportName(req.plan.departure).includes(lowerTerm) ||
            getAirportName(req.plan.arrival).includes(lowerTerm) ||
            req.status.toLocaleLowerCase('tr-TR').includes(lowerTerm)
        );
        setFilteredRequests(filtered);
    }, [searchTerm, requests, airports]);

    const handleStatusChange = async (id, newStatus) => {
        const originalRequests = [...requests];
        const updatedRequests = requests.map(req => req.id === id ? { ...req, status: newStatus } : req);
        setRequests(updatedRequests);

        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/requests/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!response.ok) throw new Error('Hata');
        } catch (err) {
            setRequests(originalRequests);
            alert('Durum güncellenemedi.');
        }
    };

    const getAirportName = (code) => airports.find(a => a.code === code)?.name || code;

    const stats = {
        total: requests.length,
        new: requests.filter(r => r.status === 'Yeni').length,
        approved: requests.filter(r => r.status === 'Onaylandı').length,
        cancelled: requests.filter(r => r.status === 'İptal Edildi').length
    };

    return (
        <div className="container mx-auto px-6 py-12 min-h-screen">
            {/* Üst Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Yönetim Paneli</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Sistemdeki tüm operasyonların genel bakışı.</p>
                </div>
                <button onClick={onLogout} className="flex items-center gap-2 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white px-5 py-2.5 rounded-xl transition-all duration-300 font-medium border border-red-500/20">
                    <LogoutIcon /> <span className="hidden sm:inline">Çıkış Yap</span>
                </button>
            </div>

            {/* İstatistikler */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
                <StatCard title="Toplam" value={stats.total} icon={UsersIcon} colorClass="text-purple-600" delay={0.1} />
                <StatCard title="Bekleyen" value={stats.new} icon={ClockIcon} colorClass="text-blue-600" delay={0.2} />
                <StatCard title="Onaylanan" value={stats.approved} icon={CheckCircleIcon} colorClass="text-green-600" delay={0.3} />
                <StatCard title="İptal" value={stats.cancelled} icon={XCircleIcon} colorClass="text-red-600" delay={0.4} />
            </div>

            {/* İçerik Alanı */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="glass-card bg-white/50 dark:bg-gray-800/50 p-6"
            >
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Talep Listesi</h2>
                    <div className="relative w-full sm:w-auto">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><SearchIcon /></span>
                        <input
                            type="text"
                            placeholder="Ara (İsim, Rota, Durum)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700/50 border border-transparent focus:border-primary focus:bg-white dark:focus:bg-gray-700 rounded-lg outline-none transition-all text-sm"
                        />
                    </div>
                </div>

                {isLoading && <div className="text-center py-10 text-gray-500">Yükleniyor...</div>}

                {!isLoading && !error && (
                    <>
                        {/* Masaüstü Tablo Görünümü */}
                        <div className="hidden md:block overflow-x-auto rounded-xl">
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-100/50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold text-xs">
                                    <tr>
                                        <th className="p-4 rounded-tl-xl">Tarih</th>
                                        <th className="p-4">Müşteri</th>
                                        <th className="p-4">Rota</th>
                                        <th className="p-4">Yolcu</th>
                                        <th className="p-4">Durum</th>
                                        <th className="p-4 rounded-tr-xl text-center">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredRequests.map(req => (
                                        <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="p-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                                                {new Date(req.receivedAt).toLocaleDateString('tr-TR')}
                                                <span className="block text-xs text-gray-400">{new Date(req.receivedAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </td>
                                            <td className="p-4 font-medium text-gray-900 dark:text-white">{req.contact.name}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 text-xs font-semibold">
                                                    <span className="truncate max-w-[100px]" title={getAirportName(req.plan.departure)}>{getAirportName(req.plan.departure)}</span>
                                                    <span className="text-gray-400">→</span>
                                                    <span className="truncate max-w-[100px]" title={getAirportName(req.plan.arrival)}>{getAirportName(req.plan.arrival)}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs">{req.plan.passengers}</span>
                                            </td>
                                            <td className="p-4">
                                                <select
                                                    value={req.status}
                                                    onChange={(e) => handleStatusChange(req.id, e.target.value)}
                                                    className={`bg-transparent text-xs font-bold py-1 px-2 rounded-lg cursor-pointer outline-none border ${getStatusBadge(req.status)}`}
                                                >
                                                    {statusOptions.map(o => <option key={o} value={o} className="text-gray-900 bg-white dark:bg-gray-800">{o}</option>)}
                                                </select>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button onClick={() => setSelectedRequest(req)} className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Detayları Gör">
                                                    <EyeIcon />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobil Kart Görünümü */}
                        <div className="md:hidden space-y-4">
                            {filteredRequests.map(req => (
                                <div key={req.id} className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">{req.contact.name}</h3>
                                            <p className="text-xs text-gray-500">{new Date(req.receivedAt).toLocaleString('tr-TR')}</p>
                                        </div>
                                        <select
                                            value={req.status}
                                            onChange={(e) => handleStatusChange(req.id, e.target.value)}
                                            className={`text-xs font-bold py-1 px-2 rounded-lg outline-none border ${getStatusBadge(req.status)} bg-transparent`}
                                        >
                                            {statusOptions.map(o => <option key={o} value={o} className="text-gray-900 bg-white dark:bg-gray-800">{o}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                                        <div className="flex items-center gap-2"><span className="text-gray-400 text-xs uppercase font-bold w-12">Rota:</span> <span className="font-medium truncate">{getAirportName(req.plan.departure)} → {getAirportName(req.plan.arrival)}</span></div>
                                        <div className="flex items-center gap-2"><span className="text-gray-400 text-xs uppercase font-bold w-12">Yolcu:</span> <span>{req.plan.passengers} Kişi</span></div>
                                    </div>
                                    <button onClick={() => setSelectedRequest(req)} className="w-full py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Detayları İncele</button>
                                </div>
                            ))}
                        </div>

                        {filteredRequests.length === 0 && (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                Kayıt bulunamadı.
                            </div>
                        )}
                    </>
                )}
            </motion.div>

            {/* Detay Modal */}
            <AnimatePresence>
                {selectedRequest && (
                    <RequestDetailModal
                        request={selectedRequest}
                        airports={airports}
                        onClose={() => setSelectedRequest(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
