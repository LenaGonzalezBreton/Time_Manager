import {LucideCoffee} from "lucide-react";
import {useState, useEffect} from "react";

const TimerCardInProgress = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        // Met à jour l’heure chaque seconde
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        // Nettoyage du timer quand le composant est démonté
        return () => clearInterval(timer);
    }, []);
    return (
        <div className="flex flex-col gap-8 border-2 border-black p-3 w-2/3 md:w-2/5 h-full rounded-xl">
            <div className="flex flex-col items-center">
                <p className="text-gray-600 text-xl w-8/10"> Vos horaires sont :</p>
                <p className="text-gray-600 w-8/10"> HH:MM début - HH:MM fin</p>
            </div>
            <div className="bg-white border-2 rounded-xl border-blue-950 p-3">
                <p className=" text-gray-800 text-5xl"> {time.toLocaleTimeString("fr-FR", {hour12: false})}</p>
                <p className=" text-gray-800"> Temps de pause restant :</p>
                <p className=" text-gray-800"> HH:MM</p>
            </div>
            <div className="flex flexrow gap-4 justify-center">
                <button
                    className="!bg-white !border-2 w-2/5 justify-center !border-black text-black hover:!bg-gray-400 active:scale-95 transition transform duration-150 ease-out flex flex-row gap-2">
                    <LucideCoffee/> Pause
                </button>
                <button
                    className="!bg-blue-950 w-2/5 justify-center hover:!bg-blue-600 active:scale-95 transition transform duration-150 ease-out"> Terminer
                </button>

            </div>
        </div>


    )
}
export default TimerCardInProgress;