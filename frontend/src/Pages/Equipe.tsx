import { useAuth } from "../contexts/AuthContext";
import NavBar from "../Components/NavBar.tsx"
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import equipeService, { type Equipe as EquipeType } from "../services/equipe.service";
import Card_employe from "../Components/Card_employe.tsx";

export default function Equipe() {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [teamDetails, setTeamDetails] = useState<EquipeType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeams = async () => {
            // Safety check for user and user.equipe
            if (!user) return;

            // Cast to any to access dynamic props if needed, or refine AuthContext type later
            const userEquipes = (user as any).equipe;

            if (userEquipes && Array.isArray(userEquipes) && userEquipes.length > 0) {
                try {
                    setLoading(true);
                    console.log("Fetching teams for user:", (user as any).id);
                    const teams = await Promise.all(
                        userEquipes.map((eq: any) => equipeService.getById(eq.id_equipe || eq.id))
                    );
                    console.log("Teams fetched:", teams);
                    setTeamDetails(teams);
                } catch (error) {
                    console.error("Erreur chargement équipes:", error);
                } finally {
                    setLoading(false);
                }
            } else {
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
                <div className="gradient-header p-6 rounded-2xl shadow-blue flex items-center gap-4">
                    <span className="text-5xl">👥</span>
                    <div>
                        <h1 className="text-4xl font-bold text-white tracking-tight">
                            Mon Équipe
                        </h1>
                        <p className="text-blue-100 mt-1">Gérez et consultez les membres de votre équipe</p>
                    </div>
                </div>

                <div className="modern-card p-6 min-h-[500px]">
                    {loading ? (
                        <p className="text-gray-600 animate-pulse">Chargement des membres...</p>
                    ) : teamDetails && teamDetails.length > 0 ? (
                        teamDetails.map((team, index) => (
                            <div key={team?.id_equipe || index} className="mb-10 last:mb-0">
                                <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center gap-2">
                                    {team?.nom || "Équipe sans nom"}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {team?.membres && Array.isArray(team.membres) && team.membres.length > 0 ? (
                                        team.membres.map((member) => (
                                            <Card_employe key={member.id_utilisateur || Math.random()} employe={member} />
                                        ))
                                    ) : (
                                        <p className="text-gray-500 italic">Aucun membre trouvé.</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p>Vous n'appartenez à aucune équipe.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}