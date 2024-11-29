import {Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Progress } from "../../ui/progress"
import { Building2Icon } from 'lucide-react'
import { useEffect, useState } from "react"
import { getDeptos, getGroups } from "./getGroupData"


export default function PropertiesPerGroups(userLoged_id) {
    const [groupInfo, setGroupInfo] = useState([])
    const [deptosInfo, setDeptosInfo] = useState([])
    const [distribucionDeptos, setDistribucionDeptos] = useState()
    const [totalDeptos, setTotalDeptos] = useState(0)

    useEffect(() => {
        async function getData() {
            if(userLoged_id.userId) {
                const dataGroups = await getGroups(userLoged_id.userId);
                dataGroups && setGroupInfo(dataGroups)
                
                const dataDeptos = await getDeptos(userLoged_id.userId)
                dataDeptos && setDeptosInfo(dataDeptos)
            }
        }
        getData();
    }, [userLoged_id])

    useEffect(() => {
        if(groupInfo.length > 0 && deptosInfo.length > 0) {
            const deptosByGroup = groupInfo.map( grupo => ({
                grupo: grupo.grupo_name,
                deptos: deptosInfo.filter(depto => depto.grupo_id === grupo.id).length
            }))

            const distrubucion = calcularDistribucionDepartamentos(deptosByGroup)
            setDistribucionDeptos(distrubucion)
        }

    }, [groupInfo, deptosInfo])

    function calcularDistribucionDepartamentos(deptosByGroup) {

        const totalDepartamentos = deptosByGroup.reduce((acumulador, grupo) => acumulador + grupo.deptos, 0)
        setTotalDeptos(totalDepartamentos)

        return deptosByGroup.map(grupo => {
            const porcentaje = totalDepartamentos > 0 
                ? (grupo.deptos / totalDepartamentos) * 100 
                : 0;

            return {
                grupo: grupo.grupo,
                departamentos: grupo.deptos,
                porcentaje: porcentaje.toFixed(0) + "%"
            };
        });
    }

    console.log(distribucionDeptos)

    return (
        <Card className="border-1 shadow-md shadow-black/15 border-[0.6px] border-t-[1px] md:w-[400px] w-full flex flex-col justify-evenly">
            <CardHeader className="flex flex-row items-center md:mb-2 mb-2 justify-start w-full space-y-0 py-1 h-1/3">
                <CardTitle className="md:text-lg text-md font-medium text-left w-full">Distribucion de Propiedades por Grupo</CardTitle>
                <Building2Icon className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3 ">
                {distribucionDeptos?.length > 0 
                ? distribucionDeptos?.map((grupo, i) => (
                    <div className="flex items-center text-sm  gap-x-3 w-full " key={i}>
                        <span className="w-3/5 text-zinc-600 font-normal overflow-hidden whitespace-nowrap text-ellipsis"> {grupo?.grupo} </span> 
                        <Progress className="w-4/5 text-blue-400" colorProgress="#2798f5" value={parseInt(grupo?.porcentaje)} /> 
                        <span className="w-[36%] text-blue-400 font-medium flex-row flex items-center  text-xs"> {grupo?.porcentaje} - {grupo?.departamentos}/{totalDeptos} </span>
                    </div>
                ))
                
                : <p> No hay grupos creados </p> }
                
            </CardContent>
        </Card>
    )
}