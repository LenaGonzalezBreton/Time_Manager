import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import horaireService, { type Horaire } from "../services/horaire.service";

const Calendrier = () => {
    const { user } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [schedules, setSchedules] = useState<Horaire[]>([]);
    const [loading, setLoading] = useState(false);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = currentDate.toLocaleString("fr-FR", { month: "long" });

    // Calcul du nombre de jours dans le mois
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Premier jour du mois (0 = dimanche, 1 = lundi, ..., 6 = samedi)
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    // Pour un calendrier français (Lun=0, Mar=1, ..., Dim=6)
    // Si getDay() retourne 0 (dimanche), on veut position 6
    // Si getDay() retourne 1 (lundi), on veut position 0
    // Si getDay() retourne 2 (mardi), on veut position 1, etc.
    const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    // Créer un tableau des jours (avec espace pour alignement)
    const daysArray = Array(offset).fill(null)
        .concat([...Array(daysInMonth).keys()].map((i) => i + 1));

    const changerMois = (delta: number) => {
        setCurrentDate(new Date(year, month + delta, 1));
    };

    useEffect(() => {
        if (user) {
            setLoading(true);
            horaireService.getByUser(user.id_utilisateur)
                .then(data => setSchedules(data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [user]);

    const getScheduleForDay = (day: number) => {
        // Create date in local timezone to avoid off-by-one errors
        const targetDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return schedules.find(s => {
            const scheduleDate = s.jour.split('T')[0]; // Get YYYY-MM-DD part
            return scheduleDate === targetDate;
        });
    };

    const getStatusColor = (schedule?: Horaire) => {
        if (!schedule) return "";
        // Example logic based on type. Adjust based on actual DB values.
        const type = schedule.type_horaire?.type.toLowerCase() || "";
        if (type.includes("télétravail")) return "bg-purple-500";
        if (type.includes("congé") || type.includes("vacance")) return "bg-green-500";
        if (type.includes("maladie")) return "bg-red-500";
        return "bg-blue-500"; // Standard work
    };

    return (
        <div className="p-6 bg-white rounded-2xl w-full max-w-lg border border-gray-200 shadow-sm">
            <div className="flex flex-row justify-between items-center mb-6">
                <button onClick={() => changerMois(-1)} className="hover:bg-gray-100 p-2 rounded-lg transition text-gray-700">◀</button>
                <h2 className="text-2xl font-bold text-gray-900 capitalize">{monthName} {year}</h2>
                <button onClick={() => changerMois(1)} className="hover:bg-gray-100 p-2 rounded-lg transition text-gray-700">▶</button>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
                {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
                    <div key={day} className="text-center text-sm font-semibold text-gray-600">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
                {daysArray.map((day, index) => {
                    const schedule = day ? getScheduleForDay(day) : null;
                    const statusColor = getStatusColor(schedule);
                    const isToday =
                        day &&
                        day === new Date().getDate() &&
                        month === new Date().getMonth() &&
                        year === new Date().getFullYear();

                    return (
                        <div
                            key={index}
                            className={`aspect-square flex items-center justify-center relative group ${day ? "hover:bg-gray-50" : ""
                                } rounded-lg transition`}
                        >
                            {day ? (
                                <>
                                    <span
                                        className={`text-sm ${isToday
                                                ? "bg-[#12171C] text-white font-bold rounded-full w-8 h-8 flex items-center justify-center"
                                                : "text-gray-700"
                                            }`}
                                    >
                                        {day}
                                    </span>
                                    {schedule && (
                                        <div className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${statusColor}`}></div>
                                    )}
                                    {/* Tooltip for schedule info */}
                                    {schedule && (
                                        <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-50">
                                            {schedule.type_horaire?.type || "Présentiel"}
                                            <br />
                                            {schedule.heure_arrivee ? new Date(schedule.heure_arrivee).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''} - {schedule.heure_depart ? new Date(schedule.heure_depart).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </div>
                                    )}
                                </>
                            ) : (
                                " "
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4 text-xs justify-center text-gray-600">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Présentiel</div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Télétravail</div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> Congé</div>
            </div>
        </div>
    );
};

export default Calendrier;