
const Card_employe =() => {
    return (
        <div className="bg-gray-200 rounded-2xl justify-between w-full p-1">
            <div className="flex items-center border-2 w-full justify-between border-black p-4 rounded-lg hover:bg-gray-50 transition">
                <img className="w-10 h-10   rounded-full bg-white border-2 justify-center  border-gray-500" />
                <div>
                    <p className="font-medium text-gray-800">Nom prénom</p>
                    <p className="text-sm text-gray-500">ludovic.cruchaud@domaine.com|06.60.26.90.50</p>
                </div>
                <div className="text-gray-600 text-sm"> Poste </div>

            </div>
            <div className="flex items-center gap-4">

            </div>
        </div>
    )
}

export default Card_employe;
