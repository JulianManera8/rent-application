/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import { Skeleton } from "../../ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table"
import { CalendarClock, ArrowRightSquare, CheckSquare } from 'lucide-react'
import { compareAsc, format, differenceInDays } from 'date-fns'
import { es } from "date-fns/locale"
import { getDeptos } from "../propertySection/getPropertyData"
import { getGroups } from "../groupSection/getGroupData"
import { useNavigate } from "@remix-run/react"
import FilterComponent from './FilterComponent'

export default function EndContract({ userId }) {
  const [deptosInfo, setDeptosInfo] = useState([]);
  const [filteredDeptos, setFilteredDeptos] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate()

  useEffect(() => {
    async function getData() {
      if (userId) {
        setLoading(true);
        try {
          const [dataDeptos, dataGrupos] = await Promise.all([
            getDeptos(userId),
            getGroups(userId)
          ]);
          if (dataDeptos && dataGrupos) {
            const orderedDeptos = orderProperties(dataDeptos, dataGrupos);
            setDeptosInfo(orderedDeptos);
            setFilteredDeptos(orderedDeptos);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    getData();
  }, [userId]);

  function orderProperties(deptos, grupos) {
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
      const daysRemaining = differenceInDays(depto.endContract, new Date());
      return {
        id: depto.idDepto,
        ubicacion: depto.ubicacion,
        endContract: format(depto.endContract, 'dd/MM/yyyy', { locale: es }),
        status: daysRemaining <= 0 ? 'VENCIDO' : daysRemaining,
        grupo_info: grupos.filter(grupo => grupo?.id === depto.grupo_id)
      };
    });
  }

  function getStatusColor(status) {
    if (status === 'VENCIDO') return 'text-red-600 border-none text-md';
    if (status < 30) return 'bg-red-100 text-red-800 border-red-300';
    if (status < 60) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-green-100 text-green-800 border-green-300';
  }

  const handleFilterChange = (filter) => {
    if (filter === 'all') {
      setFilteredDeptos(deptosInfo);
    } else {
      const filtered = deptosInfo.filter(depto => 
        filter === 'vencido' ? depto.status === 'VENCIDO' : depto.status !== 'VENCIDO'
      );
      setFilteredDeptos(filtered);
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex relative flex-col pt-3 sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 pb-2">
        <div className="flex-1 ">  
          <CardTitle className="text-md md:text-lg font-medium pt-0">
            Próximas finalizaciones de contrato
          </CardTitle>
        </div>
        <div className="flex flex-row items-center space-x-2 sm:space-x-5 w-full sm:w-auto justify-between  sm:justify-end">
          <FilterComponent onFilterChange={handleFilterChange}/>
          <CalendarClock className="h-6 w-6 text-muted-foreground sm:relative sm:top-0 sm:right-0 absolute top-3 right-3" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-6 my-5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : filteredDeptos.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-6 space-y-2">
            <CheckSquare className="h-8 w-8 text-green-500" />
            <p className="text-sm sm:text-md font-medium">No hay propiedades con contratos próximos a finalizar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
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
                {filteredDeptos.map(depto => (
                  <TableRow key={depto.id}>
                    <TableCell className="font-medium">{depto.ubicacion}</TableCell>
                    <TableCell>{depto.endContract}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`p-1 sm:p-2 text-xs sm:text-sm ${getStatusColor(depto.status)}`}>
                        {depto.status === 'VENCIDO' ? 'VENCIDO' : `${depto.status} días`}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        className="hover:bg-transparent text-blue-900 hover:text-blue-600 p-0 sm:p-2"                                 
                        onClick={() => navigate(`/dashboard/deptos/${depto.id}`, { state: { dataDepto: depto, infoGrupo: depto.grupo_info[0]}})}
                      >
                        <span className="hidden sm:inline">Ver Propiedad</span>
                        <ArrowRightSquare className="min-h-6 min-w-6" />
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

