const Absences =() =>{
    return(
        <div className="bg-gray-200 flex h-70 w-60 flex-col gap-3 p-4 rounded-xl border-black border-2">
            <p className="text-blue-950 text-xl font-bold mt-2"> Dernières absences </p>
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

export default Absences;