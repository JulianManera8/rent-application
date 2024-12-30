/* eslint-disable react/prop-types */
import { getGroups } from "./getGroupData"
import { useEffect, useState } from "react"
import { Skeleton } from "../../ui/skeleton"


export default function GroupQuantity({ userId }) {
    const [groupInfo, setGroupInfo] = useState([])
    const [loading, setLoading] = useState(true)
    const [showSkeleton, setShowSkeleton] = useState(true)

    useEffect(() => {

        (async () => {
            if (userId) {
                setLoading(true)
                const data = await getGroups(userId);
                if (data) {
                    setGroupInfo(data)
                }
                setLoading(false)
            }
        })()

    }, [userId])

    useEffect(() => {
        if (!loading) {
            setTimeout(() => {
                setShowSkeleton(false)
            }, 2000);
        }
    }, [loading])

    return (
        <h1 className="flex items-center gap-x-3"> Grupos:
            {loading || showSkeleton ? (
                <div className="flex items-center">
                    <Skeleton className="w-20 h-4 bg-zinc-200"/> 
                </div>
            ) : (
                <>
                    {groupInfo.length === 0 
                        ? <span className="text-md ml-2 text-zinc-600 font-normal"> No hay grupos creados</span> 
                        : 
                            <>
                            <p className="text-blue-400 font-medium"> {groupInfo.length}</p>
                            </>
                    }
                </>
            )}
        </h1>
    )
}



