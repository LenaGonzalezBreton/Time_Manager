import logo from "../Images/Logo_mieux.png"

export default function Inscription() {
    return (
        <div className="w-screen h-screen  justify-center flex flex-col text-blue-950 bg-gray-300">
            <div className="flex items-center justify-center">
                <img src={logo} className="filter brightness-50 saturate-[180%] hue-rotate-[10deg]"/>
            </div>
            <div className="flex flex-col gap-5 justify-between items-center">
                <div className="flex flex-col  gap-3 justify-between h-1/10">
                    <h2 className="text-3xl font-semibold"> Inscription</h2>
                    <h3 className="text-2xl font-bold"> Bienvenue chez Tima</h3>
                </div>
                <div className="bg-blue-300 rounded-2xl p-3 flex flex-col gap-12 border-3 border-blue-950">
                    <div className="flex flex-col justify-between h-55 mr-2 ml-2 gap-3">
                        <label htmlFor="email" className="font-bold text-xl">Adresse mail </label>
                        <input type="email" id="email"
                               className="bg-blue-950 p-1 pl-3 rounded-3xl placeholder-white !text-white mr-1 ml-1 p-2"
                               placeholder="exemple@domaine.com"/>
                        <label className="font-bold text-xl">Mot de passe </label>
                        <input type="password" id="password"
                               className="bg-blue-950 p-1 pl-3 rounded-3xl placeholder-white !text-white mr-1 ml-1 p-2"
                               placeholder="••••••••"/>
                        <label className="font-bold text-xl">Confirmer le mot de passe </label>
                        <input type="password" id="confirm_password"
                               className="bg-blue-950 p-1 rounded-3xl placeholder-white pl-2 !text-white mr-1 ml-1 p-2"
                               placeholder="••••••••"/>

                    </div>
                    <div className="flex flex-col gap-2">
                        <button
                            className="text-white ml-25 mr-25 mt-4 !bg-blue-950 hover:!bg-blue-600 active:scale-95 transition transform duration-150 ease-out"> S'inscrire
                        </button>
                        <label className="!text-blue-950"> Déjà inscrit ? <a href="Se connecter"> Se
                            connecter </a></label>
                    </div>
                </div>
            </div>
        </div>

    )
}
