import CreateDepto from "../components/propiedades/CreateDepto"
import { Separator } from "../components/ui/separator"


export default function CreateDeptoPage() {
    return (
        <div className="flex flex-col w-full mr-14 px-0 md:px-3">
            <div className="flex md:justify-between justify-center items-center">
                <h1 className='sm:text-3xl text-lg text-gray-300 font-medium font-inter mt-8 mx-0 mb-2'>
                    DASHBOARD - <span className='text-[#0c426bd3]'> Agregar Propiedad </span>{" "}  
                </h1>
            </div>
            <Separator />
            <CreateDepto />
        </div>
    )
}