/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { NavLink } from "@remix-run/react";
import { Label } from "../ui/label";
import { useUser } from "../../hooks/use-user";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/use-fetch";
import { getGrupos, insertGrupo } from "../../database/crudGrupos";


import { Skeleton } from "../ui/skeleton";

export default function HandleGrupo({ onSelectChange }) {
  
  const userLoged_id = useUser();
  const [createGrupoInfo, setCreateGrupoInfo] = useState({
    userId: userLoged_id,
    nombreGrupo: "",
  });
  const [getGrupoInfo, setGetGrupoInfo] = useState([]);
  const [grupoSelectedId, setGrupoSelectedId] = useState(null);
  const [cerrar, setCerrar] = useState(false);
  const [validated, setValidated] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (userLoged_id) {
      setCreateGrupoInfo({ ...createGrupoInfo, userId: userLoged_id });
    }
  }, [userLoged_id]);

  //FUNCION PARA CAPTAR LOS GRUPOS SI ES Q HAY
  const { loading: loadingGetGrupos, data: grupos, error: errorGetGrupos, fn: fnGetGrupos } = useFetch(getGrupos, { user_id: userLoged_id });

  useEffect(() => {
    if (userLoged_id) {
      fnGetGrupos({user_id: userLoged_id});
      if (errorGetGrupos) return console.error(errorGetGrupos);
    }
  }, [userLoged_id]);

  useEffect(() => {
    if (grupos && grupos.length > 0) {
      // Mapea los grupos y actualiza el estado con todos los grupos
      const mappedGrupos = grupos.map((grupo) => ({
        grupo_id: grupo.id,
        grupo_name: grupo.grupo_name,
        user_id: grupo.user_id,
      }));

      setGetGrupoInfo(mappedGrupos);
    }
  }, [grupos, userLoged_id]);

  useEffect(() => {
    if (createGrupoInfo.nombreGrupo !== "") {
      return setValidated(false);
    }

    return setValidated(true);
  }, [createGrupoInfo.nombreGrupo]);

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
                <p className="overflow-hidden text-ellipsis whitespace-nowrap  text-md ">
                  {grupo.grupo_name}
                </p>
              </SelectItem>
            ))) : (
            <p className="my-2 ml-2"> No tienes grupos,  
              <NavLink to="/dashboard/grupos" className="mb-4 bg-transparent text-green-500 font-medium text-center text-sm hover:scale-105 w-full transition-all">
                {' '}Ir a crearlo
              </NavLink>
            </p>)
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
