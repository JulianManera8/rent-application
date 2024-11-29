import { useUser } from '../../../hooks/use-user'
import GroupQuantity from './GroupQuantity'
import PropertiesPerGroups from "./PropertiesPerGroup"
import IncomesPerGroup from "./IncomesPerGroup"

export default function SectionGrupos() {
    const userLoged_id = useUser()

    return (
        <div>
            <h1 className="text-3xl font-medium text-[#0c426bd3] mb-3"> Grupos </h1>

            <div className="flex gap-10 flex-wrap">

                <div className=" space-y-4 flex flex-col md:w-[265px] w-full justify-between">
                    <GroupQuantity userId={userLoged_id}/>
                </div>
                
                <PropertiesPerGroups userId={userLoged_id}/>

                <IncomesPerGroup userId={userLoged_id}/>
                
                {/* <Card className="border-1 shadow-md shadow-black/15 relative border-[0.6px] border-t-[1px] md:w-[400px] w-full flex flex-col md:flex-row md:justify-evenly">
                    <div className="md:absolute md:top-0 md:left-0 md:w-56 w-full">
                        <h1 className="md:text-lg text-md  font-medium flex text-left p-3 w-full items-center justify-center">Distribucion de Ingresos por Grupo</h1>
                    </div>

                    <div className="md:w-3/5 md:ml-auto mx-auto md:mr-2">
                        <img src="/chart2.png" className="w-80 h-full" alt="chart" />
                    </div>
                </Card> */}
            </div>
        </div>
    )
}