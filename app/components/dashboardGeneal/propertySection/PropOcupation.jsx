/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { UserRoundCheckIcon } from 'lucide-react'
import { getDeptos } from "./getPropertyData"
import { useEffect, useState } from "react"
import { Skeleton } from "../../ui/skeleton"


export default function PropOcupation({ userId }) {
    const [deptoInfo, setDeptoInfo] = useState([])
    const [loading, setLoading] = useState(true)
    const [showSkeleton, setShowSkeleton] = useState(true)
    const [totalOcupation, setTotalOcupation] = useState(null)
    const [totalDeptos, setTotalDeptos] = useState(null)
    const [totalOcupationRate, setTotalOcupationRate] = useState(null)

    useEffect(() => {
        async function getData() {
            if (userId) {
                setLoading(true)
                const data = await getDeptos(userId);
                if (data) {
                    setDeptoInfo(data)
                    setTotalDeptos(data.length)
                    getOcupationRate(data)
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

    function getOcupationRate(deptos) {
        const ocupadosArr = deptos.map( depto => {return depto.ocupado})

        const ocupados = ocupadosArr.filter( estado => estado !== false )

        setTotalOcupation( (ocupados.length ) )
        setTotalDeptos(ocupadosArr.length)
        setTotalOcupationRate( ((ocupados.length * 100) / ocupadosArr.length ).toFixed(0) )
    }


    return (
        <Card className="border-1 shadow-md shadow-black/15 border-[0.6px] border-t-[1px] min-h-[100px] min-w-72 h-full flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-start w-full space-y-0 py-2">
                <CardTitle className="text-lg font-medium text-left w-full">
                    Porcentaje de ocupación
                </CardTitle>
                <UserRoundCheckIcon className="h-6 w-6 text-muted-foreground" />            
            </CardHeader>
            <CardContent className="flex flex-col justify-between">
                {loading || showSkeleton ? (
                    <>
                        <span className="text-lg text-zinc-200 font-normal mb-2"> <Skeleton className="w-28 h-4 bg-zinc-200"/> </span> 
                    </>
                ) : (
                    <div className="flex justify-between items-center">
                        {deptoInfo.length === 0 
                            ? <span className="text-md text-zinc-600 font-normal mb-2">No hay propiedades</span> 
                            : (
                                <>
                                    <span className="text-2xl text-blue-400 font-medium mb-2"> {totalOcupationRate} % </span>
                                    {totalOcupation && <span className="text-lg text-blue-400 font-normal mb-2"> {totalOcupation} / {totalDeptos} ocupados </span>}
                                </>
                            )
                        }
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

                    {/* <Card className="border-1 shadow-md shadow-black/15 border-[0.6px] border-t-[1px] md:w-[275px] w-full h-2/5 flex flex-col justify-between">
                        <CardHeader className="flex flex-row items-center justify-start w-full md:mb-auto mb-2 space-y-0 py-2">
                            <CardTitle className="md:text-lg text-md font-medium text-left w-full"> </CardTitle>
                            <UserRoundCheckIcon className="h-6 w-6 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="flex flex-row items-center gap-x-3">
                            <span className="text-md font-medium text-zinc-500"> 87% </span>
                            <span className="text-xs font-medium text-zinc-400"> 14 / 16 propiedades ocupadas</span>
                        </CardContent>
                    </Card> */}

