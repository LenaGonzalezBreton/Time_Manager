const Retards = () => {
    return (
        <div className="bg-gray-200 flex flex-col h-full md:w-1/4 w-2/3 gap-3 p-3 rounded-xl border-black border-2">
            <p className="text-blue-950 text-2xl font-bold">Derniers retards</p>
            <ul className="flex flex-col gap-3 h-2/3">
                <li className="text-blue-950 bg-white rounded-2xl w-full p-2 ">
                    <div className="flex flexrow justify-between">
                        <label>
                            Date
                        </label>
                        <label>
                            Type
                        </label>
                    </div>
                </li>
                <li className="text-blue-950 bg-white rounded-2xl w-full p-2">
                    <div className="flex flexrow justify-between">
                        <label>
                            Date
                        </label>
                        <label>
                            Type
                        </label>
                    </div>
                </li>
                <li className="text-blue-950 bg-white rounded-2xl w-full p-2">
                    <div className="flex flexrow justify-between">
                        <label>
                            Date
                        </label>
                        <label>
                            Type
                        </label>
                    </div>
                </li>
                <li className="text-blue-950 bg-white rounded-2xl w-full p-2">
                    <div className="flex flexrow justify-between">
                        <label>
                            Date
                        </label>
                        <label>
                            Type
                        </label>
                    </div>
                </li>


            </ul>

        </div>
    )
}
export default Retards;