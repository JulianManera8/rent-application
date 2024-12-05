import CreateDepto from "../components/propiedades/CreateDepto"
import { Separator } from "../components/ui/separator"


export default function CreateDeptoPage() {
    return (
        <div className="flex flex-col w-full mr-14 px-0 md:px-3">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 gap-x-8">
                <h1 className="text-md sm:text-3xl text-gray-300 font-medium font-inter">
                    DASHBOARD - <span className='text-[#0c426bd3]'> Agregar Propiedad </span>{" "}  
                </h1>
            </div>
            <Separator />
            <CreateDepto />
        </div>
    )
}