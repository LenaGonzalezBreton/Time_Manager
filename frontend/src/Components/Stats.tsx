import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import indicateurService, { type Indicateur } from "../services/indicateur.service";
import { TrendingUp, Clock, Target } from "lucide-react";

const Stats = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<Indicateur | null>(null);

    useEffect(() => {
        if (user) {
            indicateurService.getByUser(user.id_utilisateur).then(data => {
                if (data.length > 0) {
                    setStats(data[0]);
                }
            }).catch(console.error);
        }
    }, [user]);

    return (
        <div className="modern-card p-6 flex flex-col gap-4 w-full md:w-auto min-w-[340px]">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <TrendingUp className="text-blue-600" size={24} />
                <h3 className="text-xl font-bold text-slate-900">Statistiques</h3>
            </div>

            <div className="flex flex-col gap-3">
                {stats ? (
                    <>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Target className="text-green-600" size={18} />
                                    <span className="text-slate-700 font-medium">Présence</span>
                                </div>
                                <span className="text-2xl font-bold text-green-700">
                                    {stats.taux_presence ? `${(Number(stats.taux_presence) * 100).toFixed(0)}%` : 'N/A'}
                                </span>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="text-red-600" size={18} />
                                    <span className="text-slate-700 font-medium">Retard</span>
                                </div>
                                <span className="text-2xl font-bold text-red-700">
                                    {stats.taux_retard ? `${(Number(stats.taux_retard) * 100).toFixed(0)}%` : 'N/A'}
                                </span>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="text-blue-600" size={18} />
                                    <span className="text-slate-700 font-medium">Heures travaillées</span>
                                </div>
                                <span className="text-2xl font-bold text-blue-700">
                                    {(stats.minutes_travaillees / 60).toFixed(1)} h
                                </span>
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="text-slate-500 text-center py-4">Aucune statistique disponible</p>
                )}
            </div>
        </div>
    )
}

export default Stats;