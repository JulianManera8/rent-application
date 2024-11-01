/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button } from "./ui/button";
import { Link, NavLink, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from "lucide-react";
import  useFetch  from '../hooks/use-fetch'
import { getDeptos } from "../database/crudDeptos";
import supabase from "../lib/supabase";
import SkeletonLoading from '../components/skeletonTable'



export default function DashboardDeptos({rows, border, showBtn, showAll}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("sinfiltro");
  const [currentPage, setCurrentPage] = useState(1);
  const [userLoged_id, setUserLogedId] = useState(null)
  const itemsPerPage = rows;
  const navigate = useNavigate()

  const { loading, data: deptos, error, fn } = useFetch(getDeptos, {user_id: userLoged_id});
  
  // Obtiene el ID del usuario logueado
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data) {
        setUserLogedId(data.user.id);
      }
      if (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    getUser();
  }, []);

  // Llama a la función para obtener los departamentos cuando se tenga el ID del usuario
  useEffect(() => {
    if (userLoged_id) {
      fn(userLoged_id);  // Solo llamamos a fn cuando userLoged_id está definido
    }
  }, [userLoged_id]);

  useEffect(() => {
    setFilterValue(filterValue)
  }, [filterValue, setFilterValue])

  const filteredDepartamentos = (deptos || []).filter((dep) => {
    const matchesSearchTerm =
      dep.ubicacion_completa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dep.propietario_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dep.facturador_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dep.cobrador_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dep.inquilino_name.toLowerCase().includes(searchTerm.toLowerCase()) 
  
    const matchesFilter =
      filterValue === "sinfiltro" || dep.ocupado.toString() === filterValue;
  
    return matchesSearchTerm && matchesFilter;
  });

  const totalPages = Math.ceil( (deptos || []).length / itemsPerPage);

  const paginatedDepartamentos = filteredDepartamentos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={`w-full py-10 px-0 ${border}`}>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold text-[#194567]">
          Todas las Propiedades
        </h1>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar"
            className="pl-8 w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtrar por:</span>
          <Select value={filterValue} onValueChange={setFilterValue}>
            <SelectTrigger className="w-[180px]">
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
          {loading 
          ? (
            <>
              <SkeletonLoading />
              <SkeletonLoading />
            </>
          ) : (
            <>
              {showAll
                ? (filteredDepartamentos.length ? filteredDepartamentos.map((dep) => (
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
                  )): (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={6} className="text-center py-4">
                        No hay propiedades todavia, agrega una!
                      </TableCell>
                    </TableRow>
                  ))
                : (paginatedDepartamentos.length ? paginatedDepartamentos.map((dep) => (
                    <TableRow
                      key={dep.id}
                      className="text-md cursor-pointer"
                      onClick={() => navigate(`/dashboard/deptos/${dep.id}`, { state: { infoDepto: dep }})}
                    >
                      <TableCell className="w-1/6">{dep.ubicacion_completa}</TableCell>
                      <TableCell className="w-1/6"> {dep.propietario_name} </TableCell>
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
                  )): (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={6} className="text-center py-4">
                        No hay propiedades todavia. <NavLink to="/dashboard/deptos/createDepto"> <Button className="ml-3 bg-green-600 color-white hover:bg-green-400"> Agregar una </Button></NavLink>
                      </TableCell>
                    </TableRow>
                  ))}
            </>
          )}
        </TableBody>
      </Table>

      {/* show or dont show the divided pages */}
      {showAll ? (
        ""
      ) : (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing data of {paginatedDepartamentos.length} in{" "}
            {filteredDepartamentos.length} total
          </p>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                onClick={() => setCurrentPage(page)}
                className="h-8 w-8"
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* show or dont show the button to see all deptos */}
      {showBtn ? (
        <div className="flex justify-center mt-5">
          <Button className="h-[45px] px-7 text-md bg-[#003156] hover:bg-[#255a93] rounded-xl">
            <NavLink to="/dashboard/deptos"> VER TODOS </NavLink>
          </Button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
