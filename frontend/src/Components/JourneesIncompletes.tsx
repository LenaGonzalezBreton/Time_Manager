import { useState, useEffect } from 'react';
import { AlertCircle, Calendar } from 'lucide-react';
import horaireService, { type Horaire } from '../services/horaire.service';

export default function JourneesIncompletes() {
    const [incompleteDays, setIncompleteDays] = useState<Horaire[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchIncompleteDays = async () => {
            try {
                setLoading(true);
                const data = await horaireService.getIncompleteDays();
                setIncompleteDays(data);
                setError(null);
            } catch (err: any) {
                console.error('Erreur:', err);
                setError(err.message || 'Erreur de chargement');
            } finally {
                setLoading(false);
            }
        };

        fetchIncompleteDays();
    }, []);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="modern-card p-6 flex-1 min-w-[300px]">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center shadow-lg">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Journées Incomplètes</h2>
                        <p className="text-sm text-slate-600">Chargement...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="modern-card p-6 flex-1 min-w-[300px] border-l-4 border-red-500 bg-red-50">
                <p className="text-red-700">❌ {error}</p>
            </div>
        );
    }

    return (
        <div className="modern-card p-6 flex-1 min-w-[300px]">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center shadow-lg">
                    <Calendar size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Journées Incomplètes</h2>
                    <p className="text-sm text-slate-600">
                        {incompleteDays.length === 0
                            ? 'Aucune journée incomplète'
                            : `${incompleteDays.length} jour${incompleteDays.length > 1 ? 's' : ''} non rempli${incompleteDays.length > 1 ? 's' : ''}`
                        }
                    </p>
                </div>
            </div>

            {incompleteDays.length > 0 ? (
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {incompleteDays.map((day) => (
                        <div
                            key={day.id_horaire}
                            className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition"
                        >
                            <AlertCircle size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-900 text-sm">
                                    {formatDate(day.jour)}
                                </p>
                                <p className="text-xs text-slate-600 mt-1">
                                    {day.heure_arrivee ? 'Journée non terminée' : 'Journée non débutée'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    {/* <div className="text-6xl mb-3">✅</div> */}
                    <p className="text-slate-600 font-medium">
                        Toutes vos journées sont à jour !
                    </p>
                </div>
            )}
        </div>
    );
}
