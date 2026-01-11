import { useState, useEffect } from 'react';
import NavBar from "../Components/NavBar";
import { Menu, X, Users, Mail, Phone, Shield } from "lucide-react";
import utilisateursService from '../services/utilisateurs.service';
import type { Utilisateur } from '../types/utilisateur.types';

export default function UtilisateursPage() {
    const [open, setOpen] = useState(false);
    const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUtilisateurs = async () => {
            try {
                setLoading(true);
                const data = await utilisateursService.getAll();
                setUtilisateurs(data);
                setError(null);
            } catch (err: any) {
                console.error('Erreur lors du chargement des utilisateurs:', err);
                setError(err.response?.data?.message || 'Erreur de connexion au serveur');
            } finally {
                setLoading(false);
            }
        };

        fetchUtilisateurs();
    }, []);

    return (
        <div className="flex h-screen w-screen relative" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
            {/* Bouton menu (mobile seulement) */}
            <button
                onClick={() => setOpen(!open)}
                className="absolute top-4 left-4 z-50 md:hidden text-gray-700"
            >
                {open ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay sombre (mobile uniquement quand menu ouvert) */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300"
                    onClick={() => setOpen(false)}
                ></div>
            )}

            {/* NAVBAR */}
            <div className={`fixed top-0 left-0 h-full w-64 bg-slate-800 text-white transition-transform duration-300 z-50 ${open ? "translate-x-0" : "-translate-x-full"} md:static md:translate-x-0 md:w-3/10`}>
                <NavBar />
            </div>

            {/* CONTENU PRINCIPAL */}
            <main className="flex flex-col p-8 gap-8 h-screen w-full overflow-y-auto">
                {/* Header avec gradient */}
                <div className="gradient-header p-6 rounded-2xl shadow-blue flex items-center gap-4">
                    <span className="text-5xl"><Users size={48} /></span>
                    <div>
                        <h1 className="text-4xl font-bold text-white tracking-tight">
                            Utilisateurs
                        </h1>
                        <p className="text-blue-100 mt-1">Gérez les membres de l'organisation</p>
                    </div>
                </div>

                {/* Contenu */}
                {loading ? (
                    <div className="modern-card p-8 text-center">
                        <div className="animate-pulse text-blue-600 text-lg">⏳ Chargement des utilisateurs...</div>
                    </div>
                ) : error ? (
                    <div className="modern-card p-6 border-l-4 border-red-500 bg-red-50">
                        <p className="text-red-700 font-semibold">❌ Erreur: {error}</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between">
                            <p className="text-slate-600 font-medium">
                                <span className="text-2xl font-bold text-blue-600">{utilisateurs.length}</span> utilisateur{utilisateurs.length > 1 ? 's' : ''}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {utilisateurs.map((user) => (
                                <div
                                    key={user.id_utilisateur}
                                    className="modern-card p-6 hover:shadow-blue transition-all duration-300"
                                >
                                    {/* Avatar avec initiales */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                                            {user.prenom?.charAt(0) || '?'}{user.nom?.charAt(0) || '?'}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-slate-900">
                                                {user.prenom} {user.nom}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Shield size={14} className="text-blue-500" />
                                                <span className="text-sm text-blue-600 font-medium">
                                                    {user.role?.titre || 'Employé'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Informations de contact */}
                                    <div className="space-y-2 border-t border-slate-100 pt-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Mail size={16} className="text-blue-500" />
                                            <span className="truncate">{user.email}</span>
                                        </div>
                                        {user.telephone && (
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Phone size={16} className="text-blue-500" />
                                                <span>{user.telephone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
