/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { NavLink, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import  useFetch  from '../../hooks/use-fetch'
import { getDeptos } from "../../database/crudDeptos";
import { getGrupos } from "../../database/crudGrupos";
import SkeletonLoading from '../helpers/skeletonTable'
import { useUser } from '../../hooks/use-user'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle,} from "../ui/card";


export default function DashboardDeptos({searchTerm}) {

  const [filterValue, setFilterValue] = useState("sinfiltro");

  const userLoged_id = useUser();
  const navigate = useNavigate()

  const { loading: loadingDeptos ,error: errorDeptos ,data: deptos, fn: fnGetDeptos } = useFetch(getDeptos, {user_id: userLoged_id});

  const { loading: loadingGrupos, error: errorGrupo, data: dataGrupos, fn: fnGetGrupos } = useFetch(getGrupos, { user_id: userLoged_id });

  // Llama a la función para obtener los departamentos cuando se tenga el ID del usuario
  useEffect(() => {
    if (userLoged_id) {
      fnGetDeptos(userLoged_id);       
      fnGetGrupos({ user_id: userLoged_id})
      if (errorGrupo) console.error(errorGrupo);
      if (errorDeptos) console.error(errorDeptos);
    }
  }, [userLoged_id]);

  useEffect(() => {
    setFilterValue(filterValue)
  }, [filterValue, setFilterValue])

  const filteredDepartamentos = (deptos || []).filter((dep) => {
    const normalizedSearchTerm = (searchTerm || "").toLowerCase();
    
    const matchesSearchTerm =
      (dep.ubicacion_completa || "").toLowerCase().includes(normalizedSearchTerm) ||
      (dep.propietario_name || "").toLowerCase().includes(normalizedSearchTerm) ||
      (dep.facturador_name || "").toLowerCase().includes(normalizedSearchTerm) ||
      (dep.cobrador_name || "").toLowerCase().includes(normalizedSearchTerm) ||
      (dep.inquilino_name || "").toLowerCase().includes(normalizedSearchTerm);
    
    const matchesFilter =
      filterValue === "sinfiltro" || (dep.ocupado || "").toString() === filterValue;
    
    return matchesSearchTerm && matchesFilter;
  });
  
  // Filtrar grupos que contienen departamentos filtrados
  const filteredGrupos = (dataGrupos || []).filter((grupo) =>
    filteredDepartamentos.some((dep) => dep.grupo_id === grupo.id)
  )

  return (
  <div className='w-full py-10 px-0'>

    {loadingGrupos 
    ? (
        // Skeleton loading for groups
        Array.from({ length: 2 }).map((_, index) => (
          <div key={`skeleton-${index}`} className="flex w-full justify-between items-center relative mb-12">

            <div className="flex justify-between w-full items-center mb-1">
              <Skeleton className="h-10 w-1/2 bg-gray-100" />
            </div>

            <div className="flex items-center absolute top-5 right-0">
              <Skeleton className="h-6 w-32 mr-2" />
            </div>
          </div>
        ))
    )
    : (
      filteredGrupos.length > 0 

      ?  
      filteredGrupos.map((grupo) => (
        <div className="flex w-[95%] mx-auto justify-between items-center border rounded-xl shadow-md hover:shadow-lg p-3 relative mb-12 transition-all" key={grupo.id}>

          <Accordion type="multiple" className="w-full" defaultOpenItems={[`item${grupo.id}`]}>
            <AccordionItem value={`item${grupo.id}`} >
              <AccordionTrigger className="flex justify-between bg-[#0c8aeb16] w-full px-3 rounded-t-xl">
                <div className="flex justify-between items-center mb-1">
                  <h1 className="text-3xl font-extrabold text-[#194567]">
                    Grupo: {grupo.grupo_name}
                  </h1>
                </div>
              </AccordionTrigger>
              <AccordionContent>
              <Table className="border-b-[2px] overflow-hidden">
                <TableHeader>
                  <TableRow className="font-md">
                    <TableHead>Direccion</TableHead>
                    <TableHead>Propietario</TableHead>
                    <TableHead>Facturador</TableHead>
                    <TableHead>Cobrador</TableHead>
                    <TableHead>Inquilino</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingDeptos  
                    ? (
                      // SKELETON
                      <>
                        <SkeletonLoading />
                        <SkeletonLoading />
                      </>
                    ) 
                    : filteredDepartamentos.filter(depto => depto.grupo_id === grupo.id).length === 0 ? (
                      <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={6} className="text-left font-semibold py-4">
                          No hay propiedades todavía.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDepartamentos
                        .filter(dep => dep.grupo_id === grupo.id)
                        .map((dep) => (
                          <TableRow
                            key={dep.id}
                            className="text-md cursor-pointer"
                            onClick={() => navigate(`/dashboard/deptos/${dep.id}`, { state: { infoDepto: dep }})}
                          >
                            <TableCell className="w-1/6"> {dep.ubicacion_completa}</TableCell>
                            <TableCell className="w-1/6">  {dep.propietario_name} </TableCell>
                            <TableCell className="w-1/6"> {dep.facturador_name} </TableCell>
                            <TableCell className="w-1/6"> {dep.cobrador_name} </TableCell>
                            <TableCell className="w-1/6"> {dep.inquilino_name} </TableCell>
                            <TableCell className="w-1/6">
                              <span
                                className={`px-2 py-1 rounded-full text-md font-semibold ${
                                  dep.ocupado === true
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {dep.ocupado ? "Ocupado" : "Desocupado"}
                              </span>
                            </TableCell>

                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
      
          {/* SORT BY */}
          <div className="flex items-center gap-x-5 absolute top-7 right-5 ">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filtrar por:</span>
              <Select value={filterValue} onValueChange={setFilterValue}>
                <SelectTrigger className="w-fit">
                  <SelectValue placeholder="Seleccionar filtro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sinfiltro">Sin filtro</SelectItem>
                  <SelectItem value="true">Ocupado</SelectItem>
                  <SelectItem value="false">Desocupado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

        </div>
      ))

      : (
        <div className="w-full flex justify-center h-56">
            <Card className="w-96 h-40 mt-3 flex flex-col justify-center text-center shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg"> 
                  No hay grupos creados por el momento
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <NavLink to='/dashboard/grupos'>
                  <p className="w-fit items-center flex bg-green-600 rounded-lg text-white h-10 px-6 font-bold text-md hover:bg-green-800">
                    Ir a Grupos
                  </p>
                </NavLink>
              </CardContent>
            </Card>
        </div>
      )

    )
  }
  </div>
)
}


