import { NavLink } from "@remix-run/react"
import {Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Progress } from "../ui/progress"

import { Boxes, Building2Icon } from 'lucide-react'

export default function SectionGrupos() {
    return (
        <div>
            <h1 className="text-3xl font-medium text-[#0c426bd3] mb-3"> Grupos </h1>

            <div className="flex gap-x-10 ">

                <div className=" space-y-4 flex flex-col justify-between">
                    <Card className="border-1 shadow-md shadow-black/15 border-[0.6px] border-t-[1px] w-64 min-h-[100px] flex flex-col justify-between">
                        <CardHeader className="flex flex-row items-center justify-start w-full space-y-0 py-2">
                            <CardTitle className="text-lg font-medium text-left w-full">Grupos Creados </CardTitle>
                            <Boxes className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="flex flex-col justify-between">
                            <span className="text-lg text-zinc-600 font-semibold"> 3 </span>
                            <span className="text-xs text-zinc-400"> Ultimo creado el 23/5/2024</span>
                        </CardContent>
                    </Card>

                    <div className="flex flex-row gap-x-3 max-w-64">

                        <Card className="border-1 shadow-md shadow-black/15 border-[0.6px] border-t-[1px] w-full h-11">
                            <CardHeader className="w-full bg-[#08598bfb] hover:bg-[#066baae5]  transition-all duration-200 px-1 rounded-lg text-white flex items-center h-full py-1">
                                <CardTitle className=" text-md text-left font-normal w-full h-full justify-center  flex items-center">
                                     <NavLink to='/dashboard/grupos' className=' cursor-pointer w-full h-full flex justify-center items-center'> Ver Grupos </NavLink>
                                </CardTitle>
                            </CardHeader>
                        </Card>

                        <Card className="border-1 shadow-md shadow-black/15 border-[0.6px] border-t-[1px] w-full h-11">
                            <CardHeader className="w-full px-1 rounded-lg bg-green-600 hover:bg-green-500 text-white hover:shadow-black/90  transition-all duration-200 flex items-center h-full py-1">
                                <CardTitle className="text-md  font-normal text-left w-full h-full justify-center  flex items-center">
                                    <NavLink to='/dashboard/grupos' className='cursor-pointer w-full h-full flex justify-center items-center'> Crear Grupo </NavLink>
                                </CardTitle>
                            </CardHeader>
                        </Card>

                    </div>
                    
                </div>
                

                <Card className="border-1 shadow-md shadow-black/15 border-[0.6px] border-t-[1px] w-[400px] flex flex-col justify-evenly">
                    <CardHeader className="flex flex-row items-center justify-start w-full space-y-0 py-1 h-1/3">
                        <CardTitle className="text-lg font-medium text-left w-full">Distribucion de Propiedades por Grupo</CardTitle>
                        <Building2Icon className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center text-sm  gap-x-3 w-full ">
                            <span className="w-3/5 text-zinc-600 font-normal overflow-hidden whitespace-nowrap text-ellipsis"> Familia Manera </span> 
                            <Progress className="w-4/5 text-blue-400" value={10} /> 
                            <span className="w-[36%] text-blue-400 font-medium flex-row flex items-center  text-xs"> 10% - 2/20 </span>
                        </div>

                        <div className="flex items-center text-sm  gap-x-3 w-full ">
                            <span className="w-3/5 text-zinc-600 font-normal overflow-hidden whitespace-nowrap text-ellipsis"> Perez </span> 
                            <Progress className="w-4/5 text-blue-400" value={50} /> 
                            <span className="w-[36%] text-blue-400 font-medium text-xs"> 50% - 10/20 </span>
                        </div>

                        <div className="flex items-center text-sm  gap-x-3 w-full ">
                            <span className="w-3/5 text-zinc-600 font-normal overflow-hidden whitespace-nowrap text-ellipsis"> M&N Asociados </span> 
                            <Progress className="w-4/5 text-blue-400" value={40} /> 
                            <span className="w-[36%] text-blue-400 font-medium text-xs"> 40% - 8/20 </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-1 shadow-md shadow-black/15 relative border-[0.6px] border-t-[1px] w-[400px] flex flex-row justify-evenly">
                    <div className="absolute top-0 left-0 w-56">
                        <h1 className="text-lg  font-medium flex text-left p-3 w-full items-center justify-center">Distribucion de Ingresos por Grupo</h1>
                    </div>

                    <div className="w-3/5 ml-auto mr-2">
                        <img src="/chart2.png" className="w-80 h-full" alt="chart" />
                    </div>
                </Card>
            </div>
        </div>
    )
}