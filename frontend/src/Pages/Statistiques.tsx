import { usePageTitle } from '../hooks/usePageTitle';
import { useState, useEffect } from 'react';
import NavBar from "../Components/NavBar";
import { Menu, X, ArrowLeft, Users, Target, Clock, TrendingUp, ChevronRight } from "lucide-react";
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import indicateurService, { type Indicateur, type TeamStats, type TeamMemberStats } from '../services/indicateur.service';

export default function Statistiques() {
    const { user, isManager } = useAuth();
    const [open, setOpen] = useState(false);

    // États pour Employé / Manager (stats perso)
    const [myStats, setMyStats] = useState<Indicateur | null>(null);

    // États pour Manager (stats équipes)
    const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<TeamStats | null>(null);
    const [teamDetails, setTeamDetails] = useState<TeamMemberStats[]>([]);

    const [loading, setLoading] = useState(true);
    usePageTitle('Statistiques');

    useEffect(() => {
        if (!user) return;

        setLoading(true);

        const fetchData = async () => {
            try {
                // 1. Toujours charger les stats personnelles (Employé ET Manager)
                const myData = await indicateurService.getByUser(user.id_utilisateur);
                if (myData.length > 0) setMyStats(myData[0]);

                // 2. Si Manager, charger aussi les stats des équipes
                if (isManager) {
                    const teamData = await indicateurService.getTeamsStats();
                    setTeamStats(teamData);
                }
            } catch (error) {
                console.error("Erreur chargement stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, isManager]);

    // Charger les détails d'une équipe quand on clique dessus
    const handleTeamClick = async (team: TeamStats) => {
        setLoading(true);
        try {
            const details = await indicateurService.getTeamDetailStats(team.id_equipe);
            setTeamDetails(details);
            setSelectedTeam(team);
        } catch (error) {
            console.error("Erreur chargement détails équipe:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToTeams = () => {
        setSelectedTeam(null);
        setTeamDetails([]);
    };

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
            <div className={`fixed top-0 left-0 h-full w-64 bg-white text-[#12171C] transition-transform duration-300 z-50 ${open ? "translate-x-0" : "-translate-x-full"} md:static md:translate-x-0 md:w-3/10`}>
                <NavBar />
            </div>

            {/* Main Content */}
            <main className="flex flex-col p-8 gap-8 h-screen w-full overflow-y-auto">
                <div className="flex flex-col gap-4 flex-shrink-0">
                    <div className="gradient-header p-6 rounded-2xl shadow-blue flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <span className="text-5xl">📊</span>
                            <div>
                                <h1 className="text-4xl font-bold text-[#12171C] tracking-tight">
                                    {isManager ? "Statistiques Globales" : "Mes Statistiques"}
                                </h1>
                                <p className="text-[#12171C] opacity-75 mt-1">
                                    {isManager ? "Vos indicateurs et le suivi des équipes" : "Visualisez vos performances"}
                                </p>
                            </div>
                        </div>

                        {/* Bouton Retour pour Employé uniquement (le Manager a sa propre navig) */}
                        {!isManager && (
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-2 bg-white border-2 border-blue-500 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-50 transition shadow-sm font-semibold"
                            >
                                <ArrowLeft size={20} />
                                Retour
                            </Link>
                        )}
                    </div>

                    {/* Navigation Manager : Retour Équipes sous le header */}
                    {isManager && selectedTeam && (
                        <div>
                            <button
                                onClick={handleBackToTeams}
                                className="flex items-center gap-2 bg-white border border-blue-200 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-50 transition shadow-sm font-semibold"
                            >
                                <ArrowLeft size={18} />
                                Retour Équipes
                            </button>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="text-center text-gray-600 mt-10 animate-pulse">Chargement des données...</div>
                ) : (
                    <div className="space-y-10">
                        {/* 1. STATISTIQUES INDIVIDUELLES (Affichées sauf si un manager est en mode "Détail équipe") */}
                        {(!isManager || !selectedTeam) && (
                            <section>
                                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <Target className="text-blue-600" />
                                    {isManager ? "Mes Statistiques Individuelles" : ""}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 border-t-4 border-t-blue-500 flex flex-col items-center justify-center gap-4 hover:shadow-md transition">
                                        <h3 className="text-xl font-semibold text-gray-700">Taux de Présence</h3>
                                        <div className="text-4xl font-bold text-blue-600">
                                            {myStats ? (myStats.taux_presence ? `${Number(myStats.taux_presence) * 100}%` : '0%') : 'N/A'}
                                        </div>
                                        <p className="text-sm text-gray-500">Pourcentage de présence validé</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 border-t-4 border-t-red-500 flex flex-col items-center justify-center gap-4 hover:shadow-md transition">
                                        <h3 className="text-xl font-semibold text-gray-700">Taux de Retard</h3>
                                        <div className="text-4xl font-bold text-red-600">
                                            {myStats ? (myStats.taux_retard ? `${Number(myStats.taux_retard) * 100}%` : '0%') : 'N/A'}
                                        </div>
                                        <p className="text-sm text-gray-500">Pourcentage de jours avec retard</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 border-t-4 border-t-green-500 flex flex-col items-center justify-center gap-4 hover:shadow-md transition">
                                        <h3 className="text-xl font-semibold text-gray-700">Heures Travaillées</h3>
                                        <div className="text-4xl font-bold text-green-600">
                                            {myStats ? `${(myStats.minutes_travaillees / 60).toFixed(1)} h` : 'N/A'}
                                        </div>
                                        <p className="text-sm text-gray-500">Total cumulé ce mois-ci</p>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* 2. STATISTIQUES ÉQUIPES (Manager uniquement) */}
                        {isManager && (
                            <section>
                                <div className="flex items-center justify-between mb-6 pt-6 border-t border-slate-200">
                                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                        <Users className="text-blue-600" />
                                        {selectedTeam ? `Détail : ${selectedTeam.nom}` : "Statistiques Équipes"}
                                    </h2>
                                </div>

                                {selectedTeam ? (
                                    /* VUE DÉTAIL ÉQUIPE */
                                    <div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {teamDetails.map((member) => (
                                                <div key={member.utilisateur.id_utilisateur} className="modern-card p-6 hover:shadow-lg transition-all duration-300">
                                                    <div className="flex items-center gap-4 mb-4 border-b border-slate-100 pb-4">
                                                        <div className="w-12 h-12 rounded-full bg-[#AAC7FF] flex items-center justify-center text-[#12171C] font-bold text-xl">
                                                            {member.utilisateur.prenom[0]}{member.utilisateur.nom[0]}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-slate-800">{member.utilisateur.prenom} {member.utilisateur.nom}</h3>
                                                            <p className="text-slate-500 text-sm">{member.utilisateur.email}</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-slate-600 flex items-center gap-2 text-sm"><Target size={16} /> Présence</span>
                                                            <span className="font-bold text-green-600">
                                                                {member.stats.taux_presence ? `${(Number(member.stats.taux_presence) * 100).toFixed(0)}%` : 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-slate-600 flex items-center gap-2 text-sm"><Clock size={16} /> Retard</span>
                                                            <span className="font-bold text-red-600">
                                                                {member.stats.taux_retard ? `${(Number(member.stats.taux_retard) * 100).toFixed(0)}%` : 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-slate-600 flex items-center gap-2 text-sm"><TrendingUp size={16} /> Heures</span>
                                                            <span className="font-bold text-blue-600">
                                                                {(Number(member.stats.minutes_travaillees || 0) / 60).toFixed(1)} h
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {teamDetails.length === 0 && (
                                            <div className="text-center text-slate-500 py-10">Aucun membre dans cette équipe ou pas de données.</div>
                                        )}
                                    </div>
                                ) : (
                                    /* VUE LISTE ÉQUIPES */
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {teamStats.map((team) => (
                                            <div
                                                key={team.id_equipe}
                                                onClick={() => handleTeamClick(team)}
                                                className="modern-card p-6 cursor-pointer hover:scale-105 transition-transform duration-300 group"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600 group-hover:bg-[#12171C] group-hover:text-white transition-colors">
                                                        <Users size={24} />
                                                    </div>
                                                    <div className="bg-slate-100 px-3 py-1 rounded-full text-xs font-semibold text-slate-600">
                                                        {team.memberCount} membres
                                                    </div>
                                                </div>

                                                <h3 className="text-xl font-bold text-slate-800 mb-2">{team.nom}</h3>

                                                <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-500">Moy. Présence</span>
                                                        <span className="font-semibold text-green-600">{(team.stats.taux_presence_moyen * 100).toFixed(0)}%</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-500">Moy. Retard</span>
                                                        <span className="font-semibold text-red-600 pl-2">{(team.stats.taux_retard_moyen * 100).toFixed(0)}%</span>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex items-center text-blue-600 text-sm font-semibold group-hover:translate-x-2 transition-transform">
                                                    Voir détails
                                                    <ChevronRight size={16} />
                                                </div>
                                            </div>
                                        ))}
                                        {teamStats.length === 0 && (
                                            <div className="col-span-full text-center text-slate-500 py-10">Aucune équipe trouvée.</div>
                                        )}
                                    </div>
                                )}
                            </section>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
