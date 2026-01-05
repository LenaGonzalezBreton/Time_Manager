import logo from "../Images/Logo_mieux.png"

function Login() {
    return (
        <div className="flex flex-col text-blue-950 bg-gray-300 container ml-5 mr-5">
            <header className="flex items-center justify-center">
                <img src={logo} className="w-35 mx-auto mt-4 filter brightness-50 saturate-[180%] hue-rotate-[10deg]"/>
            </header>
            <div className="flex flex-col">
                <div className="flex flex-col justify-between h-20">
                    <h2 className = "text-3xl font-semibold"> Connexion</h2>
                    <h3 className = "text-2xl font-bold"> Bienvenue chez Tima</h3>
                </div>
                <div className =" flex flex-col bg-blue-300 rounded-2xl gap-2 p-3 mr-5 ml-5 mb-4 mt-5 border-2 border-blue-950">
                    <div className= "flex flex-col justify-between h-40 mr-3 ml-3 mb-4 gap-4">
                        <label htmlFor="email" className="font-bold text-xl" > Adresse mail </label>
                        <input className="bg-blue-950 p-1 pl-3 rounded-3xl placeholder-blue-300 !text-white mr-1 ml-1 border-black border-3" placeholder="exemple@domine.com"/>
                        <input className="bg-blue-950 p-1 pl-3 rounded-3xl placeholder-blue-300 !text-white mr-1 ml-1 border-black border-3" type="password" id="password" placeholder="••••••••"/>
                        <div className="flex justify-between items-center text-sm text-gray-800 ml-1 mr-1">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="accent-blue-600"/>
                                Se souvenir de moi
                            </label>
                            <a href="#" className="!text-blue-800 hover:underline">Mot de passe oublié ?</a>
                        </div>
                    </div>
                    <button className="mr-25 ml-25 text-white !bg-blue-950 hover:!bg-blue-600 active:scale-95 transition transform duration-150 ease-out"> Se connecter</button>
                    <label className="mb-1 "> Pas encore de compte? <a href="Inscris toi" className="!text-blue-950">Inscris toi </a>
                    </label>
                </div>
            </div>
        </div>
    );
}

export default Login;
