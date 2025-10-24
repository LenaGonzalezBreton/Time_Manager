const MonEquipe =() =>{
    return(
        <div className="bg-gray-200 flex flex-col h-70 w-60 p-4 justify-between rounded-xl border-black border-2">
            <label className="text-blue-950 text-xl font-bold">Mon équipe</label>
            <div className="flex flex-col gap-5  mb-5">
                <div className="flex flex-row justify-between">
                    <img className="w-10 h-10 rounded-full bg-white border-2 border-gray-500" />
                    <img className="w-10 h-10 rounded-full bg-white border-2 border-gray-500" />
                    <img className="w-10 h-10 rounded-full bg-white border-2 border-gray-500" />
                </div>
                <div className="flex flex-row justify-between">
                    <img className="w-10 h-10 rounded-full bg-white border-2 border-gray-500" />
                    <img className="w-10 h-10 rounded-full bg-white border-2 border-gray-500" />
                    <img className="w-10 h-10 rounded-full bg-white border-2 border-gray-500" />
                </div>
                <div className="flex flex-row justify-between">
                    <img className="w-10 h-10 rounded-full bg-white border-2 border-gray-500" />
                    <img className="w-10 h-10 rounded-full bg-white border-2 border-gray-500" />
                    <img className="w-10 h-10 rounded-full bg-white border-2 border-gray-500" />
                </div>

            </div>
        </div>

    )
}
export default MonEquipe;