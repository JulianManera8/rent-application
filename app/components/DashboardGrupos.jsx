/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button } from "./ui/button";
import { Link, NavLink, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { EditIcon, FileChartColumnIcon, Dot, XSquare } from "lucide-react";
import useFetch from "../hooks/use-fetch";
import { getGrupos, insertGrupo } from "../database/crudGrupos";
import supabase from "../lib/supabase";
import SkeletonLoading from "../components/skeletonTable";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "../components/ui/dialog"
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle } from "../components/ui/card"
import { Skeleton } from "./ui/skeleton";
import { getDeptos } from "../database/crudDeptos";
import { getBalances } from "../database/crudBalances";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog"

export default function DashboardGrupos() {
  const [isOpen, setIsOpen] = useState(false)

  const [userLoged_id, setUserLoged_id] = useState(null);
  const [createGrupoInfo, setCreateGrupoInfo] = useState({
    userId: userLoged_id,
    nombreGrupo: "",
  });
  const [getGrupoInfo, setGetGrupoInfo] = useState([]);
  const navigate = useNavigate();
  const [validated, setValidated] = useState(true)
  const [cerrar, setCerrar] = useState(false)

  const [inputBorrar, setInputBorrar ] = useState('')
  const [disabledContinue, setDisabledContinue ] = useState(true)

  useEffect(() => {
    
    if(inputBorrar === 'CONFIRMO BORRAR TODO') {
      return setDisabledContinue(false)
    } else {
      return setDisabledContinue(true)
    }

  }, [inputBorrar])

  const handleDeleteDepto = (e) => {
    console.log('borrar')
  }

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

setTimeout(() => {
  setIsOpen(true)
}, 300);

  return (
    <div className={`w-full py-10 px-0`}>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold text-[#194567] flex justify-between">
          Todos los Grupos
        </h1>
        <div>
          {/* CREAR GRUPO NUEVO */}
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
        <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-20 gap-y-6">
          {getGrupoInfo?.map((grupo) => (

            //  open={isOpen} onOpenChange={setIsOpen}
            <Dialog key={grupo.grupo_id}>
              <DialogTrigger asChild>
                <Card className="bg-gray-50 shadow-lg my-5 hover:border-gray-300 transition-all border-2 border-gray-100 cursor-pointer min-w-[310px] min-h-[430px] max-h-[420px]">
                  <CardHeader className="h-1/4">
                    <CardTitle>Grupo: {grupo.grupo_name} </CardTitle>
                    <CardDescription className="pt-1">
                      Creado en fecha: {grupo.grupo_createdAt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative h-3/4">
                    <div className="h-[43%]">
                      <p className="mb-2 text-lg font-extrabold text-gray-400 underline-offset-custom">
                        Propiedades dentro del grupo:
                      </p>
                      {/* Si hay deptos, solo mostrame los 2 primeros y si hay mas, pone puntos suspensivos */}
                      {deptos?.filter(
                        (depto) => depto?.grupo_id === grupo?.grupo_id
                      ).length > 0 ? (
                        deptos
                          ?.filter(
                            (depto) => depto?.grupo_id === grupo?.grupo_id
                          )
                          .map((depto, i) => (
                            <ul key={i}>
                              <li className="ml-2 font-extrabold ">
                                {i < 2 ? (
                                  <div className="flex items-center">
                                    {" "}
                                    <Dot /> {depto?.ubicacion_completa}{" "}
                                  </div>
                                ) : (
                                  ""
                                )}
                                <p className="ml-6">{i === 2 ? "..." : ""}</p>
                              </li>
                            </ul>
                          ))
                      ) : (
                        <p>No hay departamentos asignados a este grupo.</p>
                      )}
                    </div>
                    <div className="h-1/2">
                      <p className="mb-3 text-lg font-extrabold text-gray-400 underline-offset-custom">
                        Balances dentro del grupo:
                      </p>
                      {balances?.filter(
                        (balance) => balance?.grupo_id === grupo?.grupo_id
                      ).length > 0 ? (
                        balances
                          ?.filter(
                            (balance) => balance?.grupo_id === grupo?.grupo_id
                          )
                          .map((balance, i) => (
                            <ul key={i}>
                              <li className="flex items-center mb-3">
                                {i < 2 ? (
                                  <div className="flex items-center">
                                    <Dot />
                                    {balance?.mes_balance},{" "}
                                    {balance?.año_balance}
                                    <Button className="ml-3 bg-gray-300 h-7 text-sm text-black hover:bg-gray-300">
                                      <FileChartColumnIcon /> Balance
                                    </Button>
                                  </div>
                                ) : (
                                  ""
                                )}
                                <p className="ml-6">{i === 2 ? "..." : ""}</p>
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
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-2xl flex items-center gap-x-8" >
                    Grupo: {grupo.grupo_name} 
                    <EditIcon size={22} className="cursor-pointer text-gray-400 hover:text-blue-500 transition-all" />
                  </DialogTitle>
                  <DialogDescription className="text-gray-400 text-md">
                    Creado en fecha: {grupo.grupo_createdAt}
                  </DialogDescription>
                </DialogHeader>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2 underline-offset-custom">Propiedades:</h3>
                    <ul>
                      {deptos?.filter((depto) => depto?.grupo_id === grupo.grupo_id).map((depto) => (
                          <li key={depto.id}>
                            <div className="flex items-center border-b border-t py-3 justify-between">
                              <div className="h-full flex flex-row items-center ">
                                <Dot /> {depto?.ubicacion_completa} 
                              </div>
                              <div className="h-full flex flex-row items-center  gap-x-2">
                                <EditIcon size={23} className="cursor-pointer hover:text-blue-500 transition-all" onClick={() => navigate(`/dashboard/deptos/${depto.id}`, { state: { infoDepto: depto }})}/>
                                <XSquare size={23} className="cursor-pointer hover:text-red-500 transition-all"/>
                              </div>
                            </div>
                          </li>
                        ))
                      }
                    </ul>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2 underline-offset-custom">Balances:</h3>
                    <ul>
                      {balances?.filter(
                          (balance) => balance?.grupo_id === grupo.grupo_id
                        ).map((balance) => (
                           <li key={balance.id}className="flex mb-2">
                            <div className="flex items-center border-b border-t py-3 justify-between w-full">
                              <div className="h-full flex flex-row items-center ">
                                <Dot /> {balance.mes_balance}, {balance.año_balance} 
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="ml-3"
                                >
                                  <FileChartColumnIcon className="mr-1 h-4 w-4" />
                                  Ver Balance
                                </Button>
                              </div>
                              <div className="h-full flex flex-row items-center  gap-x-2">
                                <EditIcon size={23} className="cursor-pointer hover:text-blue-500 transition-all" />
                                {/* <EditIcon size={23} className="cursor-pointer hover:text-blue-500 transition-all" onClick={() => navigate(`/dashboard/deptos/${depto.id}`, { state: { infoDepto: depto }})}/> */}
                                <XSquare size={23} className="cursor-pointer hover:text-red-500 transition-all"/>
                              </div>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <DialogFooter className="sm:justify-center gap-y-5 gap-x-6 mt-4">
                    <DialogClose asChild>
                      <Button> Cerrar </Button>
                    </DialogClose>

                    {/* BOTON PARA BORRAR PROPIEDAD */}
                    <AlertDialog>
                        <AlertDialogTrigger className="bg-red-600 hover:bg-red-700 text-white p-2 px-4 rounded-md">
                          Borrar Propiedad
                        </AlertDialogTrigger>
                        <AlertDialogContent className="flex flex-col items-center">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-center text-2xl">
                              Estas a punto de borrar un grupo
                            </AlertDialogTitle>

                            <AlertDialogDescription className="text-center text-lg text-red-500 font-bold">
                              ¡Borrarás también todas sus propiedades y balances!
                            </AlertDialogDescription>

                            <AlertDialogDescription className="text-center text-lg text-red-500">
                              ¡Esta accion no se puede revertir!
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex justify-center gap-6 mt-3 md:justify-center">
                            <AlertDialogCancel onClick={() => setInputBorrar('')}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={(e) => handleDeleteDepto(e)}  disabled={disabledContinue}>Continuar</AlertDialogAction>
                          </AlertDialogFooter>
                            <div>
                              <Label> Escribe <strong className="px-2"> CONFIRMO BORRAR TODO </strong> para confirmar esta accion</Label>
                              <Input 
                                className="mt-4" 
                                type="text" 
                                value={inputBorrar} 
                                onChange={(e) => setInputBorrar(e.target.value.trimStart().toUpperCase())}
                              />
                            </div>
                          </AlertDialogContent>
                    </AlertDialog>
                  </DialogFooter>
              </DialogContent>
            </Dialog>
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
