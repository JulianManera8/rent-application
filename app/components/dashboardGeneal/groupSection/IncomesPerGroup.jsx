/* eslint-disable react/prop-types */

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Progress } from "../../ui/progress"
import { CircleDollarSignIcon } from 'lucide-react'
import { useEffect, useState } from "react"
import { getDeptos, getGroups } from "./getGroupData"
import { Skeleton } from "../../ui/skeleton"

export default function IncomesPerGroups({ userId }) {
    const [groupInfo, setGroupInfo] = useState([])
    const [deptosInfo, setDeptosInfo] = useState([])
    const [distribucionDeptos, setDistribucionDeptos] = useState([])
    const [loading, setLoading] = useState(true)
    const [showSkeleton, setShowSkeleton] = useState(true)

    useEffect(() => {
        async function getData() {
            if (userId) {
                setLoading(true)
                const dataGroups = await getGroups(userId);
                dataGroups && setGroupInfo(dataGroups)
                
                const dataDeptos = await getDeptos(userId)
                dataDeptos && setDeptosInfo(dataDeptos)
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

    useEffect(() => {
        if (groupInfo.length > 0 && deptosInfo.length > 0) {
            const deptosByGroup = groupInfo.map(grupo => ({
                grupo: grupo.grupo_name,
                departamentos: deptosInfo.filter(depto => depto.grupo_id === grupo.id)
            }))

            const distribucion = calcularDistribucionDepartamentos(deptosByGroup)
            setDistribucionDeptos(distribucion)
        }
    }, [groupInfo, deptosInfo])

    function calcularDistribucionDepartamentos(deptosByGroup) {
        const totalPorGrupo = deptosByGroup.map(grupo => {
            const totalGrupo = grupo.departamentos.reduce((acc, depto) => acc + depto.monto_cobro, 0)
            return totalGrupo
        })

        const totalIngresos = totalPorGrupo.reduce((acc, grupo) => acc + grupo, 0)

        return deptosByGroup.map(grupo => {
            const valorIngresoProgress = totalIngresos > 0 
                ? (grupo.departamentos.reduce((acc, depto) => acc + depto.monto_cobro, 0) / totalIngresos) * 100 
                : 0;

            return {
                grupo: grupo.grupo,
                departamentos: new Intl.NumberFormat('es-AR').format(grupo.departamentos.reduce((acc, depto) => acc + depto.monto_cobro, 0)),
                valorIngresoProgress: valorIngresoProgress.toFixed(0) + "%"
            };
        });
    }

    return (
        <Card className="border-1 shadow-md shadow-black/15 border-[0.6px] border-t-[1px] md:w-[400px] w-full flex flex-col justify-evenly">
            <CardHeader className="flex flex-row items-center md:mb-2 mb-2 justify-start w-full space-y-0 py-1 h-1/3">
                <CardTitle className="md:text-lg text-md font-medium text-left w-full">
                    {loading ? <Skeleton className="w-48 h-5 mt-1 bg-zinc-200"/> : 'Distribucion de Ingresos por Grupo'}
                </CardTitle>
                <CircleDollarSignIcon className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
                {loading || showSkeleton ? (
                    Array(3).fill(0).map((_, i) => (
                        <div className="flex items-center text-sm gap-x-3 w-full" key={i}>
                            <Skeleton className="w-3/5 h-4 bg-zinc-200"/>
                            <Skeleton className="w-4/5 h-4 bg-zinc-200"/>
                            <Skeleton className="w-[36%] h-4 bg-zinc-200"/>
                        </div>
                    ))
                ) : distribucionDeptos?.length > 0 ? (
                    distribucionDeptos?.map((grupo, i) => (
                        <div className="flex items-center text-sm gap-x-3 w-full" key={i}>
                            <span className="w-3/5 text-zinc-600 font-normal overflow-hidden whitespace-nowrap text-ellipsis">{grupo?.grupo}</span> 
                            <Progress className="w-4/5 text-blue-400" colorProgress="#2798f5" value={parseInt(grupo?.valorIngresoProgress)} /> 
                            <span className="w-[36%] text-blue-400 font-medium flex-row flex items-center text-xs">$ {grupo?.departamentos}</span>
                        </div>
                    ))
                ) : (
                    <p>No hay grupos creados</p>
                )}
            </CardContent>
        </Card>
    )
}

