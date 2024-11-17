/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { NavLink, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import  useFetch  from '../../hooks/use-fetch'
import { getGrupos } from "../../database/crudGrupos";
import SkeletonLoading from '../helpers/skeletonTable'
import { useUser } from '../../hooks/use-user'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle,} from "../ui/card";


export default function DashboardDeptos({searchTerm, filteredDepartamentos, loadingDeptos}) {

  const userLoged_id = useUser();
  const navigate = useNavigate()

  const { loading: loadingGrupos, error: errorGrupo, data: dataGrupos, fn: fnGetGrupos } = useFetch(getGrupos, { user_id: userLoged_id });

  // Llama a la función para obtener los departamentos cuando se tenga el ID del usuario
  useEffect(() => {
    if (userLoged_id) {      
      fnGetGrupos({ user_id: userLoged_id})
      if (errorGrupo) console.error(errorGrupo);
    }
  }, [userLoged_id]);


  // Filtrar grupos que contienen departamentos filtrados
  const filteredGrupos = (dataGrupos || []).filter((grupo) =>
    filteredDepartamentos.some((dep) => dep.grupo_id === grupo.id)
  )

  console.log(searchTerm)
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
              <AccordionTrigger className="flex justify-between bg-gradient-to-br from-blue-100 to-white w-full px-3 rounded-t-xl">
                <div className="flex justify-between items-center mb-1">
                  <h1 className="text-2xl font-medium text-[#194567]">
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

        </div>
      ))

      : (
        <div className="w-full flex justify-center h-56">
            <Card className="w-96 h-40 mt-3 flex flex-col justify-center text-center shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-medium"> 
                  {searchTerm.length > 0 ? 'No hay propiedades que coincidan con esa busqueda.' : 'No hay propiedades cargadas por el momento.'}
                </CardTitle>
              </CardHeader>
              {searchTerm.length > 0 || filteredDepartamentos.length === 0 ? '' : (
              <CardContent className="flex justify-center">
                <NavLink to='/dashboard/grupos'>
                  <p className="w-fit items-center flex bg-green-600 rounded-lg text-white h-10 px-6 font-bold text-md hover:bg-green-800">
                    Ir a Grupos
                  </p>
                </NavLink>
              </CardContent>
              )}
            </Card>
        </div>
      )

    )
  }
  </div>
)
}


