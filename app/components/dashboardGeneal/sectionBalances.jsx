import { NavLink } from "@remix-run/react"
import {Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import {Button} from "../ui/button"

import { FileChartColumnIcon, FileChartColumnIncreasingIcon } from 'lucide-react'

export default function SectionPropiedades() {
    return (
        <div>
            <h1 className="text-3xl font-medium text-[#0c426bd3] mb-3"> Balances </h1>

            <div className="flex gap-x-10 max-h-64">

                <Card className="border-1 shadow-md shadow-black/15 border-[0.6px] border-t-[1px] w-[430px] flex flex-col justify-evenly">
                    <CardHeader className="flex flex-row items-center justify-start w-full space-y-0 py-3 mb-2 h-1/3">
                        <CardTitle className="text-lg font-medium text-left w-full">Ultimos Balances cargados por grupo </CardTitle>
                        <FileChartColumnIcon className="h-6 w-6 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center text-md font-bold gap-x-4 w-full ">
                            <span className="w-7/12 font-normal text-zinc-600 overflow-hidden whitespace-nowrap text-ellipsis"> Familia Manera </span> 
                            <div className="flex items-center justify-end w-fit space-x-2">
                                <span className="text-sm w-max font-bold">
                                    Marzo, 2024
                                </span>
                            </div>
                            <Button
                                variant="outline"
                                className="flex items-center space-x-2 text-md"
                            >
                                <FileChartColumnIncreasingIcon className="h-3 w-3" />
                                <a href={'urlBalance'} target="_blank" rel="noreferrer">
                                  Balance
                                </a>
                            </Button>                                
                        </div>
                        <div className="flex items-center text-md font-bold gap-x-4 w-full ">
                            <span className="w-7/12 font-normal text-zinc-600 overflow-hidden whitespace-nowrap text-ellipsis"> Perez </span> 
                            <div className="flex items-center justify-end w-fit space-x-2">
                                <span className="text-sm w-max font-bold">
                                    Abril, 2024
                                </span>
                            </div>
                            <Button
                                variant="outline"
                                className="flex items-center space-x-2 text-md"
                            >
                                <FileChartColumnIncreasingIcon className="h-3 w-3" />
                                <a href={'urlBalance'} target="_blank" rel="noreferrer">
                                  Balance
                                </a>
                            </Button>                                
                        </div>
                        <div className="flex items-center text-md font-bold gap-x-4 w-full ">
                            <span className="w-7/12 font-normal text-zinc-600 overflow-hidden whitespace-nowrap text-ellipsis"> M&N Asociados </span> 
                            <div className="flex items-center justify-end w-fit space-x-2">
                                <span className="text-sm w-max font-bold">
                                    Marzo, 2024
                                </span>
                            </div>
                            <Button
                                variant="outline"
                                className="flex items-center space-x-2 text-md"
                            >
                                <FileChartColumnIncreasingIcon className="h-3 w-3" />
                                <a href={'urlBalance'} target="_blank" rel="noreferrer">
                                  Balance
                                </a>
                            </Button>                                
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-col justify-center gap-y-6 max-w-64">

                    <Card className="border-1 shadow-md shadow-black/15 border-[0.6px] border-t-[1px] w-full h-11">
                        <CardHeader className="w-full bg-[#08598bfb] hover:bg-[#066baae5] transition-all duration-200 rounded-lg text-white flex items-center h-full py-1">
                            <CardTitle className=" text-md text-left w-full h-full font-normal justify-center flex items-center">
                                 <NavLink to='/dashboard/deptos' className=' cursor-pointer w-full h-full flex justify-center px-3 items-center'> Ver Balances </NavLink>
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="border-1 shadow-md shadow-black/15 border-[0.6px] border-t-[1px] w-full h-11">
                        <CardHeader className="w-full rounded-lg bg-green-600 hover:bg-green-500 text-white hover:shadow-black/90  transition-all duration-200 flex items-center h-full py-1">
                            <CardTitle className=" text-md text-left w-full h-full font-normal justify-center flex items-center">
                                <NavLink to='/dashboard/deptos/createDepto' className='cursor-pointer w-full h-full flex justify-center px-3 items-center'> Cargar Balance </NavLink>
                            </CardTitle>
                        </CardHeader>
                    </Card>

                </div>

            </div>
        </div>
    )
}