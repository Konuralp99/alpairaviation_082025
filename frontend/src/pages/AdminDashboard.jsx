// frontend/src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Durumlar için renk belirleyici
const getStatusBadge = (status) => {
    switch (status) {
        case 'Yeni':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        case 'İncelendi':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        case 'Onaylandı':
            return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case 'İptal Edildi':
            return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
};

const statusOptions = ['Yeni', 'İncelendi', 'Onaylandı', 'İptal Edildi'];

export const AdminDashboard = ({ onLogout }) => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/requests');
                if (!response.ok) throw new Error('Talepler yüklenemedi.');
                const data = await response.json();
                setRequests(data.sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt)));
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRequests();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        // Arayüzü anında güncelle
        const originalRequests = [...requests];
        setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));

        // Backend'i güncelle
        try {
            const response = await fetch(`http://localhost:3001/api/requests/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!response.ok) {
                throw new Error('Durum güncellenemedi.');
            }
        } catch (err) {
            console.error(err);
            // Hata durumunda eski haline geri dön
            setRequests(originalRequests);
            alert('Bir hata oluştu, durum güncellenemedi.');
        }
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-primary dark:text-white">Gelen Uçuş Talepleri</h1>
                    <button onClick={onLogout} className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-700">Çıkış Yap</button>
                </div>
                
                {isLoading && <p>Yükleniyor...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!isLoading && !error && (
                    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    <th className="p-4">Tarih</th>
                                    <th className="p-4">İsim</th>
                                    <th className="p-4">İletişim</th>
                                    <th className="p-4">Uçuş Planı</th>
                                    <th className="p-4">Durum</th>
                                    <th className="p-4">Eylemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(req => (
                                    <tr key={req.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="p-4 whitespace-nowrap">{new Date(req.receivedAt).toLocaleString('tr-TR')}</td>
                                        <td className="p-4 font-medium">{req.contact.name}</td>
                                        <td className="p-4">{req.contact.email}</td>
                                        <td className="p-4">{`${req.plan.departure} -> ${req.plan.arrival} (${req.plan.passengers} kişi)`}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <select 
                                                value={req.status}
                                                onChange={(e) => handleStatusChange(req.id, e.target.value)}
                                                className="bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-accent"
                                            >
                                                {statusOptions.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>
        </div>
    );
};
