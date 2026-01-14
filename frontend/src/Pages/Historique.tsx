import { useState, useEffect } from 'react';
import NavBar from "../Components/NavBar";
import { Menu, X, History, Clock, ChevronLeft, ChevronRight, Users, Edit } from "lucide-react";
import historiqueService, { type HistoriqueModification } from '../services/historique.service';

export default function Historique() {
    const [open, setOpen] = useState(false);
    const [historique, setHistorique] = useState<HistoriqueModification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 10;

    useEffect(() => {
        const fetchHistorique = async () => {
            try {
                setLoading(true);
                const response = await historiqueService.getAll(page, LIMIT);
                setHistorique(response.data);
                setTotalPages(response.meta.totalPages);
                setError(null);
            } catch (err: any) {
                console.error('Erreur lors du chargement de l\'historique:', err);
                setError(err.response?.data?.message || 'Erreur de connexion au serveur');
            } finally {
                setLoading(false);
            }
        };

        fetchHistorique();
    }, [page]);

    const handlePrevious = () => {
        if (page > 1) setPage(p => p - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(p => p + 1);
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getModificationTitle = (entry: HistoriqueModification) => {
        if (entry.type_modification === 'equipe') {
            return "Modification d'équipe";
        }

        // Note: check variable name in interface. It was utilisateur_modifie in interface but typically modify in component? 
        // Wait, interface says utilisateur_modifie. 
        const u = entry.utilisateur_modifie;
        const userName = `${u?.prenom || ''} ${u?.nom || ''}`.trim();

        return userName || 'Utilisateur';
    };

    const getIcon = (type: string) => {
        if (type === 'equipe') return <Users className="text-blue-600" size={20} />;
        return <Edit className="text-blue-600" size={20} />;
    };

    return (
        <div className="flex h-screen w-screen relative" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
            {/* Bouton menu (mobile seulement) */}
            <button
                onClick={() => setOpen(!open)}
                className="absolute top-4 left-4 z-50 md:hidden text-gray-700"
            >
                {open ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay sombre */}
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
            <main className="flex flex-col p-4 sm:p-8 gap-6 sm:gap-8 h-screen w-full overflow-y-auto">
                {/* Header */}
                <div className="gradient-header p-4 sm:p-6 rounded-2xl shadow-blue flex items-center gap-3 sm:gap-4 flex-shrink-0">
                    <span className="text-4xl sm:text-5xl"><History size={40} className="sm:hidden" /><History size={48} className="hidden sm:block" /></span>
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                            Historique
                        </h1>
                        <p className="text-blue-100 mt-1 text-sm sm:text-base">Suivi des modifications</p>
                    </div>
                </div>

                {/* Contenu */}
                {loading ? (
                    <div className="modern-card p-8 text-center">
                        <div className="animate-pulse text-blue-600 text-lg">⏳ Chargement...</div>
                    </div>
                ) : error ? (
                    <div className="modern-card p-6 border-l-4 border-red-500 bg-red-50">
                        <p className="text-red-700 font-semibold">❌ Erreur: {error}</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between flex-shrink-0">
                            <p className="text-slate-600 font-medium text-sm sm:text-base">
                                Page <span className="font-bold text-blue-600">{page}</span> sur {totalPages}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handlePrevious}
                                    disabled={page === 1}
                                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-50 hover:bg-slate-50 transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={page >= totalPages}
                                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-50 hover:bg-slate-50 transition-colors"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="space-y-4 flex-grow overflow-y-auto pb-4">
                            {historique.length === 0 ? (
                                <div className="modern-card p-8 text-center text-slate-500">
                                    Aucune modification enregistrée
                                </div>
                            ) : (
                                <div className="relative">
                                    {historique.map((entry, index) => (
                                        <div key={entry.id_historique} className="relative pl-6 sm:pl-8 pb-6 sm:pb-8 last:pb-0">
                                            {/* Ligne verticale */}
                                            {index !== historique.length - 1 && (
                                                <div className="absolute left-2 sm:left-3 top-6 bottom-0 w-0.5 bg-blue-200"></div>
                                            )}

                                            {/* Point sur la timeline */}
                                            <div className="absolute left-0 sm:left-0.5 top-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-600 border-2 sm:border-4 border-white shadow-lg z-10"></div>

                                            {/* Carte de l'entrée */}
                                            <div className="modern-card p-3 sm:p-4 hover:shadow-lg transition-shadow">
                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            {getIcon(entry.type_modification)}
                                                            <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                                                                {getModificationTitle(entry)}
                                                            </h3>
                                                        </div>

                                                        {entry.type_modification === 'equipe' ? (
                                                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mt-2">
                                                                <p className="text-slate-700 text-sm font-medium">{entry.nouvelle_valeur}</p>
                                                            </div>
                                                        ) : (
                                                            <div className="text-xs sm:text-sm text-slate-600 mt-1">
                                                                {entry.utilisateur_modificateur ?
                                                                    `Modifié par ${entry.utilisateur_modificateur.prenom} ${entry.utilisateur_modificateur.nom}` :
                                                                    'Auto-modification'}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 flex-shrink-0">
                                                        <Clock size={14} className="sm:hidden" />
                                                        <Clock size={16} className="hidden sm:block" />
                                                        <span className="whitespace-nowrap">{formatDate(entry.date_modification)}</span>
                                                    </div>
                                                </div>

                                                {/* Détails pour non-équipe */}
                                                {entry.type_modification !== 'equipe' && (entry.ancienne_valeur || entry.nouvelle_valeur) && (
                                                    <div className="mt-3 pt-3 border-t border-slate-200">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                                                            {entry.ancienne_valeur && (
                                                                <div className="bg-red-50 p-2 sm:p-3 rounded-lg border border-red-200">
                                                                    <p className="text-red-600 font-medium mb-1">Ancienne valeur</p>
                                                                    <p className="text-slate-700 break-words">{entry.ancienne_valeur}</p>
                                                                </div>
                                                            )}
                                                            {entry.nouvelle_valeur && (
                                                                <div className="bg-green-50 p-2 sm:p-3 rounded-lg border border-green-200">
                                                                    <p className="text-green-600 font-medium mb-1">Nouvelle valeur</p>
                                                                    <p className="text-slate-700 break-words">{entry.nouvelle_valeur}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
