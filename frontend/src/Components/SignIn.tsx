import logo from "../Images/Logo_mieux.png"

const SignIn=()=> {
    return (
        <div className="flex flex-col text-blue-950 bg-gray-300 container ml-5 mr-5">
            <header className="flex items-center justify-center">
                <img src={logo} className="w-35 mx-auto mt-4 filter brightness-50 saturate-[180%] hue-rotate-[10deg]  " />
            </header>
            <div className="flex flex-col gap-5">
                <div className="flex flex-col justify-between h-20">
                    <h2 className = "text-3xl font-semibold"> Inscription</h2>
                    <h3 className = "text-2xl font-bold"> Créez votre compte Tima</h3>
                </div>
                <div className="bg-blue-300 rounded-2xl p-3 mr-5 ml-5 mt-1 mb-5 flex flex-col gap-3 border-3 border-blue-950">
                <div className= "flex flex-col justify-between h-55 mr-2 ml-2 gap-2">
                    <label htmlFor="email" className="font-bold text-xl" >Adresse mail </label>
                    <input type="email" id="email" className="bg-blue-950 p-1 pl-3 rounded-3xl placeholder-blue-300 !text-white mr-1 ml-1 border-3 border-black" placeholder="exemple@domaine.com"/>
                    <label className="font-bold text-xl" >Mot de passe </label>
                    <input type="password" id="password" className="bg-blue-950 p-1 pl-3 rounded-3xl placeholder-blue-300 !text-white mr-1 ml-1 border-3 border-black" placeholder="••••••••"/>
                    <label className="font-bold text-xl" >Confirmer le mot de passe </label>
                    <input type="password" id="confirm_password" className="bg-blue-950 p-1 rounded-3xl placeholder-blue-300 pl-2 !text-white mr-1 ml-1 border-3 border-black" placeholder="••••••••"/>

                </div>
                <button className="text-white ml-25 mr-25 mt-4 !bg-blue-950 hover:!bg-blue-600 active:scale-95 transition transform duration-150 ease-out"> S'inscrire </button>
                <label className="!text-blue-950"> Déjà inscrit ? <a href="Se connecter"> Se connecter </a></label>
            </div>
            </div>
        </div>

    )
}

export default SignIn;
