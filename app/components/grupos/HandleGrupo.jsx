/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import supabase from "../../lib/supabase";
import { useEffect, useState } from "react";
import useFetch from '../../hooks/use-fetch'
import { getGrupos, insertGrupo } from '../../database/crudGrupos'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"

import { Skeleton } from '../ui/skeleton';
  

export default function HandleGrupo({onSelectChange}) {
    const [userLoged_id, setUserLoged_id] = useState(null)
    const [createGrupoInfo, setCreateGrupoInfo] = useState({
        userId: userLoged_id,
        nombreGrupo: ''
    })
    const [getGrupoInfo, setGetGrupoInfo] = useState([])
    const [grupoSelectedId, setGrupoSelectedId] = useState(null)
    const [cerrar, setCerrar] = useState(false)
    const [validated, setValidated] = useState(true)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        async function getUser() {
            const {data, error} = await supabase.auth.getUser()

            if(error) return console.error(error)
            if(data) {
                setUserLoged_id(data.user.id)
                setCreateGrupoInfo({...createGrupoInfo, userId: data.user.id})
            }
        }   
        getUser()
    }, [])

    //FUNCION PARA CAPTAR LOS GRUPOS SI ES Q HAY
    const { loading: loadingGetGrupos, data: grupos, error: errorGetGrupos, fn: fnGetGrupos } = useFetch(getGrupos, {user_id: userLoged_id});

    useEffect(() => {
        if(userLoged_id) {
            fnGetGrupos(userLoged_id)
            if(errorGetGrupos) return console.error(errorGetGrupos)
        }
    }, [userLoged_id])

    useEffect(() => {
        if(grupos && grupos.length > 0) {
            // Mapea los grupos y actualiza el estado con todos los grupos
            const mappedGrupos = grupos.map(grupo => ({
                grupo_id: grupo.id,
                grupo_name: grupo.grupo_name, 
                user_id: grupo.user_id
            }));

            setGetGrupoInfo(mappedGrupos);
        }
    }, [grupos, userLoged_id, ]);

    useEffect(() => {
        if(createGrupoInfo.nombreGrupo !== '') {
            return setValidated(false)
        }

        return setValidated(true)
    }, [createGrupoInfo.nombreGrupo])


    const handleCreateGrupo = async (e) => {
        e.preventDefault();
    
        try {
            if (userLoged_id) {
                const result = await insertGrupo({ createGrupoInfo }); 
                setCerrar(true)

                setTimeout(() => {
                    setCerrar(false)
                    setIsOpen(false)
                }, 2000);
                
                if (result && result.length > 0) {
                    setGetGrupoInfo((prev) => [
                        ...prev,
                        {
                            grupo_id: result[0].id,
                            grupo_name: result[0].grupo_name,
                            user_id: result[0].user_id,
                        },
                    ]);
    
                    setCreateGrupoInfo({ ...createGrupoInfo, nombreGrupo: '' });
                }
            }
        } catch (error) {
            console.error("Error al crear el grupo:", error.message || error);
        }
    };

    useEffect(() => {
      if (grupoSelectedId != null) {

          const idGrupo = getGrupoInfo.filter( grupo => {
            if(grupo.grupo_name === grupoSelectedId) {
              return grupo.grupo_id
            }
          });
          
          onSelectChange(idGrupo[0].grupo_id);
      }
    }, [grupoSelectedId]);


    return (
      <div className="min-w-full space-y-2 mt-1">
        <Label htmlFor="mesBalance" className="font-bold text-md">
          Asignar grupo
        </Label>
        <Select
          onValueChange={(value) => setGrupoSelectedId(value)}
          className="w-full"
        >
          <SelectTrigger className="w-full">
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
              getGrupoInfo.map((grupo) => (
                <SelectItem
                  key={grupo.grupo_id}
                  value={grupo.grupo_name}
                  className="flex items-center justify-between w-full"
                >
                  <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm">
                    {grupo.grupo_name}
                  </p>
                </SelectItem>
              ))
            )}

            {/* BOTON CREAR NUEVO GRUPO */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger className="w-full" onClick={() => setIsOpen(true)}>
                <p className="mb-4 bg-transparent text-green-500 font-extrabold text-center text-sm hover:scale-105 w-full transition-all">
                  Crear nuevo grupo
                </p>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Crea un nuevo grupo para tus propiedades
                  </DialogTitle>
                  <DialogDescription className="flex flex-col gap-4 mt-3 mb-3">
                    <Label className="mt-8"> Nombre del grupo </Label>
                    <Input
                      type="text"
                      placeholder="Ej: Familia Perez"
                      value={createGrupoInfo.nombreGrupo}
                      onChange={(e) =>
                        setCreateGrupoInfo({
                          ...createGrupoInfo,
                          nombreGrupo: e.target.value,
                        })
                      }
                    />
                    <Button
                      className={`flex justify-center w-full mt-3 ${ cerrar ? 'bg-green-600 hover:bg-gree-600' : 'bg-black'}`}
                      disabled={validated}
                      onClick={(e) => handleCreateGrupo(e)}
                    >
                      {cerrar ? 'Creado' : 'Agregar'}
                    </Button>
                    {cerrar ? (
                      <Label className="text-center w-full font-bold text-green-700">
                        {" "}
                        Grupo creado correctamente{" "}
                      </Label>
                    ) : (
                      ""
                    )}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </SelectContent>
        </Select>
      </div>
    );
}