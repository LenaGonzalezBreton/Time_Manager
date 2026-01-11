import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import horaireService, { type Horaire } from "../services/horaire.service";
import { AlertCircle } from "lucide-react";

const Retards = () => {
    const { user } = useAuth();
    const [retards, setRetards] = useState<Horaire[]>([]);

    useEffect(() => {
        if (user) {
            horaireService.getByUser(user.id_utilisateur).then(data => {
                // Filter where minutes_retard > 0 and sort by date descending
                const late = data.filter(h => h.minutes_retard > 0)
                    .sort((a, b) => new Date(b.jour).getTime() - new Date(a.jour).getTime())
                    .slice(0, 4);
                setRetards(late);
            }).catch(console.error);
        }
    }, [user]);

    return (
        <div className="modern-card p-6 flex flex-col gap-4 w-full md:w-auto min-w-[280px]">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <AlertCircle className="text-orange-600" size={24} />
                <h3 className="text-xl font-bold text-slate-900">Derniers retards</h3>
            </div>

            <ul className="flex flex-col gap-2 max-h-[240px] overflow-y-auto">
                {retards.length === 0 ? (
                    <p className="text-slate-500 text-center py-4">Aucun retard récent</p>
                ) : (
                    retards.map((retard) => (
                        <li key={retard.id_horaire} className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-3">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-700 font-medium">
                                    {new Date(retard.jour).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                                </span>
                                <span className="text-red-600 font-bold text-lg">
                                    {retard.minutes_retard} min
                                </span>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    )
}

export default Retards;