/* eslint-disable react/prop-types */
import { getGroups } from "./getGroupData"
import { useEffect, useState } from "react"
import { Skeleton } from "../../ui/skeleton"


export default function GroupQuantity({ userId }) {
    const [groupInfo, setGroupInfo] = useState([])
    const [loading, setLoading] = useState(true)
    const [showSkeleton, setShowSkeleton] = useState(true)

    useEffect(() => {
        async function getData() {
            if (userId) {
                setLoading(true)
                const data = await getGroups(userId);
                if (data) {
                    setGroupInfo(data)
                }
                setLoading(false)
            }
        }
        getData();
    }, [userId])

    useEffect(() => {
        if (!loading) {
            setTimeout(() => {
                setShowSkeleton(false)
            }, 2000);
        }
    }, [loading])

    return (
        <>
            {loading || showSkeleton ? (
                <>
                    <span className="text-lg text-zinc-200 font-normal mb-2 -mt-3"> <Skeleton className="w-28 h-4 bg-zinc-200"/> </span> 
                </>
            ) : (
                <>
                    {groupInfo.length === 0 
                        ? <span className="text-md text-zinc-600 font-normal mb-2">No hay grupos creados</span> 
                        : 
                            <>
                            <span className="text-2xl text-blue-400 font-medium mb-2"> {groupInfo.length}</span>
                            </>
                    }
                </>
            )}
        </>
    )
}



