const Collab = () => {
    return (
        <div
            className="bg-gray-200 border-2 border-blue-950 flex flex-col gap-2 p-2 w-4/5 md:w-3/5 rounded-xl ml-2 mr-2">
            <p className="text-xl text-blue-950 font-bold "> Collaborateurs</p>
            <div className="flex flex-row md:gap-15 py-2 md:justify-center justify-between ">
                <img className="w-10 h-10 rounded-full bg-white border-2 border-gray-500"/>
                <img className="w-10 h-10 rounded-full bg-white border-2 border-gray-500"/>
                <img className="w-10 h-10 rounded-full bg-white border-2 border-gray-500"/>
                <img className="w-10 h-10 rounded-full bg-white border-2 border-gray-500"/>
                <img className="w-10 h-10 rounded-full bg-white border-2 border-gray-500"/>
                <img className="w-10 h-10 rounded-full bg-white border-2 border-gray-500"/>
            </div>

        </div>
    )
}

export default Collab;
