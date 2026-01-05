import { useState } from "react";

export default function Calendrier() {
    const [date, setDate] = useState(new Date());

    // Obtenir infos du mois
    const year = date.getFullYear();
    const month = date.getMonth(); // 0 = janvier
    const monthName = date.toLocaleString("fr-FR", { month: "long" });

    // Calcul du nombre de jours dans le mois
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Premier jour du mois (0 = dimanche, 1 = lundi, ...)
    const firstDay = new Date(year, month, 1).getDay();

    // Créer un tableau des jours (avec espace pour alignement)
    const daysArray = Array(firstDay === 0 ? 6 : firstDay - 1).fill(null)
        .concat([...Array(daysInMonth).keys()].map((i) => i + 1));

    const changerMois = (delta) => {
        setDate(new Date(year, month + delta, 1));
    };

    return (
        <div className="p-5 bg-gray-500 rounded-2xl w-120">
            <div className="flex flex-row justify-between items-center mb-4">
                <button onClick={() => changerMois(-1)}>◀</button>
                <button onClick={() => setDate(new Date())}> Aujourd'hui </button>
                <h2 className="text-lg font-semibold capitalize">
                    {monthName} {year}
                </h2>
                <button onClick={() => changerMois(1)}>▶</button>
            </div>

            <div className="grid grid-cols-7 text-center font-semibold border-b pb-1">
                {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                    <div key={i}>{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 text-center mt-2 gap-y-2">
                {daysArray.map((day, i) => (
                    <div key={i} className="h-7 flex justify-center items-center">
                        {day ? (
                            <span
                                className={`${
                                    day === new Date().getDate() &&
                                    month === new Date().getMonth() &&
                                    year === new Date().getFullYear() 
                                        ? "bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                                        : ""
                                }`}
                            >
                {day}
              </span>
                        ) : (
                            ""
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}