
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button } from "../ui/button";
import { useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { EditIcon, UserPlus, FileChartColumnIcon, Dot, ChevronsRight, CalendarDays, Building2, Wallet, Globe, XSquare } from "lucide-react";
import useFetch from "../../hooks/use-fetch";
import { getGrupos, insertGrupo, editGroupName, removeGrupo, editAccess } from "../../database/crudGrupos";
import { useUser } from '../../hooks/use-user'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "../ui/dialog"
import {Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { getDeptos } from "../../database/crudDeptos";
import { getBalances } from "../../database/crudBalances";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import SkeCard from "../grupos/skeletonCardsGroups";
import { Separator } from "../ui/separator"
import HandleUsers from "../propiedades/HandleUsers";
import { getAllUser } from "../../database/crudUsers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Skeleton } from "../ui/skeleton";




export default function DashboardGrupos() {
  const [isOpen, setIsOpen] = useState(false)

  const [loadingDelete, setLoadingDelete] = useState(false)

  const userLoged_id = useUser()
  const [usersInfo, setUsersInfo] = useState([])

  const [createGrupoInfo, setCreateGrupoInfo] = useState({
    userId: userLoged_id,
    nombreGrupo: "",
    shared_with: []
  });
  const [getGrupoInfo, setGetGrupoInfo] = useState([]);

  const navigate = useNavigate();
  const [validated, setValidated] = useState(true)
  const [cerrar, setCerrar] = useState(false)


  const [inputBorrar, setInputBorrar ] = useState('')
  const [disabledContinue, setDisabledContinue ] = useState(true)

  const [editName, setEditName ] = useState(false)
  const [id_NewName, setNewName] = useState({
    idGrupo: '',
    newGroupName: '',
  })

  const [addUserAccess, setAddUserAccess ] = useState(false)
  
  const [selectedUser, setSelectedUser] = useState("");

  const [id_NewAccess, setId_NewAccess] = useState({
    arrayUsersId: [],
    grupoId: '',
  })

  useEffect(() => {
    
    if(inputBorrar === 'CONFIRMO BORRAR TODO') {
      return setDisabledContinue(false)
    } else {
      return setDisabledContinue(true)
    }

  }, [inputBorrar])

  const { error: errorUpdateName, fn: fnUpdateNameGroup } = useFetch(editGroupName, { id_NewName } )
  
  useEffect(() => {
    if (id_NewName.idGrupo && id_NewName.newGroupName) {
      console.log(id_NewName)
      fnUpdateNameGroup({id_NewName}) 

      if(errorUpdateName) return console.error(errorUpdateName)
      
      setGetGrupoInfo(prevInfo =>
        prevInfo.map(grupo =>
          grupo.grupo_id === id_NewName.idGrupo
            ? { ...grupo, grupo_name: id_NewName.newGroupName }              
            : grupo
        )
      );

      setNewName({
        idGrupo: '',
        newGroupName: '',
      })
      setEditName(false)
      
    } 
  }, [id_NewName.idGrupo, id_NewName.newGroupName])

  const handleRemoveAccess = async (userId, grupoId) => {

    const grupo = getGrupoInfo.find(g => g.grupo_id === grupoId);
    if (!grupo) return;

    const newSharedWith = grupo.shared_with.filter(id => id !== userId);
    
    const id_NewAccess = {
      arrayUsersId: newSharedWith,
      grupoId: grupoId,
    };

    try {
      const response = await editAccess(id_NewAccess);

      if (response === null) throw new Error("Failed to update access");

      setGetGrupoInfo((prevGrupos) =>
        prevGrupos.map((g) =>
          g.grupo_id === grupoId
            ? { ...g, shared_with: newSharedWith }
            : g
        )
      );

    } catch (error) {
      console.error("Error updating access:", error);
    }

  };

  const handleAddAccess = async (grupoId) => {
    if (!selectedUser) return;

    const grupo = getGrupoInfo.find(g => g.grupo_id === grupoId);
    if (!grupo) return;

    const currentSharedWith = Array.isArray(grupo.shared_with) ? grupo.shared_with : [];
    const newSharedWith = [...new Set([...currentSharedWith, selectedUser])];
    
    const id_NewAccess = {
      arrayUsersId: newSharedWith,
      grupoId: grupoId,
    };

    try {
      const response = await editAccess(id_NewAccess);

      if (response === null) throw new Error("Failed to update access");

      setGetGrupoInfo((prevGrupos) =>
        prevGrupos.map((g) =>
          g.grupo_id === grupoId
            ? { ...g, shared_with: newSharedWith }
            : g
        )
      );

      setSelectedUser("");
      setAddUserAccess(false);

    } catch (error) {
      console.error("Error updating access:", error);
    }
  };

  const handleDeleteGrupo = async (grupoId) => {

   try {
    await removeGrupo(grupoId)
    setLoadingDelete(true)
    setTimeout(() => {
      const filtrar = getGrupoInfo.filter( grupo => grupo.grupo_id !== grupoId)
      setGetGrupoInfo(filtrar)
      setLoadingDelete(false)
      setInputBorrar('')
    }, 2500);

   } catch (error) {
      setLoadingDelete(false)
      console.error("Error al crear el grupo:", error.message || error);
    }

  }

  useEffect(() => {
    if (userLoged_id) {
      setCreateGrupoInfo((prevInfo) => ({
        ...prevInfo,
        userId: userLoged_id,
      }));
    }
  }, [userLoged_id]);

  const { data: balances, error: errorGetBalances,  fn: fnGetBalances } = useFetch(getBalances, { userId: userLoged_id});

  const { data: deptos, error: errorDeptos, fn: fnGetDeptos } = useFetch(getDeptos, {user_id: userLoged_id});

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
        const mappedGrupos = grupos.reverse().map(grupo => ({
            grupo_id: grupo.id,
            grupo_name: grupo.grupo_name, 
            user_id: grupo.user_id,
            shared_with: grupo.shared_with,
            grupo_createdAt: grupo.created_at
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

  const handleSelectUserChange = (value) => {
    let arrayUsersId = [] 
    value?.map(user => arrayUsersId.push(user.user_id))

    setCreateGrupoInfo({...createGrupoInfo, shared_with: arrayUsersId})
  }

  const handleCreateGrupo = async (e) => {
    e.preventDefault();
    setCerrar(true)

    try {
        if (userLoged_id) {
            const result = await insertGrupo({ createGrupoInfo });  // Llamada directa a insertGrupo

            setTimeout(() => {
              setIsOpen(false)
              setCerrar(false)
                if (result && result.length > 0) {
                setGetGrupoInfo((prev) => [
                    ...prev,
                    {
                        grupo_id: result[0].id,
                        grupo_name: result[0].grupo_name,
                        grupo_createdAt: result[0].created_at,
                        shared_with: result[0].shared_with,
                        user_id: result[0].user_id,
                    },
                ]);

                setCreateGrupoInfo({ ...createGrupoInfo, nombreGrupo: '' });
              }
            }, 2000);
            
        }
    } catch (error) {
      console.error("Error al crear el grupo:", error.message || error);
    }
  };

  //MANEJAR EL FLUJO DE USUARIOS CON ACCESO
  const { loading, data, error, fn: fnGetAllUsers } = useFetch(getAllUser, {});

  useEffect(() => {
    if (userLoged_id) {
      fnGetAllUsers();
    }
  }, [userLoged_id]);

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

  return (
    <div className={`w-full py-10`}>


      {/* Add new group */}
      <div className="flex sm:justify-between items-center mb-10 flex-wrap gap-y-3 justify-center">
        <h1 className="text-3xl font-medium text-[#194567] flex justify-between">
          Todos los Grupos
        </h1>
        <div>
          {/* CREAR GRUPO NUEVO */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className="bg-green-600 rounded-lg text-white h-10 px-6 font-bold text-md hover:bg-green-800 w-full">
                Crear nuevo grupo
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Crea un nuevo grupo para tus propiedades
                </DialogTitle>
                <DialogDescription className="flex flex-col gap-4 mt-3 mb-3">
                  <Label className="mt-8 font-bold spaceGrotesk text-lg "> Nombre del grupo </Label>
                  <p className="font-semibold text-orange-400 -mt-3">
                    Asegurate de que no se repitan los nombres entre grupos.
                  </p>
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

                  <HandleUsers onSelectUserChange={handleSelectUserChange} />

                  <Button
                    className={`flex justify-center w-full mt-3 ${
                      cerrar ? "bg-green-600 hover:bg-gree-600" : "bg-black"
                    }`}
                    disabled={validated}
                    onClick={(e) => handleCreateGrupo(e)}
                  >
                    {cerrar ? "Creado" : "Agregar"}
                  </Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

      </div>
      
      
      {loadingGetGrupos ? (
        <SkeCard />
      ) : getGrupoInfo?.length > 0 ? (
        <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-14 gap-y-6">
          {getGrupoInfo?.map((grupo) => (

            <Dialog key={grupo.grupo_id}>
              <DialogTrigger asChild>

                {/* CARDS DE CADA GRUPO */}
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
                          if (e.key === "p") {
                            ("");
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

                {/* Render de los DEPTOS */}
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
                                    if (e.key === "g") {
                                      ("");
                                    }}             
                                  }
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

                {/* Render de los BALANCES */}
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
                        .map((balance, i) => (
                          <li key={balance.id} className="flex mb-2">
                            <div className="flex items-center border-b py-3 justify-between w-full">
                              <div className="h-full flex flex-row items-center ">
                                <Dot /> {balance.mes_balance},{" "}
                                {balance.año_balance}
                                <a
                                  href={`${balance.url_excel}`} // URL directa del archivo
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
                                    if (e.key === "g") {
                                      ("");
                                    }}             
                                  }
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

                {/* Render de los ACCESOS */}
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
                  >
                    <UserPlus className="mr-2 h-4 w-4" /> Agregar accesos
                  </Button>

                  {addUserAccess && (
                    <div className="mt-4">
                      <Select 
                        value={selectedUser} 
                        onValueChange={setSelectedUser}
                        disabled={loading || usersInfo.filter(user => 
                          user.user_id !== userLoged_id && 
                          !(Array.isArray(grupo.shared_with) ? grupo.shared_with : []).includes(user.user_id)
                        ).length === 0}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar usuario" />
                        </SelectTrigger>
                        <SelectContent>
                          {loading ? (
                            <>
                              <Skeleton className="w-2/4 h-5 ml-4 my-3 bg-gray-200" />
                              <Skeleton className="w-2/4 h-5 ml-4 mb-2 bg-gray-200" />
                            </>
                          ) : usersInfo.filter(user => 
                              user.user_id !== userLoged_id && 
                              !(Array.isArray(grupo.shared_with) ? grupo.shared_with : []).includes(user.user_id)
                            ).length > 0 ? (
                            usersInfo
                              .filter(user => 
                                user.user_id !== userLoged_id && 
                                !(Array.isArray(grupo.shared_with) ? grupo.shared_with : []).includes(user.user_id)
                              )
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
                            <div className="p-2 text-sm text-gray-500">
                              No hay usuarios disponibles para agregar
                            </div>
                          )}
                        </SelectContent>
                      </Select>

                      <div className="flex justify-center gap-x-5 pb-4 pt-4">
                        <Button
                          className="bg-red-600 hover:bg-red-700 text-sm h-8 text-white"
                          onClick={() => {
                            setAddUserAccess(false);
                            setSelectedUser("");
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-sm h-8 text-white"
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
                    <Button> Cerrar </Button>
                  </DialogClose>

                  {/* BOTON PARA BORRAR GRUPO */}
                  <AlertDialog>
                    <AlertDialogTrigger className={`bg-red-600 hover:bg-red-700 ${loadingDelete ? 'opacity-50' : 'opacity-100'} text-white p-2 px-4 rounded-md`} disabled={loadingDelete}>
                      {loadingDelete ? 'Borrando grupo...' : 'Borrar Grupo'}
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
                        <AlertDialogCancel onClick={() => setInputBorrar("")}>
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={ () => handleDeleteGrupo(grupo.grupo_id)}
                          disabled={disabledContinue}
                        >
                          Continuar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                      <div>
                        <Label>
                          {" "}
                          Escribe{" "}
                          <strong className="px-2">
                            {" "}
                            CONFIRMO BORRAR TODO{" "}
                          </strong>{" "}
                          para confirmar esta accion
                        </Label>
                        <Input
                          className="mt-4"
                          type="text"
                          value={inputBorrar}
                          onChange={(e) =>
                            setInputBorrar(
                              e.target.value.trimStart().toUpperCase()
                            )
                          }
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

        //COMPONENTE DE NO HAY GRUPOS
        <div className="w-full flex justify-center h-56">
          <Card className="w-96 h-32 mt-3 flex flex-col justify-center text-center shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-medium"> 
                No hay grupos creados por el momento
              </CardTitle>
            </CardHeader>
          </Card>
          
        </div>
      )}
    </div>
  );
}
