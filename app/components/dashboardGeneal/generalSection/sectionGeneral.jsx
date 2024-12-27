/* eslint-disable react/prop-types */
import EndContract from './endContract'

export default function SectionGrupos({userId}) {

    return (
        <div className='w-full'>
            <h1 className="text-3xl font-medium text-[#0c426bd3] mb-3"> General </h1>

            <div className="flex gap-10 flex-wrap w-full">
                
                <EndContract userId={userId}/>

            </div>
        </div>
    )
}