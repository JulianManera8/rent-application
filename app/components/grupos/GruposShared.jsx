/* eslint-disable react-hooks/exhaustive-deps */
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "../ui/dialog"
import SkeCard from "../grupos/skeletonCardsGroups";
import {Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { EditIcon, UserPlus, FileLineChartIcon as FileChartColumnIcon, Dot, ChevronsRight, Building2, Globe, XSquare, Search } from 'lucide-react';
import { Separator } from "../ui/separator"
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useUser } from '../../hooks/use-user'
import { getAccessGrupos } from '../../database/crudAccess/crudAccessGrupos';


export default function GruposShared() {

  const userLoged_id = useUser();
  const [accessGrupos, setAccessGrupos] = useState([]);
  const [loadingGetGrupos, setLoadingGetGrupos] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAccessGrupos() {
      if (userLoged_id) {
        try {
          setLoadingGetGrupos(true);
          const data = await getAccessGrupos(userLoged_id);
          setAccessGrupos(data);
        } catch (err) {
          console.error("Error fetching access grupos:", err);
          setError(err.message);
        } finally {
          setLoadingGetGrupos(false);
        }
      }
    }

    fetchAccessGrupos();
  }, [userLoged_id]);

  console.log(accessGrupos)

  return (
    <div className={`w-full py-10`}>
        <div className="flex sm:justify-between items-center mb-10 flex-wrap gap-y-3 justify-center">
          <h1 className="text-3xl font-medium text-[#194567] flex justify-between">
            Grupos que me compartieron perrrrrrooooooooooooooooo
          </h1>
        </div>

        {loadingGetGrupos ? (
          <SkeCard />
        ) : accessGrupos?.length > 0 ? (
          <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-14 gap-y-6">
            {accessGrupos?.map((grupo) => (
              <Dialog key={grupo.grupo_id}>
                <DialogTrigger asChild>
            
                  {/* CARDS DE LOS GRUPOS */}
                  <Card className="shadow-lg my-5 relative bg-gradient-to-br from-sky-100/50 to-white hover:border-gray-300 transition-all border-2 border-gray-100 cursor-pointer min-w-[330px] min-h-[460px]">
                    <CardHeader className="h-1/5">
                      <CardTitle>Grupo: {grupo.grupo_name} </CardTitle>
                      <CardDescription className="pt-1">
                        Creado en fecha: {new Date(grupo.grupo_createdAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative h-4/5">

                      <div className="h-[36%]">
                        <p className="mb-2 text-lg font-medium flex items-center gap-x-2">
                          <Building2 className="w-4 h-4"/> Propiedades del grupo:
                        </p>
                        {deptos?.filter(
                          (depto) => depto?.grupo_id === grupo?.grupo_id
                        ).length > 0 ? (
                          deptos
                            ?.filter(
                              (depto) => depto?.grupo_id === grupo?.grupo_id
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

                      <div className="h-1/2">
                        <p className="mb-2 text-lg font-medium flex items-center gap-x-2">
                          <FileChartColumnIcon className="w-4 h-4"/> Balances del grupo:
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
                          <p className="text-sm text-muted-foreground">No hay balances asignados a este grupo.</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-2">
                          <Globe />
                          Compartido a: { grupo?.shared_with ? (grupo.shared_with.length ) : 0} usuarios 
                        </div>
                        <div className=" flex items-center gap-x-2">
                          <EditIcon />
                          <p>Abrir </p>
                        </div>
                      </div>

                    </CardContent>
                  </Card>
                    
                </DialogTrigger>
                <DialogContent className="max-h-[90%] md:min-w-[440px] w-11/12 rounded-md overflow-auto">
                    
                  <DialogHeader>
                    {editName ? (
                      <div className="space-y-2">
                        <Label className="text-lg">
                          {" "}
                          Escribe el nuevo nombre{" "}
                        </Label>
                        <Input
                          type="text"
                          value={id_NewName.newGroupName}
                          onChange={(e) => setNewName({...id_NewName, newGroupName: e.target.value})}
                        />
                        <div className="flex justify-center gap-x-5 pb-4 pt-3">
                          <Button
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => {
                              setEditName(!editName), setNewName("");
                            }}
                          >
                            {" "}
                            Cancelar{" "}
                          </Button>
                          <Button
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => setNewName({ ...id_NewName, idGrupo: grupo.grupo_id })}
                          >
                            {" "}
                            Confirmar{" "}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <DialogTitle className="text-2xl justify-center sm:justify-between gap-y-2 w-full flex flex-wrap items-center gap-x-8">
                        <p>
                          Grupo: {grupo.grupo_name}
                        </p>
                        <div
                          className="text-2xl flex items-center gap-x-1 text-gray-400 hover:text-blue-500 cursor-pointer transition-all mr-0 sm:mr-5"
                          onClick={() => setEditName(!editName)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setEditName(!editName);
                            }
                          }}
                        >
                          <EditIcon size={22} className="cursor-pointer" />
                          <p className="text-xs cursor-pointer">Editar nombre</p>
                        </div>
                      </DialogTitle>
                    )}
                    <DialogDescription className="text-gray-400 text-md">
                      Creado en fecha: {new Date(grupo.grupo_createdAt).toLocaleDateString()}
                    </DialogDescription>
                  </DialogHeader>
                
                  {/* RENDER DE DEPTOS */}
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2 underline-offset-custom">
                      Propiedades:
                    </h3>
                    <ul>
                      {deptos?.filter(
                        (depto) => depto?.grupo_id === grupo?.grupo_id
                      ).length > 0 ? (
                        deptos
                          ?.filter((depto) => depto?.grupo_id === grupo?.grupo_id)
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
                                        navigate(`/dashboard/deptos/${depto.id}`, {
                                          state: { infoDepto: depto },
                                        });
                                      }
                                    }}             
                                    onClick={() =>
                                      navigate(`/dashboard/deptos/${depto.id}`, {
                                        state: { infoDepto: depto },
                                      })
                                    }
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
                  
                  {/* CARDS DE LOS BALANCES */}
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2 underline-offset-custom">
                      Balances:
                    </h3>
                    <ul>
                      {balances?.filter(
                        (balance) => balance?.grupo_id === grupo?.grupo_id
                      ).length > 0 ? (
                        balances
                          ?.filter(
                            (balance) => balance?.grupo_id === grupo?.grupo_id
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
                                    onClick={() => navigate(`/dashboard/money`)}
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
                        <ul>
                          {Array.isArray(grupo?.shared_with) && grupo.shared_with.length > 0 ? (
                          usersInfo
                            .filter((user) => grupo.shared_with.includes(user?.user_id))
                            .map((user, i) => (
                              <li key={i} className="flex items-center mb-3 text-left w-full">
                                <Dot />
                                <p className="overflow-hidden text-ellipsis w-full mr-4 whitespace-nowrap pl-1 text-md">
                                  {user.user_name + " " + user.user_lastname} - {user.user_dni}{" "}
                                  <small>(D.N.I.)</small>
                                </p>
                                <AlertDialog>
                                  <AlertDialogTrigger>
                                    <XSquare
                                      size={20}
                                      className="cursor-pointer hover:text-red-500 transition-all ml-auto"
                                    />
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle className="text-center">
                                        Estás a punto de sacar el acceso a <span className="text-red-600">{user.user_name + " " + user.user_lastname}</span> de este grupo
                                      </AlertDialogTitle>
                                      <AlertDialogDescription className="text-center">
                                        Puedes volver a darle acceso luego si quieres
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="sm:justify-center justify-evenly flex flex-row items-center">
                                      <AlertDialogCancel className="h-10 mt-0">Cancelar</AlertDialogCancel>
                                      <AlertDialogAction
                                        className="h-10"
                                        onClick={() => handleRemoveAccess(user.user_id, grupo.grupo_id)}
                                      >
                                        Sacar Acceso
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </li>
                            ))
                          ) : (
                            <li className="text-gray-500 text-sm w-full">Nadie más tiene acceso a este grupo.</li>
                          )}
                        </ul>
                      </div>
                      <div className="w-full mt-2">
                          <Button 
                            className={`${addUserAccess ? 'hidden' : 'flex'}`}
                            variant='outline'
                            onClick={() => setAddUserAccess(!addUserAccess)}
                            disabled={selectedUser}
                          >
                            <UserPlus className="mr-2 h-4 w-4" /> Agregar accesos
                          </Button>
                          {addUserAccess && (
                            <div className="mt-4">
                              <Select 
                                onOpenChange={(open) => setIsSelectOpen(open)} 
                                onValueChange={(value) => {
                                  setSelectedUser(value);
                                  setIsSelectOpen(false);
                                }} 
                                open={isSelectOpen}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Elegir Usuarios" />
                                </SelectTrigger>
                                <SelectContent>
                                  <div className="flex items-center border-b px-3 pb-2">
                                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                    <Input
                                      placeholder="Buscar usuarios..."
                                      value={searchTerm}
                                      onChange={(e) => setSearchTerm(e.target.value)}
                                      className="border-0 bg-transparent p-1 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                  </div>
                                  {loading ? (
                                    <>
                                      <Skeleton className="w-2/4 h-5 ml-4 my-3 bg-gray-200" />
                                      <Skeleton className="w-2/4 h-5 ml-4 mb-2 bg-gray-200" />
                                    </>
                                  ) : filteredUsers.length > 0 ? (
                                    filteredUsers
                                      .filter(user => !(grupo.shared_with || []).includes(user.user_id))
                                      .map((user) => (
                                        <SelectItem
                                          key={user.user_id}
                                          value={user.user_id}
                                          className="flex items-center w-full"
                                        >
                                          <p className="overflow-hidden text-ellipsis whitespace-nowrap pl-1 text-md">
                                            {user.user_name + " " + user.user_lastname} - {user.user_dni}{" "}
                                            <small>(D.N.I.)</small>
                                          </p>
                                        </SelectItem>
                                      ))
                                  ) : (
                                    <p className="my-2 ml-2">No se encontraron usuarios.</p>
                                  )}
                                </SelectContent>
                              </Select>
                              <div className="flex justify-center gap-x-5 pb-4 pt-3">
                                <Button
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                  onClick={() => {
                                    setAddUserAccess(false);
                                    setSelectedUser("");
                                  }}
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => handleAddAccess(grupo.grupo_id)}
                                  disabled={!selectedUser}
                                >
                                  Confirmar
                                </Button>
                              </div>
                            </div>
                          )}
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
        ) : (
          <div className="flex flex-col items-center justify-center gap-y-4">
            <p className="text-xl font-medium text-gray-500">
              No tienes grupos compartidos
            </p>
          </div>
        )}

    
    
    
    </div>
    );
}       