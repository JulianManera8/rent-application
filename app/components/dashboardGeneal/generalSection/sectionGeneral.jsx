import { useUser } from '../../../hooks/use-user'
import EndContract from './endContract'

export default function SectionGrupos() {
    const userLoged_id = useUser()

    return (
        <div>
            <h1 className="text-3xl font-medium text-[#0c426bd3] mb-3"> General </h1>

            <div className="flex gap-10 flex-wrap">
                
                <EndContract userId={userLoged_id}/>

            </div>
        </div>
    )
}