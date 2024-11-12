import AddBalance from "../components/balances/AddBalance"


export default function CreateDeptoPage() {
    return (
        <div className="flex flex-col w-full mr-14 ">
            <div className="flex items-center mt-8 justify-between ">
                <h1 className="text-3xl text-gray-300 font-extrabold font-inter"> DASHBOARD - Agregar Nuevo Balance </h1>
            </div>
            <AddBalance />
        </div>
    )
}