
const Card_manager =() => {
    return (
        <div className="bg-gray-200 rounded-2xl border-black justify-between w-full border-2 p-2">
            <h2 className="text-2xl font-bold text-blue-950 mb-4">Manager de l'équipe</h2>
            <div className="flex flex-row items-center border-2 w-full justify-center gap-20   border-black p-5 rounded-lg hover:bg-gray-50 transition">
                <img className="w-25 h-25   rounded-full bg-white border-2 justify-center  border-gray-500" />
                <div className ="flex flex-col justify-center">
                    <p className="font-l font-bold text-gray-800">Nom Prénom</p>
                    <p className="text-sm text-gray-500">email@domaine.com</p>
                    <p className="text-sm text-gray-500">06.00.00.00.00</p>
                    <p className="text-gray-600 text-sm"> Poste </p>
                </div>
            </div>
        </div>
    )
}

export default Card_manager;
