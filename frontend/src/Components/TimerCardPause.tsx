import { useState, useEffect } from "react";
import { Coffee, Play, Loader2 } from "lucide-react";
import horaireService, { type ExpectedSchedule } from "../services/horaire.service";

const TimerCardPause = () => {
    const [time, setTime] = useState(new Date());
    const [dayStarted, setDayStarted] = useState(false);
    const [pauseTimeRemaining, setPauseTimeRemaining] = useState(900); // 15 minutes en secondes
    const [isPaused, setIsPaused] = useState(false); // true = en pause (compteur actif), false = pas en pause (compteur arrêté)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expectedSchedule, setExpectedSchedule] = useState<ExpectedSchedule | null>(null);
    const [currentHoraire, setCurrentHoraire] = useState<any>(null);
    const [canStartDay, setCanStartDay] = useState(true); // Peut-on débuter la journée ?

    // Met à jour l'heure actuelle chaque seconde
    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Charge les données initiales au montage du composant
    useEffect(() => {
        loadInitialData();
    }, []);

    // Gère le décompte du temps de pause (se décrémente quand isPaused = true, c'est-à-dire quand l'utilisateur est en pause)
    useEffect(() => {
        if (dayStarted && isPaused && pauseTimeRemaining > 0) {
            const timer = setInterval(() => {
                setPauseTimeRemaining((prev) => Math.max(0, prev - 1));
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [dayStarted, isPaused, pauseTimeRemaining]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Charge les horaires prévus
            const schedule = await horaireService.getExpectedSchedule();
            setExpectedSchedule(schedule);

            // Vérifie si une journée a déjà été débutée aujourd'hui
            const todayHoraire = await horaireService.getTodayHoraire();

            // Vérifier que c'est bien l'horaire d'aujourd'hui
            const today = new Date().toISOString().split('T')[0];

            if (todayHoraire && todayHoraire.jour === today) {
                setCurrentHoraire(todayHoraire);

                // Si la journée a une heure d'arrivée mais pas de départ, elle est en cours
                if (todayHoraire.heure_arrivee && !todayHoraire.heure_depart) {
                    setDayStarted(true);
                    setCanStartDay(false);
                    // Restaurer l'état de pause depuis localStorage si disponible
                    const savedPauseState = localStorage.getItem('pauseState');
                    if (savedPauseState) {
                        const { isPaused: savedIsPaused, pauseTimeRemaining: savedTime } = JSON.parse(savedPauseState);
                        setIsPaused(savedIsPaused);
                        setPauseTimeRemaining(savedTime);
                    }
                } else if (todayHoraire.heure_arrivee && todayHoraire.heure_depart) {
                    // Si la journée a été terminée, on ne peut plus la débuter
                    setDayStarted(false);
                    setCanStartDay(false);
                } else {
                    // Pas d'heure d'arrivée, on peut débuter la journée
                    setCanStartDay(true);
                }
            } else {
                // Aucun horaire pour aujourd'hui, on peut débuter la journée
                setCanStartDay(true);
            }
        } catch (err: any) {
            console.error("Erreur lors du chargement des données:", err);
            setError(err.message || "Erreur lors du chargement des données");
        } finally {
            setLoading(false);
        }
    };

    const handleStartDay = async () => {
        // Vérifier qu'on peut bien débuter la journée
        if (!canStartDay) {
            setError("La journée a déjà été débutée ou terminée aujourd'hui");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const horaire = await horaireService.startWorkDay();
            setCurrentHoraire(horaire);
            setDayStarted(true);
            setCanStartDay(false); // Empêcher de redébuter la journée
            setPauseTimeRemaining(900); // Réinitialise à 15 minutes
            setIsPaused(false); // Pas en pause au départ, le compteur ne démarre pas

            // Sauvegarder l'état initial dans localStorage
            localStorage.setItem('pauseState', JSON.stringify({ isPaused: false, pauseTimeRemaining: 900 }));

            // Affiche un message si retard détecté
            if (horaire.minutes_retard > 0) {
                console.log(`Retard détecté: ${horaire.minutes_retard} minutes`);
            }
        } catch (err: any) {
            console.error("Erreur lors du début de journée:", err);
            setError(err.message || "Erreur lors du début de journée");
        } finally {
            setLoading(false);
        }
    };

    const handleEndDay = async () => {
        if (!window.confirm("Voulez-vous vraiment terminer la journée ?")) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const horaire = await horaireService.endWorkDay();
            setCurrentHoraire(horaire);
            setDayStarted(false);
            setCanStartDay(false); // Ne pas permettre de redébuter la journée
            setPauseTimeRemaining(900);
            setIsPaused(false);

            // Nettoyer le localStorage
            localStorage.removeItem('pauseState');

            console.log(`Journée terminée. Temps travaillé: ${horaire.minutes_travaillees} minutes`);
        } catch (err: any) {
            console.error("Erreur lors de la fin de journée:", err);
            setError(err.message || "Erreur lors de la fin de journée");
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePause = () => {
        const newIsPaused = !isPaused;
        setIsPaused(newIsPaused);

        // Sauvegarder l'état dans localStorage pour le restaurer après rechargement
        localStorage.setItem('pauseState', JSON.stringify({
            isPaused: newIsPaused,
            pauseTimeRemaining
        }));
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const formatScheduleTime = (timeStr: string | null) => {
        if (!timeStr) return "N/A";
        // timeStr est au format "HH:MM:SS", on prend juste HH:MM
        return timeStr.substring(0, 5);
    };

    return (
        <div className="modern-card p-6 flex flex-col gap-6 w-full md:w-auto min-w-[320px]">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
                    {error}
                </div>
            )}

            {!dayStarted ? (
                // État initial : uniquement le bouton "Débuter la journée"
                <div className="flex items-center justify-center min-h-[280px]">
                    {canStartDay ? (
                        <button
                            onClick={handleStartDay}
                            disabled={loading}
                            className="w-full px-8 py-4 bg-[#12171C] hover:bg-gray-800 text-white font-semibold text-lg rounded-xl active:scale-95 transition transform duration-150 ease-out shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Chargement...
                                </>
                            ) : (
                                "Débuter la journée"
                            )}
                        </button>
                    ) : (
                        <div className="text-center">
                            <p className="text-slate-600 font-medium mb-2">Journée déjà traitée</p>
                            <p className="text-sm text-slate-500">La journée a déjà été débutée ou terminée aujourd'hui</p>
                        </div>
                    )}
                </div>
            ) : (
                // État actif : affichage des informations et du chronomètre
                <>
                    {/* Horaires de travail */}
                    <div className="text-center border-b border-slate-200 pb-4">
                        <p className="text-slate-600 text-sm font-medium mb-1">Vos horaires aujourd'hui</p>
                        <p className="text-2xl font-bold text-slate-900">
                            {expectedSchedule
                                ? `${formatScheduleTime(expectedSchedule.heure_arrivee)} - ${formatScheduleTime(expectedSchedule.heure_depart)}`
                                : "Chargement..."}
                        </p>
                        {currentHoraire && currentHoraire.minutes_retard > 0 && (
                            <p className="text-orange-600 text-sm mt-2 font-medium">
                                ⚠️ Retard: {currentHoraire.minutes_retard} min
                            </p>
                        )}
                    </div>

                    {/* Heure actuelle et compteur de pause */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="text-center">
                            <p className="text-slate-600 text-sm font-medium mb-1">Heure actuelle</p>
                            <p className="text-3xl font-bold text-slate-900 tabular-nums">
                                {time.toLocaleTimeString("fr-FR", { hour12: false })}
                            </p>
                        </div>

                        <div className="w-full">
                            <p className="text-slate-600 font-medium text-center mb-2">Temps de pause restant</p>
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-600 rounded-2xl p-6 w-full">
                                <p className={`text-5xl font-bold text-center tabular-nums ${pauseTimeRemaining === 0 ? "text-red-600" : "text-blue-900"}`}>
                                    {formatTime(pauseTimeRemaining)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Boutons de contrôle */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleTogglePause}
                            disabled={pauseTimeRemaining === 0 || loading}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${pauseTimeRemaining === 0 || loading
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                : isPaused  // En pause (compteur actif) = bouton bleu "Reprendre"
                                    ? "bg-[#12171C] hover:bg-gray-800 text-white"
                                    : "bg-[#12171C] hover:bg-gray-800 text-white"  // Pas en pause (compteur arrêté) = bouton jaune "Pause"
                                }`}
                        >
                            {isPaused ? (  // En pause = afficher "Reprendre"
                                <>
                                    <Play size={20} /> Reprendre
                                </>
                            ) : (  // Pas en pause = afficher "Pause"
                                <>
                                    <Coffee size={20} /> Pause
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleEndDay}
                            disabled={loading}
                            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                "Terminer"
                            )}
                        </button>
                    </div>

                    {/* Indicateur d'état */}
                    <div className="text-center">
                        {isPaused && pauseTimeRemaining > 0 && (
                            <p className="text-sm text-blue-600 font-medium">⏯️ Pause en cours...</p>
                        )}
                        {!isPaused && pauseTimeRemaining > 0 && (
                            <p className="text-sm text-slate-500 font-medium">Cliquez sur "Pause" pour démarrer le compteur</p>
                        )}
                        {pauseTimeRemaining === 0 && (
                            <p className="text-sm text-red-600 font-medium">⏰ Temps de pause écoulé</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default TimerCardPause;