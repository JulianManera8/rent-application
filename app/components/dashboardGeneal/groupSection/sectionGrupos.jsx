/* eslint-disable react/prop-types */
import GroupQuantity from './GroupQuantity'
import PropertiesPerGroups from "./PropertiesPerGroup"
import IncomesPerGroup from "./IncomesPerGroup"

export default function SectionGrupos({userId}) {

    return (
        <div>
            <div className=" flex flex-row items-center text-3xl font-medium text-[#0c426bd3] mb-3"> 
                <GroupQuantity userId={userId}/>
            </div>

            <div className="flex gap-10 flex-wrap">
                
                <PropertiesPerGroups userId={userId}/>

                <IncomesPerGroup userId={userId}/>

            </div>
        </div>
    )
}