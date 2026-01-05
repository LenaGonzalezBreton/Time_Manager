import {useState, useEffect} from "react";

const TimerCardPause = () => {
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
        <div className="flex flex-col gap-7 p-5 rounded-xl border-2 border-black h-full mt-4 w-2/3 md:w-1/3">
            <div className="flex flex-col items-center">
                <p className="text-gray-600 text-xl w-8/10"> Vos horaires sont :</p>
                <p className="text-gray-600 w-8/10"> HH:MM début - HH:MM fin</p>
            </div>
            <div className="bg-white border-2 rounded-xl border-blue-950 p-3">
                <p className=" text-gray-800 text-5xl"> {time.toLocaleTimeString("fr-FR", {hour12: false})} </p>
            </div>
            <div className="flex flexrow justify-center">
                <button
                    className=" w-2/3 !bg-blue-950 hover:!bg-blue-600 justify-center active:scale-95 transition transform duration-150 ease-out">
                    Fin de pause
                </button>

            </div>
        </div>


    )
}
export default TimerCardPause;