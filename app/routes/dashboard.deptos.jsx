/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { NavLink } from "@remix-run/react";
import DashboardDeptos from "../components/propiedades/DashboardDeptos";
import DashboardDeptosShared from "../components/propiedades/DashboardDeptosShared";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input"
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useState, useEffect } from "react";
import  useFetch  from '../hooks/use-fetch'
import { useUser } from '../hooks/use-user'
import { getDeptos } from "../database/crudDeptos";
import { Separator } from "../components/ui/separator";
import { getAccessGrupos } from "../database/crudAccess/crudAccessGrupos";
import { getRolesPerGroup } from "../database/crudGrupos";
import { getAccessDeptos as getAccessDeptosByGrupoId } from "../database/crudAccess/crudAccessDeptos";


export default function DashboardDeptoPage() {
  const [ searchTerm, setSearchTerm ] = useState('')
  const [ filterValue, setFilterValue ] = useState("sinfiltro");
  const [ rolesPerGroup, setRolesPerGroup ] = useState([])
  const [ deptoInfoInicio, setDeptoInfoInicio ] = useState([]);

  const userLoged_id = useUser();

  const { loading: loadingDeptos, data: deptos, fn: fnGetDeptos } = useFetch(getDeptos, {user_id: userLoged_id});
  const { data: dataGruposAccess, fn: fnGetAccessGrupos } = useFetch(getAccessGrupos, userLoged_id );


  useEffect(() => {
    if (userLoged_id) {
      fnGetDeptos(userLoged_id);       
      fnGetAccessGrupos({ user_id: userLoged_id });
    }
  }, [userLoged_id]);

  useEffect(() => {
    async function fetchAccessData() {
      if (userLoged_id && dataGruposAccess.length > 0) {
        try {

          const gruposId = dataGruposAccess.map(grupo => grupo.id)
          const dataRoles = await getRolesPerGroup(gruposId)
          if(dataRoles) {
            setRolesPerGroup(dataRoles)
          }

          const dataDeptos = await getAccessDeptosByGrupoId(dataGruposAccess);

          setDeptoInfoInicio(dataDeptos);

        } catch (err) {
          console.error("Error fetching access balances:", err);
        }
      }
    }

    fetchAccessData()
  }, [dataGruposAccess]);

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

  const filteredDepartamentosShared = (deptoInfoInicio || []).filter((dep) => {
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
    <div className="flex flex-col w-full mr-14 px-0 md:px-3">
      <div className="flex md:justify-between justify-center items-center">
        <h1 className="sm:text-3xl text-lg text-gray-300 font-medium font-inter md:mt-8 mt-0 mx-0 mb-2">
          DASHBOARD - <span className='text-[#0c426bd3]'> Propiedades </span>{" "}  
        </h1>
      </div>
      <Separator />

      <div className='flex md:justify-between justify-center gap-y-3 gap-x-6 items-center flex-wrap mt-10'>
      <h1 className="sm:text-3xl text-2xl w-max mx-auto sm:mx-0 font-medium text-[#194567] flex justify-between">
        Mis Propiedades
      </h1>

      <div className="flex gap-5 flex-wrap md:justify-start justify-center"> 
          
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

      <DashboardDeptos searchTerm={searchTerm} filteredDepartamentos={filteredDepartamentos} deptos={deptos} loadingDeptos={loadingDeptos} userId={userLoged_id}/>

      <h1 className="text-3xl font-medium text-[#176c2b] flex justify-between">
        Propiedades de grupos compartidos
      </h1>
      
      <DashboardDeptosShared searchTerm={searchTerm} filteredDepartamentos={filteredDepartamentosShared} deptos={deptoInfoInicio} loadingDeptos={loadingDeptos} userId={userLoged_id}/>
    </div>
  );
  
}

