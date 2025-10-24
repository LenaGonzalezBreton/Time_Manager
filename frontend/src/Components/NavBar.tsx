// @ts-ignore
import logo from "../Images/Logo_mieux.png"
import {House, Handshake, Calendar, ChartColumn, Settings, LogOut} from "lucide-react";
const NavBar = () => {
    return (
        <aside className="text-xs flex flex-col justify-between h-screen bg-gray-400 p-3">
            <div>
                <img src={logo} className="w-30 mx-auto filter brightness-50 saturate-[180%] hue-rotate-[10deg] mb-5"/>
                <div className="bg-blue-300 p-2 rounded-xl border-3 border-black flex flex-col justify-between">
                    <h2 className="!text-xl mb-4 text-blue-950 font-bold ">Main</h2>
                    <nav className="flex flex-col gap-4 ">
                        <a href="#" className="flex items-center bg-blue-950 px-1 py-2 gap-3 rounded-xl !text-white hover:bg-blue-600 active:scale-95 transition transform duration-150 ease-out">
                        <House className= "text-blue-300 mr-1 ml-1 size-4"/>
                        Dashboard
                        </a>
                        <a href="#" className="flex items-center gap-3 bg-blue-950 px-1 py-2 rounded-xl !text-white hover:bg-blue-600 active:scale-95 transition transform duration-150 ease-out">
                        <Handshake className= "text-blue-300 mr-1 ml-1 size-4"/>
                        Équipe
                        </a>
                        <a href="#" className="flex items-center gap-3 bg-blue-950 px-1 py-2 rounded-xl !text-white hover:bg-blue-600 active:scale-95 transition transform duration-150 ease-out">
                        <Calendar className= "text-blue-300 mr-1 ml-1 size-4"/>
                        Calendrier
                        </a>
                        <a href="#" className="flex items-center gap-3 bg-blue-950 px-1 py-2 rounded-xl !text-white hover:bg-blue-600 active:scale-95 transition transform duration-150 ease-out">
                        <ChartColumn className= "text-blue-300 mr-1 ml-1 size-4"/>
                        Statistique
                        </a>
                    </nav>
                </div>
            </div>

            <div  className="bg-blue-300 p-3 rounded-xl border-3  border-black">
                <h3 className="!text-xl mb-4 text-blue-950  font-bold">Compte</h3>
                <nav className="flex flex-col gap-3">
                    <a href="#" className="flex items-center gap-2  !text-white bg-blue-950 px-1 py-2 rounded-xl font-semibold hover:bg-blue-600 active:scale-95 transition transform duration-150 ease-out">
                        <Settings className= "text-blue-300 mr-1 ml-1 size-4"/>
                        Paramètres
                    </a>
                    <a href="#" className="flex items-center gap-3 !text-white bg-blue-950 px-1 py-2 rounded-xl hover:bg-blue-600 active:scale-95 transition transform duration-150 ease-out">
                        <LogOut className= "text-blue-300 mr-1 ml-1 size-4"/>
                        Sign-out
                    </a>
                </nav>
            </div>
        </aside>


    )
}
export default NavBar;