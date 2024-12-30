/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { DollarSign } from 'lucide-react'
import { getDeptos } from "./getPropertyData"
import { useEffect, useState } from "react"
import { Skeleton } from "../../ui/skeleton"
import { getGroups } from "../groupSection/getGroupData"


export default function PropTotalIncome({ userId }) {
    const [deptoInfo, setDeptoInfo] = useState([])
    const [loading, setLoading] = useState(true)
    const [showSkeleton, setShowSkeleton] = useState(true)
    const [totalIncome, setTotalIncome] = useState(null)

    useEffect(() => {
        (async () => {
            if (userId) {
                setLoading(true)
                const deptos = await getDeptos(userId);
                const grupos = await getGroups(userId);
                if (deptos && grupos) {
                    filterMyDeptos(deptos, grupos)
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

    function filterMyDeptos(deptos, grupos) {
        const myGruposIds = grupos.map(g => g.id)
        const myDeptos = deptos.filter(depto => myGruposIds.includes(depto.grupo_id))
        setDeptoInfo(myDeptos)

        getTotalIncome(myDeptos)
    }

    function getTotalIncome(deptos) {
        const cobros = deptos.map( depto => {return depto.monto_cobro})
        const total = cobros.reduce((monto, acc)=> acc + monto, 0)
        setTotalIncome(formatNumber(total))
    }

    function formatNumber(num) {
        return new Intl.NumberFormat('es-AR').format(num);
    }


    return (
        <Card className="border-1 shadow-md shadow-black/15 border-[0.6px] border-t-[1px] min-h-[100px] h-full flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-start w-full space-y-0 py-2">
                <CardTitle className="text-lg font-medium text-left w-full">
                    Total ingreso mensual
                </CardTitle>
                <DollarSign className="h-6 w-6 text-muted-foreground" />            
            </CardHeader>
            <CardContent className="flex flex-col justify-between">
                {loading || showSkeleton ? (
                    <>
                        <span className="text-lg text-zinc-200 font-normal mb-2"> <Skeleton className="w-28 h-4 bg-zinc-200"/> </span> 
                    </>
                ) : (
                    <>
                        {deptoInfo.length === 0 
                            ? <span className="text-md text-zinc-600 font-normal mb-2">No hay propiedades</span> 
                            : <span className="text-2xl text-blue-400 font-medium mb-2">$ {totalIncome}</span>}
                    </>
                )}
            </CardContent>
        </Card>
    )
}



