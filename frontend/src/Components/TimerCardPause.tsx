import { useState, useEffect } from "react";
const TimerCardPause=() => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        // Met à jour l’heure chaque seconde
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        // Nettoyage du timer quand le composant est démonté
        return () => clearInterval(timer);
    }, []);
    return(
        <div className="flex flex-col gap-8 border-2 border-black p-8 rounded-xl">
            <div className="flex flex-col items-center" >
                <p className ="text-gray-600 text-xl"> Vos horaires sont :</p>
                <p className ="text-gray-600"> HH:MM début - HH:MM fin</p>
            </div>
            <div className="bg-white border-2 rounded-xl border-blue-950 p-1">
                <p className=" text-gray-800 text-5xl"> HH:MM</p>
                <p className=" text-gray-800"> Heure actuelle :</p>
                <p className=" text-gray-800"> {time.toLocaleTimeString("fr-FR", { hour12: false })}</p>
            </div>
            <div className="flex flexrow justify-center">
                <button className="!bg-blue-950 hover:!bg-blue-600 active:scale-95 transition transform duration-150 ease-out"> Fin de pause  </button>

            </div>
        </div>


    )
}
export default TimerCardPause;