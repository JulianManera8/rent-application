import { useUser } from '../../../hooks/use-user'
import PropOcupation from './PropOcupation'
import PropQuantity from './PropQuantity'
import PropTotalIncome from './PropTotalncome'

export default function SectionPropiedades() {
    const userLoged_id = useUser()

    return (
        <div className="-z-10">
            <h1 className="text-3xl font-medium text-[#0c426bd3] mb-3"> Propiedades </h1>

            <div className="flex gap-10 flex-wrap">

                <div className=" space-y-4 flex flex-col md:w-[288px] w-full justify-between">
                    <PropQuantity userId={userLoged_id}/>
                </div>

                <div className="flex flex-col gap-y-5 md:max-w-72 md:min-w-72 w-full h-full -z-10">
                    <PropTotalIncome userId={userLoged_id}/>
                </div>
                <div className="flex flex-col gap-y-5 md:max-w-72 md:min-w-72 w-full h-full -z-10">
                    <PropOcupation userId={userLoged_id}/>
                </div>

                {/* <Card className="border-1 shadow-md shadow-black/15 border-[0.6px] border-t-[1px] md:w-[350px] w-full flex flex-col justify-evenly -z-10">
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
                </Card> */}
            </div>
        </div>
    )
}