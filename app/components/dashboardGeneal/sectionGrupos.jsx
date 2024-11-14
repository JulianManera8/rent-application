import { NavLink } from "@remix-run/react"
import {Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Progress } from "../ui/progress"

import { Home } from 'lucide-react'

export default function SectionGrupos() {
    return (
        <div>
            <h1 className="text-3xl font-extrabold text-[#0c426bd3] mb-3"> Grupos </h1>

            <div className="flex gap-x-10 ">

                <div className=" space-y-4 flex flex-col justify-between">
                    <Card className="border-1 shadow-md shadow-black/15 border-[0.6px] border-t-[1px] w-64 h-[100px] flex flex-col justify-between">
                        <CardHeader className="flex flex-row items-center justify-start w-full space-y-0 py-2">
                            <CardTitle className="text-lg font-medium text-left w-full">Grupos Creados </CardTitle>
                            <Home className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="space-y-0.5 flex flex-col">
                            <span className="text-lg font-bold"> 3 </span>
                            <span className="text-xs text-zinc-400"> Ultimo creado el 23/5/2024</span>
                        </CardContent>
                    </Card>

                    <div className="flex flex-row gap-x-3 max-w-64">

                        <Card className="border-1 shadow-md shadow-black/15 border-[0.6px] border-t-[1px] w-full h-11">
                            <CardHeader className="w-full bg-[#08598bfb] hover:bg-[#066baae5]  transition-all duration-200 px-1 rounded-lg text-white flex items-center h-full py-1">
                                <CardTitle className=" text-md text-left w-full h-full justify-center  flex items-center">
                                     <NavLink to='/dashboard/grupos' className=' cursor-pointer w-full h-full flex justify-center items-center'> Ver Grupos </NavLink>
                                </CardTitle>
                            </CardHeader>
                        </Card>

                        <Card className="border-1 shadow-md shadow-black/15 border-[0.6px] border-t-[1px] w-full h-11">
                            <CardHeader className="w-full px-1 rounded-lg bg-green-600 hover:bg-green-500 text-white hover:shadow-black/90  transition-all duration-200 flex items-center h-full py-1">
                                <CardTitle className="text-md font-bold text-left w-full h-full justify-center  flex items-center">
                                    <NavLink to='/dashboard/grupos' className='cursor-pointer w-full h-full flex justify-center items-center'> Crear Grupo </NavLink>
                                </CardTitle>
                            </CardHeader>
                        </Card>

                    </div>
                    
                </div>
                

                <Card className="border-1 shadow-md shadow-black/15 border-[0.6px] border-t-[1px] w-[380px] flex flex-col justify-between">
                    <CardHeader className="flex flex-row items-center justify-start w-full space-y-0 py-2">
                        <CardTitle className="text-lg font-medium text-left w-full">Distribucion de Propiedades</CardTitle>
                        <Home className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center text-sm font-bold gap-x-3 w-full ">
                            <span className="w-2/3  overflow-hidden whitespace-nowrap text-ellipsis"> Familia Manera </span> <Progress className="1/2 text-blue-400" value={10} /> <span className="text-blue-400 text-xs"> 10% </span>
                        </div>
                        <div className="flex items-center text-sm font-bold gap-x-3 w-full ">
                        <span className="w-2/3  overflow-hidden whitespace-nowrap text-ellipsis"> Perez </span> <Progress className="1/2 text-blue-400" value={30} /> <span className="text-blue-400 text-xs"> 30% </span>
                        </div>
                        <div className="flex items-center text-sm font-bold gap-x-3 w-full ">
                        <span className="w-2/3  overflow-hidden whitespace-nowrap text-ellipsis"> M&N Asociados </span> <Progress className="1/2 text-blue-400" value={40} /> <span className="text-blue-400 text-xs"> 40% </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-1 shadow-md shadow-black/15 border-[0.6px] border-t-[1px] w-[380px] flex flex-col justify-between">
                    <CardHeader className="flex flex-row items-center justify-start w-full space-y-0 py-2">
                        <CardTitle className="text-lg font-medium text-left w-full">Distribucion de Ingresos</CardTitle>
                        <Home className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center text-sm font-bold gap-x-3 w-full ">
                            <span className="w-2/3  overflow-hidden whitespace-nowrap text-ellipsis"> Familia Manera </span> <Progress className="1/2 text-blue-400" value={36} /> <span className="text-blue-400 text-xs"> 36% </span>
                        </div>
                        <div className="flex items-center text-sm font-bold gap-x-3 w-full ">
                        <span className="w-2/3  overflow-hidden whitespace-nowrap text-ellipsis"> Perez </span> <Progress className="1/2 text-blue-400" value={14} /> <span className="text-blue-400 text-xs"> 14% </span>
                        </div>
                        <div className="flex items-center text-sm font-bold gap-x-3 w-full ">
                        <span className="w-2/3  overflow-hidden whitespace-nowrap text-ellipsis"> M&N Asociados </span> <Progress className="1/2 text-blue-400" value={50} /> <span className="text-blue-400 text-xs"> 50% </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}