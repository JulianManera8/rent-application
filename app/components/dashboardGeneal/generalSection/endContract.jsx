/* eslint-disable react/prop-types */
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { CalendarClockIcon } from 'lucide-react'
import { getDeptos } from "../propertySection/getPropertyData"
import { useEffect, useState } from "react"
import { Skeleton } from "../../ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { compareAsc, format } from 'date-fns';
import { es } from "date-fns/locale"



export default function EndContract({userId}) {
    const [deptosInfo, setDeptosInfo] = useState([])
    const [loading, setLoading] = useState(true)
    const [showSkeleton, setShowSkeleton] = useState(true)

    useEffect(() => {
        async function getData() {
            if (userId) {
                setLoading(true)
                const data = await getDeptos(userId);
                if (data) {
                    setDeptosInfo( orderProperties(data) )
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

    function orderProperties(data) {
        // Filtrar departamentos ocupados
        const deptosOcupados = data.filter(depto => depto.ocupado);
    
        // Obtener propiedades relevantes con las fechas como objetos Date
        const propAndDates = deptosOcupados.map(depto => ({
            idDepto: depto.id,
            ubicacion: depto.ubicacion_completa,
            endContract: new Date(depto.finalizacion_contrato), // Convertir directamente a Date
        }));
    
        // Ordenar de la más próxima a la más lejana usando compareAsc
        const propiedadesOrdenadas = propAndDates.sort((a, b) =>
            compareAsc(a.endContract, b.endContract)
        );
    
        // Formatear las fechas para mostrar de forma legible
        const resultado = propiedadesOrdenadas.map(depto => ({
            idDepto: depto.idDepto,
            ubicacion: depto.ubicacion,
            endContract: format(depto.endContract, 'dd/MM/yyyy', {locale: es}),
            status: 
        }));
    
        console.log(resultado);
        return resultado; // Retornar el array ordenado
    }


    return (
        <div>
            <Card className="border-1 shadow-md shadow-black/15 border-[0.6px] border-t-[1px] min-h-[100px] h-full flex flex-col justify-between pb-2">
                <CardHeader className="flex flex-row items-center justify-start w-full space-y-0 pt-2 pb-0">
                    <CardTitle className="text-lg font-medium text-left w-full">
                        Proximas finalizaciones de contrato
                    </CardTitle>
                    <CalendarClockIcon className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent className="flex flex-col justify-between">
                    {loading || showSkeleton ? (
                        <>
                            <span className="text-lg text-zinc-200 font-normal mb-2 -mt-3"> <Skeleton className="w-28 h-4 bg-zinc-200"/> </span> 
                            <span className="text-sm text-zinc-200"> <Skeleton className="w-28 h-4 bg-zinc-200"/> </span>
                        </>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table className="border-b-2 border-t-2 w-full">
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-1/4">PROPIEDAD</TableHead>
                                  <TableHead className="w-1/4">FINALIZA</TableHead>
                                  <TableHead className="w-1/4">ESTADO</TableHead>
                                  <TableHead className="w-1/4">ACCIONES</TableHead>
                                </TableRow>
                              </TableHeader>
                              {/* <TableBody>
                                {balanceInfo.filter(balance => balance.grupo_id === grupo.id).length === 0 ? (
                                  <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={6} className="text-left font-semibold py-4">
                                      No hay balances todavía.
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  balanceInfo
                                    .filter(balance => balance.grupo_id === grupo.id)
                                    .map((balance, i) => (
                                      <TableRow key={i} className="h-full text-sm md:text-lg">
                                        <TableCell className="w-1/4"> {balance.año_balance} </TableCell>
                                        <TableCell className="w-1/4"> {balance.mes_balance} </TableCell>
                                        <TableCell className="w-1/4">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center text-xs md:text-sm"
                                          >
                                            <FileChartColumnIncreasingIcon className="mr-0 h-4 w-4" />
                                            <span className="hidden md:inline">Balance</span>
                                          </Button>
                                        </TableCell>
                                        <TableCell className="h-full">
                                          
                                        </TableCell>
                                      </TableRow>
                                    ))
                                )}
                              </TableBody> */}
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}