import { useState, useEffect } from 'react';
import NavBar from "../Components/NavBar";
import { Menu, X, ArrowLeft } from "lucide-react";
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import indicateurService, { type Indicateur } from '../services/indicateur.service';

export default function Statistiques() {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [stats, setStats] = useState<Indicateur | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(true);
            indicateurService.getByUser(user.id_utilisateur)
                .then(data => {
                    if (data.length > 0) {
                        setStats(data[0]);
                    }
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [user]);

    return (
        <div className="flex h-screen w-screen relative" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setOpen(!open)}
                className="absolute top-4 left-4 z-50 md:hidden text-gray-700"
            >
                {open ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300"
                    onClick={() => setOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full w-64 bg-slate-800 text-white transition-transform duration-300 z-50 ${open ? "translate-x-0" : "-translate-x-full"} md:static md:translate-x-0 md:w-3/10`}>
                <NavBar />
            </div>

            {/* Main Content */}
            <main className="flex flex-col p-8 gap-8 h-screen w-full overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <div className="gradient-header p-6 rounded-2xl shadow-blue flex items-center gap-4 flex-1 mr-4">
                        <span className="text-5xl">📊</span>
                        <div>
                            <h1 className="text-4xl font-bold text-white tracking-tight">
                                Mes Statistiques
                            </h1>
                            <p className="text-blue-100 mt-1">Visualisez vos performances</p>
                        </div>
                    </div>
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2 bg-white border-2 border-blue-500 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-50 transition shadow-sm font-semibold"
                    >
                        <ArrowLeft size={20} />
                        Retour
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Taux de Présence */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 border-t-4 border-t-blue-500 flex flex-col items-center justify-center gap-4 hover:shadow-md transition">
                        <h3 className="text-xl font-semibold text-gray-700">Taux de Présence</h3>
                        <div className="text-4xl font-bold text-blue-600">
                            {stats ? (stats.taux_presence ? `${Number(stats.taux_presence) * 100}%` : '0%') : 'N/A'}
                        </div>
                        <p className="text-sm text-gray-500">Pourcentage de présence validé</p>
                    </div>

                    {/* Taux de Retard */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 border-t-4 border-t-red-500 flex flex-col items-center justify-center gap-4 hover:shadow-md transition">
                        <h3 className="text-xl font-semibold text-gray-700">Taux de Retard</h3>
                        <div className="text-4xl font-bold text-red-600">
                            {stats ? (stats.taux_retard ? `${Number(stats.taux_retard) * 100}%` : '0%') : 'N/A'}
                        </div>
                        <p className="text-sm text-gray-500">Pourcentage de jours avec retard</p>
                    </div>

                    {/* Heures Travaillées */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 border-t-4 border-t-green-500 flex flex-col items-center justify-center gap-4 hover:shadow-md transition">
                        <h3 className="text-xl font-semibold text-gray-700">Heures Travaillées</h3>
                        <div className="text-4xl font-bold text-green-600">
                            {stats ? `${(stats.minutes_travaillees / 60).toFixed(1)} h` : 'N/A'}
                        </div>
                        <p className="text-sm text-gray-500">Total cumulé ce mois-ci</p>
                    </div>
                </div>

                {loading && (
                    <div className="text-center text-gray-600 mt-10 animate-pulse">Chargement des données...</div>
                )}
            </main>
        </div>
    );
}
