import { useAuth } from "../contexts/AuthContext";
import NavBar from "../Components/NavBar.tsx"
import { Menu, X, Users, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import equipeService, { type Equipe as EquipeType } from "../services/equipe.service";
import Card_employe from "../Components/Card_employe.tsx";

export default function Equipe() {
    const { user, isManager } = useAuth();
    const [open, setOpen] = useState(false);
    const [teamDetails, setTeamDetails] = useState<EquipeType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeams = async () => {
            if (!user) return;
            setLoading(true);

            try {
                // Pour tout le monde (Manager ou Employé), on ne récupère que les équipes
                // dont l'utilisateur fait partie.
                const userEquipes = (user as any).equipe;

                if (userEquipes && Array.isArray(userEquipes) && userEquipes.length > 0) {
                    const teams = await Promise.all(
                        userEquipes.map((eq: any) => equipeService.getById(eq.id_equipe || eq.id))
                    );
                    setTeamDetails(teams);
                } else {
                    setTeamDetails([]);
                }
            } catch (error) {
                console.error("Erreur chargement équipes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, [user]);

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
                <div className="gradient-header p-6 rounded-2xl shadow-blue flex items-center gap-4 flex-shrink-0">
                    <span className="text-5xl">👥</span>
                    <div>
                        <h1 className="text-4xl font-bold text-white tracking-tight">
                            {isManager ? "Mes Équipes" : "Mon Équipe"}
                        </h1>
                        <p className="text-blue-100 mt-1">
                            {isManager ? "Consultez toutes vos équipes et leurs membres" : "Consultez les membres de votre équipe"}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-gray-600 animate-pulse text-lg">Chargement de vos équipes...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {teamDetails && teamDetails.length > 0 ? (
                            teamDetails.map((team, index) => (
                                <div key={team?.id_equipe || index} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                                    {/* En-tête de la Card Équipe */}
                                    <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-start">
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                                {team?.nom || "Équipe sans nom"}
                                                {isManager && (
                                                    <span title="Vous gérez cette équipe" className="text-blue-600">
                                                        <Shield size={20} />
                                                    </span>
                                                )}
                                            </h3>
                                            {team.description && (
                                                <p className="text-slate-500 mt-1 text-sm">{team.description}</p>
                                            )}
                                        </div>
                                        <div className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-slate-600 border border-slate-200 flex items-center gap-2">
                                            <Users size={16} />
                                            {team.membres?.length || 0} membres
                                        </div>
                                    </div>

                                    {/* Contenu : Liste des membres */}
                                    <div className="p-6 bg-white flex-1">
                                        {team?.membres && Array.isArray(team.membres) && team.membres.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {team.membres.map((member) => (
                                                    <div key={member.id_utilisateur} className="transform scale-95 origin-top-left">
                                                        <Card_employe employe={member} />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-slate-400 min-h-[100px]">
                                                <Users size={48} className="mb-2 opacity-20" />
                                                <p>Aucun membre dans cette équipe.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
                                <Users size={64} className="mx-auto mb-4 text-gray-300" />
                                <h3 className="text-xl font-semibold text-gray-700">Aucune équipe trouvée</h3>
                                <p className="mt-2 text-gray-500">{isManager ? "Vous ne faites partie d'aucune équipe pour le moment." : "Vous n'êtes membre d'aucune équipe."}</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}