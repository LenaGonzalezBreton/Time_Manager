import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import absenceService, { type Absence } from "../services/absence.service";
import { Calendar } from "lucide-react";

const Absences = () => {
    const { user } = useAuth();
    const [absences, setAbsences] = useState<Absence[]>([]);

    useEffect(() => {
        if (user) {
            absenceService.getByUser(user.id_utilisateur).then(data => {
                setAbsences(data.slice(0, 4));
            }).catch(console.error);
        }
    }, [user]);

    return (
        <div className="modern-card p-6 flex flex-col gap-4 w-full md:w-auto min-w-[280px]">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <Calendar className="text-purple-600" size={24} />
                <h3 className="text-xl font-bold text-slate-900">Dernières absences</h3>
            </div>

            <ul className="flex flex-col gap-2 max-h-[240px] overflow-y-auto">
                {absences.length === 0 ? (
                    <p className="text-slate-500 text-center py-4">Aucune absence récente</p>
                ) : (
                    absences.map((abs) => (
                        <li key={abs.id_absence} className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-3">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-700 font-medium">
                                    {new Date(abs.date_debut).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                                </span>
                                <span className="text-purple-700 font-semibold text-sm">
                                    {abs.type_absence?.nom || 'Congé'}
                                </span>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    )
}

export default Absences;