/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { NavLink } from "@remix-run/react";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/use-fetch";
import { getGrupos, getRolesPerGroup } from "../../database/crudGrupos";
import { getAccessGrupos } from "../../database/crudAccess/crudAccessGrupos";

import { Skeleton } from "../ui/skeleton";

export default function HandleGrupo({ onSelectChange, userId }) {
  
  const [getGrupoInfo, setGetGrupoInfo] = useState([]);
  const [grupoSelectedId, setGrupoSelectedId] = useState(null);
  const [rolesPerGroup, setRolesPerGroup] = useState([])

  //FUNCION PARA CAPTAR LOS GRUPOS SI ES QUE HAY
  const { loading: loadingAccessGrupos, data: dataAccessGrupos, fn: fnGetAccessGrupos } = useFetch(getAccessGrupos, userId );
  const { loading: loadingGetGrupos, data: grupos, error: errorGetGrupos, fn: fnGetGrupos } = useFetch(getGrupos, { user_id: userId });

  useEffect(() => {
    if (userId) {
      fnGetGrupos({user_id: userId});
      fnGetAccessGrupos(userId);
      if (errorGetGrupos) return console.error(errorGetGrupos);
    }
  }, [userId]);

  useEffect(() => {
    const filteredGrupos = [];

    if (grupos && grupos.length > 0) {
      grupos.forEach((grupo) => {
        if (grupo.user_id === userId) {
          filteredGrupos.push({
            grupo_id: grupo.id,
            grupo_name: grupo.grupo_name,
            user_id: grupo.user_id,
            shared: false
          });
        }
      });
    }

    if (dataAccessGrupos && dataAccessGrupos.length > 0 && rolesPerGroup.length > 0) {
      dataAccessGrupos.forEach((grupo) => {
        const userRole = rolesPerGroup.find(role => role.grupo_id === grupo.id && role.user_id_access === userId);
        if (userRole && userRole.role === 'editor') {
          filteredGrupos.push({
            grupo_id: grupo.id,
            grupo_name: grupo.grupo_name,
            user_id: grupo.user_id,
            shared: true
          });
        }
      });
    }

    setGetGrupoInfo(filteredGrupos);
  }, [grupos, dataAccessGrupos, rolesPerGroup, userId]);

  useEffect(() => {
    async function fetchAccessData() {
      if (userId && dataAccessGrupos?.length > 0) {
        try {
          const gruposId = dataAccessGrupos.map(grupo => grupo.id)
          const dataRoles = await getRolesPerGroup(gruposId)
          if(dataRoles) {
            setRolesPerGroup(dataRoles)
          }
        } catch (err) {
          console.error("Error fetching access balances:", err);
        }
      }
    }

    fetchAccessData()
  }, [dataAccessGrupos, userId]);

  useEffect(() => {
    if (grupoSelectedId != null) {
      const idGrupo = getGrupoInfo.filter((grupo) => {
        if (grupo.grupo_name === grupoSelectedId) {
          return grupo.grupo_id;
        }
      });

      onSelectChange(idGrupo[0].grupo_id);
    }
  }, [grupoSelectedId]);

  return (
    <div className="min-w-full">
      <Label htmlFor="mesBalance" className="font-bold flex justify-between items-center pr-1 mb-2.5">
        Asignar grupo
      </Label>
      <Select
        onValueChange={(value) => setGrupoSelectedId(value)}
        className="w-full border-zinc-500"
      >
        <SelectTrigger className="w-full p-2 border-zinc-500">
          <SelectValue placeholder="Elegir grupo" />
        </SelectTrigger>

        {/* SELECT DE LOS GRUPOS */}
        <SelectContent>
          {loadingGetGrupos ? (
            <>
              <Skeleton className="w-2/4 h-5 ml-4 my-3 bg-gray-200" />
              <Skeleton className="w-2/4 h-5 ml-4 mb-2 bg-gray-200" />
            </>
          ) : (
            getGrupoInfo.length !== 0 ? (
            getGrupoInfo.map((grupo) => (
              <SelectItem
                key={grupo.grupo_id}
                value={grupo.grupo_name}
                className="flex items-center w-full"
              >
                <p className={`overflow-hidden text-ellipsis whitespace-nowrap  text-md ${grupo.shared ? 'text-green-800' : ''}`}>
                  {grupo.grupo_name} {grupo.shared ? <span className="text-muted-foreground text-xs"> (Grupo compartido) </span> : ''}
                </p>
              </SelectItem>
            ))) : (
            <p className="my-2 ml-2"> No tienes grupos con rol de editor,  
              <NavLink to="/dashboard/grupos" className="mb-4 bg-transparent text-green-500 font-medium text-center text-sm hover:scale-105 w-full transition-all">
                {' '}Ir a crearlo o solicitar acceso
              </NavLink>
            </p>)
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

