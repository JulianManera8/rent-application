/* eslint-disable react/prop-types */
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Boxes } from 'lucide-react'
import { getDeptos } from "./getPropertyData"
import { useEffect, useState } from "react"
import { Skeleton } from "../../ui/skeleton"


export default function PropQuantity({ userId }) {
    const [deptoInfo, setDeptoInfo] = useState([])
    const [loading, setLoading] = useState(true)
    const [showSkeleton, setShowSkeleton] = useState(true)

    useEffect(() => {
        async function getData() {
            if (userId) {
                setLoading(true)
                const data = await getDeptos(userId);
                if (data) {
                    setDeptoInfo(data)
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
        <Card className="border-1 shadow-md shadow-black/15 border-[0.6px] border-t-[1px] min-h-[100px] h-full flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-start w-full space-y-0 py-2">
                <CardTitle className="text-lg font-medium text-left w-full">
                    Propiedades Cargadas
                </CardTitle>
                <Boxes className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col justify-between">
                {loading || showSkeleton ? (
                    <>
                        <span className="text-lg text-zinc-200 font-normal mb-2"> <Skeleton className="w-28 h-4 bg-zinc-200"/> </span> 
                    </>
                ) : (
                    <>
                        {deptoInfo.length === 0 
                            ? <span className="text-lg text-zinc-600 font-normal mb-2">No hay propiedades</span> 
                            : <span className="text-2xl text-blue-400 font-medium mb-2">{deptoInfo.length}</span>}
                    </>
                )}
            </CardContent>
        </Card>
    )
}

