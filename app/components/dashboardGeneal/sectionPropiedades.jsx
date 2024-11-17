import { NavLink } from "@remix-run/react"
import {Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Progress } from "../ui/progress"

import { Home, DollarSign, UserRoundCheckIcon, CreditCard } from 'lucide-react'

export default function SectionPropiedades() {
    return (
        <div>
            <h1 className="text-3xl font-medium text-[#0c426bd3] mb-3"> Propiedades </h1>

            <div className="flex gap-10 flex-wrap">

                <div className=" space-y-4 flex flex-col md:w-[265px] w-full justify-between">
                    <Card className="border-1 shadow-md shadow-black/15 border-[0.6px] border-t-[1px] min-h-[100px] flex flex-col justify-between">
                        <CardHeader className="flex flex-row items-center justify-start w-full space-y-0 py-2">
                            <CardTitle className="md:text-lg text-md font-medium text-left w-full">Propiedades Cargadas </CardTitle>
                            <Home className="h-6 w-6 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="space-y-0.5 flex flex-col">
                            <span className="md:text-lg text-md text-zinc-600 font-semibold"> 20 </span>
                            <span className="text-xs font-medium text-zinc-400"> Distribuidas en 3 grupos</span>
                        </CardContent>
                    </Card>

                    <div className="flex flex-row gap-x-3 md:max-w-[265px]">

                        <Card className="border-1 shadow-md shadow-black/15 border-[0.6px] border-t-[1px] w-full h-11">
                            <CardHeader className="w-full bg-[#08598bfb] hover:bg-[#066baae5]  transition-all duration-200 px-1 rounded-lg text-white flex items-center h-full py-1">
                                <CardTitle className=" text-sm text-left w-full h-full justify-center font-normal flex items-center">
                                     <NavLink to='/dashboard/deptos' className=' cursor-pointer w-full h-full flex justify-center items-center'> Ver Propiedades </NavLink>
                                </CardTitle>
                            </CardHeader>
                        </Card>

                        <Card className="border-1 shadow-md shadow-black/15 border-[0.6px] border-t-[1px] w-full h-11">
                            <CardHeader className="w-full px-1 rounded-lg bg-green-600 hover:bg-green-500 text-white hover:shadow-black/90  transition-all duration-200 flex items-center h-full py-1">
                                <CardTitle className="text-sm font-normal text-left w-full h-full justify-center  flex items-center">
                                    <NavLink to='/dashboard/deptos/createDepto' className='cursor-pointer w-full h-full flex justify-center items-center'> Agregar Propiedad </NavLink>
                                </CardTitle>
                            </CardHeader>
                        </Card>

                    </div>
                    
                </div>

                <div className="flex flex-col gap-y-5 md:max-w-64 w-full h-full">

                    <Card className="border-1 shadow-md shadow-black/15 border-[0.6px] border-t-[1px] md:w-[275px] w-full h-2/5 flex flex-col justify-between">
                        <CardHeader className="flex flex-row items-center justify-start w-full md:mb-auto mb-2 space-y-0 py-2">
                            <CardTitle className="md:text-lg text-md font-medium text-left w-full">Total ingresos esperados </CardTitle>
                            <DollarSign className="h-6 w-6 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="flex flex-row items-center gap-x-3">
                            <span className="text-md font-medium text-zinc-500"> $ 1.580.630,00 </span>
                            <span className="text-xs font-medium text-zinc-400"> brutos, mensuales.</span>
                        </CardContent>
                    </Card>

                    <Card className="border-1 shadow-md shadow-black/15 border-[0.6px] border-t-[1px] md:w-[275px] w-full h-2/5 flex flex-col justify-between">
                        <CardHeader className="flex flex-row items-center justify-start w-full md:mb-auto mb-2 space-y-0 py-2">
                            <CardTitle className="md:text-lg text-md font-medium text-left w-full">Porcentaje de ocupación </CardTitle>
                            <UserRoundCheckIcon className="h-6 w-6 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="flex flex-row items-center gap-x-3">
                            <span className="text-md font-medium text-zinc-500"> 87% </span>
                            <span className="text-xs font-medium text-zinc-400"> 14 / 16 propiedades ocupadas</span>
                        </CardContent>
                    </Card>

                </div>

                <Card className="border-1 shadow-md shadow-black/15 border-[0.6px] border-t-[1px] md:w-[350px] w-full flex flex-col justify-evenly">
                    <CardHeader className="flex flex-row items-center justify-start w-full space-y-0 py-1 h-1/3">
                        <CardTitle className="md:text-lg text-md font-medium text-left md:mb-auto mb-3 w-full">Distribucion de formas de cobro </CardTitle>
                        <CreditCard className="h-6 w-6 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center text-sm font-bold gap-x-3 w-full ">
                            <span className="w-7/12 font-normal text-zinc-600 overflow-hidden whitespace-nowrap text-ellipsis"> Efectivo </span> 
                            <Progress className="1/2 text-blue-400" value={75} /> 
                            <span className="text-blue-400 text-xs"> 75% </span>
                        </div>
                        <div className="flex items-center text-sm font-bold gap-x-3 w-full ">
                            <span className="w-7/12 font-normal text-zinc-600 overflow-hidden whitespace-nowrap text-ellipsis"> Dolares </span> 
                            <Progress className="1/2 text-blue-400" value={5} /> 
                            <span className="text-blue-400 text-xs"> 5% </span>
                        </div>
                        <div className="flex items-center text-sm font-bold gap-x-3 w-full ">
                            <span className="w-7/12 font-normal text-zinc-600 overflow-hidden whitespace-nowrap text-ellipsis"> Transferencia </span> 
                            <Progress className="1/2 text-blue-400" value={20} /> 
                            <span className="text-blue-400 text-xs"> 20% </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}