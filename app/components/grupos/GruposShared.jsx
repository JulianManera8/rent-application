/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import SkeCard from "../grupos/skeletonCardsGroups";
import {Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { EditIcon, FileLineChartIcon as FileChartColumnIcon, Dot, ChevronsRight, Building2, Globe, XSquare, Expand } from 'lucide-react';
import { Separator } from "../ui/separator"
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { useUser } from '../../hooks/use-user'
import { getAccessGrupos } from '../../database/crudAccess/crudAccessGrupos';
import { getAccessDeptos } from '../../database/crudAccess/crudAccessDeptos';
import { getAccessBalances } from '../../database/crudAccess/crudAccessBalances';
import { useNavigate } from "@remix-run/react";
import { getAllUser } from "../../database/crudUsers";
import useFetch from "../../hooks/use-fetch";
import { editAccess, getRolesPerGroup, editRoleUser } from "../../database/crudGrupos";


export default function GruposShared() {

  const userLoged_id = useUser();
  const navigate = useNavigate();
  const [usersInfo, setUsersInfo] = useState([])
  
  const [loadingRemoveAccess, setLoadingRemoveAccess] = useState(false);

  const [accessGrupos, setAccessGrupos] = useState([]);
  const [loadingGetGrupos, setLoadingGetGrupos] = useState(true);
  const [errorGrupos, setErrorGrupos] = useState(null);

  const [accessDeptos, setAccessDeptos] = useState([]);
  const [errorDeptos, setErrorDeptos] = useState(null);
  const [rolesPerGroup, setRolesPerGroup] = useState([])

  const [accessBalances, setAccessBalances] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(true)

  const { loading, data, error, fn: fnGetAllUsers } = useFetch(getAllUser, {});

  useEffect(() => {
    if(!loadingGetGrupos) {
      setTimeout(() => {
        setShowSkeleton(false)
      }, (4000));
    }
  }, [loadingGetGrupos])

  useEffect(() => {
    if (data) {
      setUsersInfo(
        data.map((user) => ({
          user_id: user.id,
          user_name: user.user_name,
          user_lastname: user.user_lastname,
          user_dni: user.user_dni,
        }))
      );
    }
  }, [data, error]);

  useEffect(() => {
    async function fetchAccessGrupos() {
      if (userLoged_id) {
        fnGetAllUsers();

        try {
          setLoadingGetGrupos(true);
          const data = await getAccessGrupos(userLoged_id);
          setAccessGrupos(data);

          const gruposId = data.map(grupo => grupo.id)
          const dataRoles = await getRolesPerGroup(gruposId)
          if(dataRoles) {
            setRolesPerGroup(dataRoles)
          }

        } catch (err) {
          console.error("Error fetching access grupos:", err);
          setErrorGrupos(err.message);
        } finally {
          setLoadingGetGrupos(false);
        }
      }
    }

    fetchAccessGrupos();
  }, [userLoged_id]);
  
  useEffect(()=> {

    async function fetchAccessData() {
      if (userLoged_id && accessGrupos.length > 0) {
        try {
          const dataDeptos = await getAccessDeptos(accessGrupos);
          const dataBalances = await getAccessBalances(accessGrupos);

          setAccessDeptos(dataDeptos);
          setAccessBalances(dataBalances);

        } catch (err) {
          console.error("Error fetching access grupos:", err);
          setErrorDeptos(err.message);
        }
      }
    }

    fetchAccessData()
  }, [accessGrupos])

  const handleRemoveAccess = async (userId, grupoId, e) => {
    e.preventDefault();

    setLoadingRemoveAccess(true);

    //simulate the thinking of the machine to give more confidence to the user
    setTimeout(async () => {
    
        const grupo = accessGrupos.find((g) => g.id === grupoId);

        if (!grupo) {
            setLoadingRemoveAccess(false);
            return;
        }

        const newSharedWith = grupo.shared_with.filter((id) => id !== userId);

        const id_NewAccess = {
            arrayUsersId: newSharedWith,
            grupoId: grupoId,
        };

        try {
            const response = await editAccess(id_NewAccess);
            if (response === null) throw new Error("Failed to update access");

            setAccessGrupos((prevGrupos) => prevGrupos.filter((g) => g.id !== grupoId));

        } catch (error) {
            console.error("Error updating access:", error);
            setLoadingRemoveAccess(false); 
        } finally {
          setLoadingRemoveAccess(false);
        }

    }, 3000);
    
  };

  return (
    <div className={`w-full py-10`}>
        <div className="flex sm:justify-between items-center mb-7 flex-wrap gap-y-3 justify-center">
          <h1 className="text-3xl font-medium text-[#176c2b] flex justify-between">
            Grupos Compartidos Conmigo
          </h1>
        </div>

        {loadingGetGrupos ? (
            <SkeCard />
        ) : accessGrupos?.length > 0 ? (
            <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-14 gap-y-6">
                {accessGrupos?.map((grupo) => (
                  <Dialog key={grupo?.id}>
                    <DialogTrigger asChild>
                      {/* CARDS DE LOS GRUPOS */}
                      <Card className="shadow-lg my-5 bg-gradient-to-br from-green-100/60 to-white hover:border-gray-300 transition-all border-2 border-gray-100 cursor-pointer min-w-[310px] min-h-[460px]">
                        <CardHeader className="h-1/5 mb-3">                        
                          <CardTitle>{grupo?.grupo_name} </CardTitle>
                          <CardDescription className="pt-1">
                            Creado en fecha: {new Date(grupo?.created_at).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="relative h-4/5">
                          <div className="h-[36%]">
                            <p className="mb-2 text-lg font-medium flex items-center gap-x-2">
                              <Building2 className="w-4 h-4"/> Propiedades del grupo:
                            </p>
                            {accessDeptos?.filter(
                              (depto) => depto?.grupo_id === grupo?.id
                            ).length > 0 ? (
                              accessDeptos
                                ?.filter(
                                  (depto) => depto?.grupo_id === grupo?.id
                                )
                                .map((depto, i) => (
                                  <ul key={i}>
                                    <li className="ml-2 font-light ">
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
                              <p className="text-sm text-muted-foreground">No hay propiedades asignadas a este grupo.</p>
                            )}
                          </div>
                        
                          <Separator className="mb-3 bg-zinc-300 h-[1.5px]"/>
                        
                          {/* RENDER DE LOS BALANCES */}
                          <div className="h-1/2">
                            <p className="mb-2 text-lg font-medium flex items-center gap-x-2">
                              <FileChartColumnIcon className="w-4 h-4"/> Balances del grupo:
                            </p>
                            {accessBalances?.filter(
                              (balance) => balance?.grupo_id === grupo?.id
                            ).length > 0 ? (
                              accessBalances
                                ?.filter(
                                  (balance) => balance?.grupo_id === grupo?.id
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
                              <p className="text-sm text-muted-foreground">No hay balances asignados a este grupo.</p>
                            )}
                          </div>
                        
                          {/* RENDER DE LOS ACCESOS  */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-x-2 text-sm">
                              <Globe size={20}/>
                              Compartido con: { grupo?.shared_with ? (grupo.shared_with.length ) : 0}
                            </div>
                            <div className=" flex items-center gap-x-2">
                              <Expand size={17}/>
                              <p>Abrir </p>
                            </div>
                          </div>
                        
                        </CardContent>
                      </Card>

                    </DialogTrigger>
                    <DialogContent className="max-h-[90%] md:min-w-[440px] w-11/12 rounded-md overflow-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl justify-center sm:justify-between gap-y-2 w-full flex flex-wrap items-center gap-x-8">
                          <p>
                            {grupo?.grupo_name}
                          </p>
                        </DialogTitle>
                        
                        <DialogDescription className="text-gray-400 text-md">
                          Creado en fecha: {new Date(grupo.created_at).toLocaleDateString()}
                        </DialogDescription>
                      </DialogHeader>
                    
                      {/* RENDER DE DEPTOS */}
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2 underline-offset-custom">
                          Propiedades:
                        </h3>
                        <ul>
                          {accessDeptos?.filter(
                            (depto) => depto?.grupo_id === grupo?.id
                          ).length > 0 ? (
                            accessDeptos
                              ?.filter((depto) => depto?.grupo_id === grupo?.id)
                              .map((depto) => (
                                <li key={depto.id}>
                                  <div className="flex items-center border-b py-3 justify-between">
                                    <div className="h-full flex flex-row items-center ">
                                      <Dot /> {depto?.ubicacion_completa}
                                    </div> 
                                    <div  
                                        className="text-sm flex items-center gap-x-1 text-gray-400 hover:text-blue-500 cursor-pointer transition-all"
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            console.log('Surprise!');
                                          }
                                        }}
                                        onClick={() => {
                                          const userRole = rolesPerGroup?.find(
                                            (roleInTable) => 
                                              roleInTable.grupo_id === grupo.id && 
                                              roleInTable.user_id_access === userLoged_id
                                          )?.role;

                                          const isEditor = userRole === 'editor';
                                        
                                          const targetRoute = isEditor 
                                            ? `/dashboard/deptos/${depto.id}` 
                                            : `/dashboard/deptos/shared/${depto.id}`;


                                          navigate(targetRoute, {
                                            state: { 
                                              dataDepto: depto, 
                                              infoGrupo: grupo,
                                            },
                                          });
                                        }}
                                      >
                                        <ChevronsRight 
                                          size={28}
                                          className="cursor-pointer hover:text-blue-500 transition-all"
                                        /> 
                                        Ver Propiedad
                                      </div>
                                  </div>
                                </li>
                              ))
                          ) : (
                            <p>No hay propiedades asignadas a este grupo.</p>
                          )}
                        </ul>
                      </div>
                      
                      {/* RENDER DE LOS BALANCES */}
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2 underline-offset-custom">
                          Balances:
                        </h3>
                        <ul>
                          {accessBalances?.filter(
                            (balance) => balance?.grupo_id === grupo?.id
                          ).length > 0 ? (
                            accessBalances?.filter(
                                (balance) => balance?.grupo_id === grupo?.id
                              )
                              .map((balance) => (
                                <li key={balance.id} className="flex mb-2">
                                  <div className="flex items-center border-b py-3 justify-between w-full">
                                    <div className="h-full flex flex-row items-center ">
                                      <Dot /> {balance.mes_balance},{" "}
                                      {balance.año_balance}
                                      <a
                                        href={`${balance.url_excel}`}
                                        download={`balance_${balance.mes_balance}${balance.año_balance}.pdf`}
                                        target="_blank" 
                                        rel="noreferrer"
                                      >
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="ml-3 border-gray-400 text-gray-500"
                                        >
                                          <FileChartColumnIcon className="mr-1 h-4 w-4" />
                                          Balance
                                        </Button>
                                      </a>
                                    </div>
                                    <div className="h-full flex flex-row items-center  gap-x-2">
                                      <div  
                                        className="text-sm flex items-center gap-x-1 text-gray-400 hover:text-blue-500 cursor-pointer transition-all"
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            navigate(`/dashboard/money`);
                                          }
                                        }}             
                                        onClick={() => window.open(`${balance.url_excel}`, "_blank")}
                                      >
                                        <ChevronsRight 
                                          size={28}
                                          className="cursor-pointer hover:text-blue-500 transition-all"
                                        /> 
                                        Ver Balance
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))
                          ) : (
                            <p>No hay balances asignados a este grupo.</p>
                          )}
                        </ul>
                      </div>
                      
                      {/* RENDER DE LOS ACCESOS */}
                      <div className="mt-4 w-full">
                        <h3 className="text-lg font-semibold mb-2 underline-offset-custom">
                          Acceso:
                        </h3>
                        <div className="flex-col justify-between items-center">
                          <div className="flex justify-between items-center">
                            <ul className="w-full">
                              {Array.isArray(grupo?.shared_with) && grupo.shared_with.length > 0 ? (
                                usersInfo
                                  .filter((user) => grupo.shared_with.includes(user?.user_id))
                                  .map((user, i) => {
                                    // Filtrar el rol específico del usuario en el grupo actual
                                    const roleEntry = rolesPerGroup?.find(
                                      (roleInTable) => 
                                        roleInTable.grupo_id === grupo.id && 
                                        roleInTable.user_access_id === user.userd_id
                                    );
                                  
                                    const userRole = roleEntry?.role === 'editor' ? 'Ver y Editar' : 'Solo Ver';
                                  
                                    return (
                                      <li key={user.user_id} className="flex items-center mb-3 text-left w-full justify-start">
                                        <Dot />
                                        <p className="overflow-hidden text-ellipsis w-fit mr-2 whitespace-nowrap pl-1 text-md">
                                          {`${user.user_name} ${user.user_lastname}`} - {user.user_dni} <small className="ml-0">(D.N.I.)</small>
                                        </p>
                                    
                                        <Select className="w-max">
                                          <SelectTrigger className="w-fit ml-0 mr-auto" disabled>
                                            {userRole} {" "}
                                          </SelectTrigger>
                                        </Select>
                                    
                                        {user?.user_id === userLoged_id && (
                                          <AlertDialog>
                                            <AlertDialogTrigger>
                                              <XSquare
                                                size={23}
                                                className="cursor-pointer hover:text-red-500 transition-all ml-auto"
                                              />
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                              <AlertDialogHeader>
                                                <AlertDialogTitle className="text-center">
                                                  Estás a punto de sacarte el acceso a este grupo
                                                </AlertDialogTitle>
                                                <AlertDialogDescription className="text-center">
                                                  El creador del grupo deberá volver a darte acceso en caso de querer
                                                  recuperarlo.
                                                </AlertDialogDescription>
                                              </AlertDialogHeader>
                                              <AlertDialogFooter className="sm:justify-center justify-evenly flex flex-row items-center">
                                                <AlertDialogCancel className="h-10 mt-0">Cancelar</AlertDialogCancel>
                                                <AlertDialogAction
                                                  className="h-10"
                                                  disabled={loadingRemoveAccess}
                                                  onClick={(e) => handleRemoveAccess(user.user_id, grupo.id, e)}
                                                >
                                                  {loadingRemoveAccess ? "Borrando acceso" : "Borrarme"}
                                                </AlertDialogAction>
                                              </AlertDialogFooter>
                                            </AlertDialogContent>
                                          </AlertDialog>
                                        )}
                                      </li>
                                    );
                                  })
                              ) : (
                                <li className="text-gray-500 text-sm w-full">Nadie más tiene acceso a este grupo.</li>
                              )}

                              <p className="text-sm text-center w-full text-muted-foreground">
                                Solo puedes borrarte a ti mismo
                              </p>
                            </ul>

                          </div>
                        </div>
                      </div>
                          
                      <DialogFooter className="sm:justify-center gap-y-5 gap-x-6 mt-4">                  
                          
                        <DialogClose asChild>
                          <Button className="px-10"> Cerrar </Button>
                        </DialogClose>
                          
                      </DialogFooter>
                          
                    </DialogContent>
                  </Dialog>
                ))}
            </section>
            ) : 
              showSkeleton 
              ? <SkeCard />
              : <div className="flex flex-col items-center justify-center gap-y-4">
                  <p className="text-xl font-medium text-gray-500">
                    No tienes grupos compartidos
                  </p>
                </div>
            }
        </div>
    );
}         


