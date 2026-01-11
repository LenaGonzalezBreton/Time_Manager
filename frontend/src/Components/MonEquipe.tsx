import { useAuth } from "../contexts/AuthContext";
import { Users } from "lucide-react";

const MonEquipe = () => {
    const { user } = useAuth();
    const equipes = (user as any)?.equipe || [];

    return (
        <div className="modern-card p-6 flex flex-col gap-4 w-full md:w-auto min-w-[280px]">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <Users className="text-blue-600" size={24} />
                <h3 className="text-xl font-bold text-slate-900">Mon équipe</h3>
            </div>

            <div className="flex flex-col gap-2 max-h-[240px] overflow-y-auto">
                {equipes.length === 0 ? (
                    <p className="text-slate-500 text-center py-4">Aucune équipe assignée</p>
                ) : (
                    equipes.map((eq: any) => (
                        <div key={eq.id_equipe} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                            <p className="font-bold text-center text-blue-900">{eq.nom}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default MonEquipe;