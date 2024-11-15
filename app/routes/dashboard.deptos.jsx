/* eslint-disable react-hooks/exhaustive-deps */
import { NavLink } from "@remix-run/react";
import DashboardDeptos from "../components/propiedades/DashboardDeptos";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input"
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useState, useEffect } from "react";
import  useFetch  from '../hooks/use-fetch'
import { useUser } from '../hooks/use-user'
import { getDeptos } from "../database/crudDeptos";


export default function DashboardDeptoPage() {
  const [ searchTerm, setSearchTerm ] = useState('')
  const [filterValue, setFilterValue] = useState("sinfiltro");

  const userLoged_id = useUser();

  const { loading: loadingDeptos ,error: errorDeptos ,data: deptos, fn: fnGetDeptos } = useFetch(getDeptos, {user_id: userLoged_id});


  useEffect(() => {
    if (userLoged_id) {
      fnGetDeptos(userLoged_id);       
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
      filterValue === "sinfiltro" || dep.ocupado === (filterValue === "true");

    
    return matchesSearchTerm && matchesFilter;
  });

  return (
    <div className="flex flex-col w-full mr-14 ">
      <div className="flex items-center mt-8 justify-between ">
        <h1 className="text-3xl text-gray-300 font-medium font-inter">
           DASHBOARD - <span className='text-[#0c426bd3]'> Propiedades </span>
        </h1>

        
        <div className="flex gap-x-5"> 
          
          <div className="flex items-center">
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

          <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
          <Input
              placeholder="Buscar"
              className='pl-8 w-[210px]'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="bg-green-600 h-10 px-6 font-bold text-md hover:bg-green-800"> 
              <NavLink to="/dashboard/deptos/createDepto"> Agregar Propiedad </NavLink>
          </Button>
      </div>
        </div>
      <DashboardDeptos searchTerm={searchTerm} filteredDepartamentos={filteredDepartamentos} deptos={deptos} loadingDeptos={loadingDeptos}/>
    </div>
  );
}
