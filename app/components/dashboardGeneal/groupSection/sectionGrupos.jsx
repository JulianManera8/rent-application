import { useUser } from '../../../hooks/use-user'
import GroupQuantity from './GroupQuantity'
import PropertiesPerGroups from "./PropertiesPerGroup"
import IncomesPerGroup from "./IncomesPerGroup"

export default function SectionGrupos() {
    const userLoged_id = useUser()

    return (
        <div>
            <h1 className="text-3xl font-medium text-[#0c426bd3] mb-3"> 
                Grupos: 
                <GroupQuantity userId={userLoged_id}/>
            </h1>

            <div className="flex gap-10 flex-wrap">
                
                <PropertiesPerGroups userId={userLoged_id}/>

                <IncomesPerGroup userId={userLoged_id}/>

            </div>
        </div>
    )
}