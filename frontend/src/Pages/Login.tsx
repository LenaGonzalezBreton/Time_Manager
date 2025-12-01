import logo from "../Images/Logo_mieux.png"

export default function Login() {
    return (
        <div className="w-screen h-screen  justify-center flex flex-col text-blue-950 bg-gray-300">
            <div className="flex items-center justify-center">
                <img src={logo} className="filter brightness-50 saturate-[180%] hue-rotate-[10deg]"/>
            </div>
            <div className="flex flex-col gap-5  justify-between items-center">
                <div className="flex flex-col  gap-3 justify-between h-1/10">
                    <h2 className="text-3xl font-semibold"> Connexion</h2>
                    <h3 className="text-2xl font-bold"> Bienvenue chez Tima</h3>
                </div>
                <div
                    className="md:w-1/4 justify-center flex flex-col bg-blue-300 rounded-2xl gap-2 p-3 border-2 border-blue-950">
                    <div className="flex flex-col justify-between gap-4">
                        <label htmlFor="email" className="font-bold text-xl"> Adresse mail </label>
                        <input className="bg-blue-950 p-1 pl-3 rounded-3xl placeholder-white  mr-1 ml-1 p-2 "
                               placeholder="exemple@domine.com"/>
                        <input className="bg-blue-950 p-1 pl-3 rounded-3xl placeholder-white  mr-1 ml-1  p-2"
                               type="password" id="password" placeholder="••••••••"/>
                        <div className="flex justify-between items-center text-sm text-gray-800 ml-1 mr-1">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="accent-blue-600"/>
                                Se souvenir de moi
                            </label>
                            <a href="#" className="!text-blue-850 hover:underline">Mot de passe oublié ?</a>
                        </div>
                    </div>
                    <button
                        className="mr-25 ml-25 text-white !bg-blue-950 hover:!bg-blue-600 active:scale-95 transition transform duration-150 ease-out"> Se
                        connecter
                    </button>
                    <label className=" "> Pas encore de compte? <a href="Inscris toi" className="!text-blue-850">Inscris
                        toi </a>
                    </label>
                </div>
            </div>

        </div>
    );
}

