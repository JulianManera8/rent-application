/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import { Skeleton } from "../../ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table"
import { CalendarClock, ArrowRight, CheckSquare } from 'lucide-react'
import { compareAsc, format, differenceInDays } from 'date-fns'
import { es } from "date-fns/locale"
import { getDeptos } from "../propertySection/getPropertyData"
import { getGroups } from "../groupSection/getGroupData"
import { useNavigate } from "@remix-run/react"


export default function EndContract({ userId }) {
    const [deptosInfo, setDeptosInfo] = useState([]);
    const [gruposInfo, setGruposInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    useEffect(() => {
      async function getData() {
        if (userId) {
          setLoading(true);
          const dataDeptos = await getDeptos(userId);
          const dataGrupos = await getGroups(userId);
          if (dataDeptos && dataGrupos) {
            setDeptosInfo(orderProperties(dataDeptos));
            setGruposInfo(dataGrupos)
          }
          setLoading(false);
        }
      }
      getData();
    }, [userId]);
  
    function orderProperties(deptos) {
      const deptosOcupados = deptos
        .filter(depto => depto.ocupado)
        .filter(depto => {
          const finContratoDif = differenceInDays(new Date(depto.finalizacion_contrato), new Date());
          return finContratoDif < 93;
        });
  
      const propAndDates = deptosOcupados.map(depto => ({
        idDepto: depto.id,
        ubicacion: depto.ubicacion_completa,
        endContract: new Date(depto.finalizacion_contrato),
        grupo_id: depto.grupo_id
      }));
  
      const propiedadesOrdenadas = propAndDates.sort((a, b) =>
        compareAsc(a.endContract, b.endContract)
      );
  
      return propiedadesOrdenadas.map(depto => {
        console.log(depto)
        const daysRemaining = differenceInDays(depto.endContract, new Date());
        return {
          id: depto.idDepto,
          ubicacion: depto.ubicacion,
          endContract: format(depto.endContract, 'dd/MM/yyyy', { locale: es }),
          status: daysRemaining <= 0 ? 'VENCIDO' : daysRemaining,
          grupo_info: gruposInfo?.filter(grupo=> grupo?.id === depto.grupo_id)
        };
      });
    }

    function getStatusColor(status) {
      if (status === 'VENCIDO') return 'text-red-600 border-none text-md';
      if (status < 30) return 'bg-red-100 text-red-800 border-red-300';
      if (status < 60) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      return 'bg-green-100 text-green-800 border-green-300';
    }
    console.log(deptosInfo)

  return (
    <Card className="w-full max-w-4xl shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md md:text-lg font-bold">
          Próximas finalizaciones de contrato
        </CardTitle>
        <CalendarClock className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-6 my-5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : deptosInfo.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-6 space-y-2">
            <CheckSquare className="h-8 w-8 text-green-500" />
            <p className="text-md font-medium">No hay propiedades con contratos próximos a finalizar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-2/5">Propiedad</TableHead>
                  <TableHead className="w-1/5">Finaliza</TableHead>
                  <TableHead className="w-1/5">Restante</TableHead>
                  <TableHead className="w-1/5">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deptosInfo.map(depto => (
                  <TableRow key={depto.idDepto}>
                    <TableCell className="font-medium">{depto.ubicacion}</TableCell>
                    <TableCell>{depto.endContract}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`p-2 text-md ${getStatusColor(depto.status)}`}>
                        {depto.status === 'VENCIDO' ? 'VENCIDO' : `${depto.status} días`}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="hover:bg-transparent text-blue-900 hover:text-blue-600"                                 
                      onClick={() => navigate(`/dashboard/deptos/${depto.id}`, { state: { dataDepto: depto, infoGrupo: depto.grupo_info}})}
                      >
                        Ver Propiedad
                        <ArrowRight className="mr-0 h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

