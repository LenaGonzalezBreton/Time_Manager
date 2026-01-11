import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const TimerCardDebut = () => {
    const { user } = useAuth();
    const [pauseTime, setPauseTime] = useState(0); // Temps de pause en secondes
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // Horaires de travail (à récupérer depuis l'API plus tard)
    const workStart = "09:00";
    const workEnd = "17:00";

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isRunning && !isPaused) {
            interval = setInterval(() => {
                setPauseTime((prev) => prev + 1);
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, isPaused]);

    const handleStart = () => {
        if (!isRunning) {
            // Premier démarrage
            setIsRunning(true);
            setIsPaused(false);
            setPauseTime(0);
        } else if (isPaused) {
            // Reprendre
            setIsPaused(false);
        } else {
            // Pause
            setIsPaused(true);
        }
    };

    const handleStop = () => {
        setIsRunning(false);
        setIsPaused(false);
    };

    const handleReset = () => {
        setIsRunning(false);
        setIsPaused(false);
        setPauseTime(0);
    };

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getButtonText = () => {
        if (!isRunning) return "Début";
        if (isPaused) return "Reprendre";
        return "Pause";
    };

    const getButtonIcon = () => {
        if (!isRunning || isPaused) return <Play size={20} />;
        return <Pause size={20} />;
    };

    return (
        <div className="modern-card p-6 flex flex-col gap-6 w-full md:w-auto min-w-[320px]">
            {/* Horaires de travail */}
            <div className="text-center border-b border-slate-200 pb-4">
                <p className="text-slate-600 text-sm font-medium mb-1">Vos horaires aujourd'hui</p>
                <p className="text-2xl font-bold text-slate-900">
                    {workStart} - {workEnd}
                </p>
            </div>

            {/* Compteur de pause */}
            <div className="flex flex-col items-center gap-4">
                <p className="text-slate-600 font-medium">Temps de pause</p>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-600 rounded-2xl p-6 w-full">
                    <p className="text-5xl font-bold text-blue-900 text-center tabular-nums">
                        {formatTime(pauseTime)}
                    </p>
                </div>
            </div>

            {/* Boutons de contrôle */}
            <div className="flex gap-3">
                <button
                    onClick={handleStart}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${isRunning && !isPaused
                            ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                >
                    {getButtonIcon()}
                    {getButtonText()}
                </button>

                {isRunning && (
                    <button
                        onClick={handleReset}
                        className="px-4 py-3 rounded-xl font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all flex items-center gap-2"
                        title="Réinitialiser"
                    >
                        <RotateCcw size={20} />
                    </button>
                )}
            </div>

            {/* Indicateur d'état */}
            <div className="text-center">
                {!isRunning && (
                    <p className="text-sm text-slate-500">Cliquez sur "Début" pour démarrer</p>
                )}
                {isRunning && !isPaused && (
                    <p className="text-sm text-yellow-600 font-medium">⏸️ Pause en cours...</p>
                )}
                {isPaused && (
                    <p className="text-sm text-blue-600 font-medium">⏯️ En pause</p>
                )}
            </div>
        </div>
    );
};

export default TimerCardDebut;