/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button } from "./ui/button";
import { Link, NavLink, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { EditIcon, FileChartColumnIcon } from "lucide-react";
import useFetch from "../hooks/use-fetch";
import { getGrupos, insertGrupo } from "../database/crudGrupos";
import supabase from "../lib/supabase";
import SkeletonLoading from "../components/skeletonTable";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle } from "../components/ui/card"
import { Skeleton } from "./ui/skeleton";
import { getDeptos } from "../database/crudDeptos";
import { getBalances } from "../database/crudBalances";



export default function DashboardGrupos() {
  const [userLoged_id, setUserLoged_id] = useState(null);
  const [createGrupoInfo, setCreateGrupoInfo] = useState({
    userId: userLoged_id,
    nombreGrupo: "",
  });
  const [getGrupoInfo, setGetGrupoInfo] = useState([]);
  const navigate = useNavigate();
  const [validated, setValidated] = useState(true)
  const [cerrar, setCerrar] = useState(false)
  const [expandir, setExpandir] = useState(false)



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

const { loading: loadingGetBalances, error: errorGetBalances, data: balances, fn: fnGetBalances } = useFetch(getBalances, { userId: userLoged_id});

const { loading: loadingGetDeptos, data: deptos, error: errorDeptos, fn: fnGetDeptos } = useFetch(getDeptos, {user_id: userLoged_id});

//FUNCION PARA CAPTAR LOS GRUPOS SI ES Q HAY
const { loading: loadingGetGrupos, data: grupos, error: errorGetGrupos, fn: fnGetGrupos } = useFetch(getGrupos, {user_id: userLoged_id});

useEffect(() => {
    if(userLoged_id) {
        fnGetGrupos(userLoged_id)
        if(errorGetGrupos) return console.error(errorGetGrupos)
        fnGetDeptos(userLoged_id)
        if(errorDeptos) return console.error(errorGetGrupos)
        fnGetBalances(userLoged_id)
        if(errorGetBalances) return console.error(errorGetBalances)
    }
}, [userLoged_id])

useEffect(() => {
    if(grupos && grupos.length > 0) {
        // Mapea los grupos y actualiza el estado con todos los grupos
        const mappedGrupos = grupos.map(grupo => ({
            grupo_id: grupo.id,
            grupo_name: grupo.grupo_name, 
            user_id: grupo.user_id,
            grupo_createdAt: new Date(grupo.created_at).toLocaleDateString()
        }));

        setGetGrupoInfo(mappedGrupos);
    }
}, [grupos, userLoged_id ]);


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
            const result = await insertGrupo({ createGrupoInfo });  // Llamada directa a insertGrupo
            setCerrar(true)

            setTimeout(() => {
                setCerrar(false)
            }, 5000);
            if (result && result.length > 0) {
                setGetGrupoInfo((prev) => [
                    ...prev,
                    {
                        grupo_id: result[0].id,
                        grupo_name: result[0].grupo_name,
                        grupo_createdAt: result[0].created_at,
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

  return (
    <div className={`w-full py-10 px-0`}>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold text-[#194567] flex justify-between">
          Todos los Grupos
        </h1>
        <div>
          <Dialog>
            <DialogTrigger className="w-full">
              <p className="bg-green-600 w-fit flex items-center text-white rounded-lg h-12 px-6 font-bold text-md hover:bg-green-800 transition-all">
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
                    className={`flex justify-center w-full mt-3 ${
                      cerrar ? "bg-green-600 hover:bg-gree-600" : "bg-black"
                    }`}
                    disabled={validated}
                    onClick={(e) => handleCreateGrupo(e)}
                  >
                    {cerrar ? "Creado" : "Agregar"}
                  </Button>
                  {cerrar ? (
                    <Label className="text-center w-full font-bold text-red-700">
                      {" "}
                      Ya puedes cerrar esto{" "}
                    </Label>
                  ) : (
                    ""
                  )}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loadingGetGrupos ? (
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-12 bg-gray-400" />
            </CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      ) : getGrupoInfo?.length > 0 ? (
        <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-12">
          {getGrupoInfo?.map((grupo) => (
            <Card
              key={grupo.grupo_id}
              className="bg-gray-50 shadow-lg mx-3 hover:border-gray-300 transition-all border-2 border-gray-100 cursor-pointer min-w-[410px] max-h-[410px]"
            >
              <CardHeader className="h-1/4">
                <CardTitle>Grupo: {grupo.grupo_name} </CardTitle>
                <CardDescription>
                  Creado en fecha: {grupo.grupo_createdAt}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative h-3/4">
                <div className="mb-5">
                  <p className="mb-2 text-lg font-extrabold">Propiedades dentro del grupo:</p>
                  {deptos?.filter((depto) => depto?.grupo_id === grupo?.grupo_id).length > 0 
                  ? (
                    deptos?.filter((depto) => depto?.grupo_id === grupo?.grupo_id).map((depto, i) => (
                        <ul key={i}>
                          <li className="ml-4">
                            { i < 2 ? (depto?.ubicacion_completa) : '' }
                            { i === 2 ? '...' : '' }
                          </li>
                        </ul>
                      ))
                  ) : (
                    <p>No hay departamentos asignados a este grupo.</p>
                  )}
                </div>
                <div>
                  <p className="mb-3 text-lg font-extrabold">Balances dentro del grupo:</p>
                  {balances?.filter((balance) => balance?.grupo_id === grupo?.grupo_id).length > 0 
                  ? (
                    balances?.filter((balance) => balance?.grupo_id === grupo?.grupo_id).map((balance, i) => (
                        <ul key={i}>
                          <li className="flex items-center mb-3 ml-4">
                                { i < 2 ? (
                                    <>
                                        {balance?.mes_balance}, {' '} {balance?.año_balance}
                                        <Button className="ml-3 bg-gray-300 h-7 text-sm text-black hover:bg-gray-300">
                                            <FileChartColumnIcon /> Balance 
                                        </Button>
                                    </>
                                ) : '' }
                                { i === 2 ? '...' : '' }
                            </li>
                        </ul>
                      ))
                  ) : (
                    <p>No hay balances asignados a este grupo.</p>
                  )}
                </div>
                <div className="absolute flex right-5 bottom-2 gap-1">
                  <EditIcon />
                  <p>Ver mas </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      ) : (
        <div>
          <p> No hay grupos tdv</p>
          <Dialog>
            <DialogTrigger className="w-full">
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
                    className={`flex justify-center w-full mt-3 ${
                      cerrar ? "bg-green-600 hover:bg-gree-600" : "bg-black"
                    }`}
                    disabled={validated}
                    onClick={(e) => handleCreateGrupo(e)}
                  >
                    {cerrar ? "Creado" : "Agregar"}
                  </Button>
                  {cerrar ? (
                    <Label className="text-center w-full font-bold text-red-700">
                      {" "}
                      Ya puedes cerrar esto{" "}
                    </Label>
                  ) : (
                    ""
                  )}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
