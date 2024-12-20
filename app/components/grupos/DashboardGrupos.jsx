/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { Button } from "../ui/button";
import { useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Pencil, UserPlus, FileLineChartIcon as FileChartColumnIcon, Dot, ChevronsRight, Building2, Globe, XSquare, Search, ExpandIcon, CheckSquareIcon } from 'lucide-react';
import useFetch from "../../hooks/use-fetch";
import { getGrupos, insertGrupo, editGroupName, removeGrupo, editRoleUser,  editAccess, setRoleUser, getRoleUser, removeRoleUser } from "../../database/crudGrupos";
import { useUser } from '../../hooks/use-user'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "../ui/dialog"
import {Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { getDeptos } from "../../database/crudDeptos";
import { getBalances } from "../../database/crudBalances";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,AlertDialogHeader, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import SkeCard from "../grupos/skeletonCardsGroups";
import { Separator } from "../ui/separator"
import { getAllUser } from "../../database/crudUsers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Skeleton } from "../ui/skeleton";

export default function DashboardGrupos() {
  const [isOpen, setIsOpen] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const userLoged_id = useUser()
  const [usersInfo, setUsersInfo] = useState([])
  const [role, setRole] = useState('viewer')
  const [rolePerUser, setRolePerUser] = useState([])
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
  const [searchTerm, setSearchTerm] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true)

  const { data: balances, error: errorGetBalances,  fn: fnGetBalances } = useFetch(getBalances, { userId: userLoged_id});
  const { data: deptos, error: errorDeptos, fn: fnGetDeptos } = useFetch(getDeptos, {user_id: userLoged_id});
  const { loading: loadingGetGrupos, data: grupos, error: errorGetGrupos, fn: fnGetGrupos } = useFetch(getGrupos, {user_id: userLoged_id});
  const { error: errorUpdateName, fn: fnUpdateNameGroup } = useFetch(editGroupName, { id_NewName } )
  const { data: rolesUsers, error: errorGetRoles, fn: fnGetRoleUser} = useFetch(getRoleUser, {user_id: userLoged_id} )
  const { loading, data, error, fn: fnGetAllUsers } = useFetch(getAllUser, {});

  useEffect(() => {
    if(!loadingGetGrupos) {
      setTimeout(() => {
        setShowSkeleton(false)
      }, (4000));
    }
  }, [loadingGetGrupos])

  useEffect(() => {
    if(inputBorrar === 'CONFIRMO BORRAR TODO') {
      return setDisabledContinue(false)
    } else {
      return setDisabledContinue(true)
    }
  }, [inputBorrar])

  useEffect(() => {
    if (id_NewName.idGrupo && id_NewName.newGroupName) {
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
    // Obtener el grupo
    const grupo = getGrupoInfo.find((g) => g.grupo_id === grupoId);
    if (!grupo) {
      console.error(`Grupo con ID ${grupoId} no encontrado`);
      return;
    }
  
    // Actualizar el array `shared_with` eliminando al usuario
    const newSharedWith = grupo.shared_with.filter((id) => id !== userId);
  
    // Crear el objeto con datos necesarios
    const id_NewAccess = {
      arrayUsersId: newSharedWith,
      grupoId: grupoId,
    };
  
    try {
      // Actualizar acceso (Supabase)
      console.log("Actualizando acceso...");
      const response = await editAccess(id_NewAccess);
      if (!response) {
        console.error("La respuesta de editAccess es nula o indefinida");
        throw new Error("Falló al actualizar acceso en la base de datos");
      }
      console.log("Acceso actualizado exitosamente");
  
      // Eliminar rol del usuario (Supabase)
      console.log("Eliminando rol del usuario...");
      const responseDeleteRole = await removeRoleUser(grupoId, userId);
      if (responseDeleteRole === null) {
        console.error("La respuesta de removeRoleUser es nula");
        throw new Error("Falló al eliminar rol del usuario");
      }
      console.log("Rol del usuario eliminado exitosamente");
  
      // Actualizar estado local (grupos)
      setGetGrupoInfo((prevGrupos) =>
        prevGrupos.map((g) =>
          g.grupo_id === grupoId ? { ...g, shared_with: newSharedWith } : g
        )
      );
  
      // Actualizar estado local (roles)
      setRolePerUser((prevRoles) =>
        prevRoles.filter((role) => role.user_with_access.id !== userId)
      );
  
      console.log(`Acceso eliminado correctamente para el usuario ${userId}`);
    } catch (error) {
      console.error("Error al actualizar acceso:", error.message);
      // You might want to show an error message to the user here
    }
  };

  const handleAddAccess = async (grupoId) => {
  if (!selectedUser) {
    console.error("No user selected");
    return;
  }

  const grupo = getGrupoInfo.find(g => g.grupo_id === grupoId);
  if (!grupo) {
    console.error("Group not found");
    return;
  }

  const currentSharedWith = Array.isArray(grupo.shared_with) ? grupo.shared_with : [];
  const newSharedWith = [...new Set([...currentSharedWith, selectedUser])];
  
  const id_NewAccess = {
    userLoged_id: userLoged_id,
    arrayUsersId: newSharedWith,
    grupoId: grupoId,
    selectedUser: selectedUser,
    roleUser: role
  };

  try {
    const responseHandleAccess = await editAccess(id_NewAccess);
    const responseSetRole = await setRoleUser(id_NewAccess);
    
    if (!responseHandleAccess) throw new Error("Failed to update access");
    if (!responseSetRole) throw new Error("Failed to set role");

    setGetGrupoInfo((prevGrupos) =>
      prevGrupos.map((g) =>
        g.grupo_id === grupoId
          ? { ...g, shared_with: newSharedWith }
          : g
      )
    );

    // Update rolePerUser state immediately
    setRolePerUser((prevRoles) => [
      ...prevRoles,
      {
        grupo: grupoId,
        user_with_access: usersInfo.find(user => user.user_id === selectedUser),
        role: role
      }
    ]);

    // Refresh the roles from the server
    fnGetRoleUser({userLoged_id});

    setSelectedUser("");
    setAddUserAccess(false);
  } catch (error) {
    console.error("Error updating access:", error);
  } finally {
    setRole('viewer');
  }
};

  const handleRoleChange = async (userId, grupoId, newRole) => {

    const updateRole = {
      userLoged_id: userLoged_id,
      grupoId: grupoId,
      selectedUser: userId,
      roleUser: newRole
    }

    try {
      const response = await editRoleUser({updateRole});
      console.log(response);
      if (!response) throw new Error("Failed to update role");

      // Update local state
      setRolePerUser((prevRoles) =>
        prevRoles.map((role) =>
          role.user_with_access.id === userId && role.grupo === grupoId
            ? { ...role, role: newRole }
            : role
        )
      );

      console.log(`Role updated successfully for user ${userId}`);
    } catch (error) {
      console.error("Error updating role:", error);
      // You might want to show an error message to the user here
    }
  };

  console.log(role)

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
    if(userLoged_id) {
        setCreateGrupoInfo((prevInfo) => ({
          ...prevInfo,
          userId: userLoged_id,
        }));
        fnGetGrupos(userLoged_id)
        if(errorGetGrupos) return console.error(errorGetGrupos)
        fnGetDeptos(userLoged_id)
        if(errorDeptos) return console.error(errorGetGrupos)
        fnGetBalances(userLoged_id)
        if(errorGetBalances) return console.error(errorGetBalances)
        fnGetRoleUser({userLoged_id})
        if(errorGetRoles) return console.error(errorGetBalances)
        fnGetAllUsers();
    }
  }, [userLoged_id])

  useEffect(() => {
    if(grupos && grupos.length > 0) {
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

  useEffect(() => {
    if(rolesUsers) {
      const arrayAgrupado = agruparUserRole(rolesUsers)
      setRolePerUser(arrayAgrupado)
    }
  }, [rolesUsers, data]); // Added data to the dependency array

  const handleCreateGrupo = async (e) => {
    e.preventDefault();
    setCerrar(true)
    try {
        if (userLoged_id) {
            const result = await insertGrupo({ createGrupoInfo });
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

  const filteredUsers = usersInfo ? usersInfo.filter(
    (user) =>
      user.user_id !== userLoged_id &&
      (user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_dni.includes(searchTerm))
  ) : [];

  function agruparUserRole(rolesUsers) {
    if (!rolesUsers || !data) return [];

    const allUsers = data;

    const arrayGeneral = rolesUsers.map((grupo) => ({
      grupo: grupo.grupo_id,
      user_with_access: allUsers.find(user => user.id === grupo.user_id_access) || null,
      role: grupo.role,
      grupo_id: grupo.grupo_id
    }));

    return arrayGeneral
  }

  return (
    <div className={`w-full py-10`}>
      <div className="flex sm:justify-between items-center mb-7 flex-wrap gap-x-6  gap-y-3 justify-center">
        <h1 className="sm:text-3xl text-2xl font-medium text-[#194567] flex justify-between">
          Mis Grupos
        </h1>
        <div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className="bg-green-600 rounded-lg text-white h-10 px-6 font-bold text-md hover:bg-green-800 w-full">
                Crear nuevo grupo
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-lg">
                  Crea un nuevo grupo para tus propiedades
                </DialogTitle>
                <DialogDescription> Completa el nombre y puedes compartir el acceso a otros usuarios.</DialogDescription>

                <div className="flex flex-col gap-4 mb-3">
                  <Label className="mt-8 font-bold spaceGrotesk text-md "> Nombre del grupo </Label>
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
                  <Button
                    className={`flex justify-center w-full mt-3 ${
                      cerrar ? "bg-green-600 hover:bg-gree-600" : "bg-black"
                    }`}
                    disabled={validated}
                    onClick={(e) => handleCreateGrupo(e)}
                  >
                    {cerrar ? "Creado" : "Agregar"}
                  </Button>
                </div>
                
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

                {/* CARDS DE LOS GRUPOS */}
                <Card className="shadow-lg my-5 bg-gradient-to-br from-sky-100/70 to-white hover:border-gray-300 transition-all border-2 border-gray-100 cursor-pointer min-w-[310px] min-h-[460px]">
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
                      <div className="flex items-center gap-x-2 text-sm">
                        <Globe size={20}/>
                        Compartido con: { grupo?.shared_with ? (grupo.shared_with.length ) : 0} 
                      </div>
                      <div className=" flex items-center gap-x-2">
                        <ExpandIcon size={17}/>
                        <p>Abrir </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </DialogTrigger>
              <DialogContent className="max-h-[90%] md:min-w-[440px] w-11/12 rounded-md overflow-auto">

              <DialogHeader>
                <div className="flex items-center justify-between w-full">
                  {editName ? (
                    <div className="flex items-center space-x-4 w-10/12">
                      <Input
                        value={id_NewName.newGroupName}
                        onChange={(e) => setNewName({...id_NewName, newGroupName: e.target.value})}
                        className="flex-grow text-lg mr-2 font-semibold"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => { setEditName(!editName), setNewName(""); }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <XSquare className="h-4 w-4 text-red-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setNewName({ ...id_NewName, idGrupo: grupo.grupo_id })} 
                        className="text-green-500 hover:text-green-700"
                      >
                        <CheckSquareIcon className="h-4 w-4 text-green-600" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <DialogTitle className="md:text-2xl text-lg text-left font-bold">
                        Grupo: {grupo.grupo_name}
                      </DialogTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditName(!editName)}
                        className="text-gray-500 hover:text-blue-500"
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar nombre
                      </Button>
                    </>
                  )}
                </div>
                <DialogDescription className="text-gray-500 text-sm mt-2">
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
                                        state: { dataDepto: depto, infoGrupo: grupo },
                                      });
                                    }
                                  }}             
                                  onClick={() =>
                                    navigate(`/dashboard/deptos/${depto.id}`, {
                                      state: { dataDepto: depto, infoGrupo: grupo },
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
                      <ul className="w-full">
                      {Array.isArray(grupo?.shared_with) && grupo.shared_with.length > 0 && usersInfo ? (
                          usersInfo.filter((user) => grupo.shared_with.includes(user?.user_id)).map((user) => {
                              const userRole = rolePerUser.find((role) => role?.user_with_access.id === user.user_id && role.grupo_id === grupo.grupo_id)?.role || 'viewer';

                              return (
                                <li key={user.user_id} className="flex items-center mb-3 text-left w-full justify-start">
                                  <Dot />
                              
                                  {/* User Info */}
                                  <p className="overflow-hidden text-ellipsis w-fit mr-2 whitespace-nowrap pl-1 text-md">
                                    {`${user.user_name} ${user.user_lastname}`} - {user.user_dni} <small className="ml-0">(D.N.I.)</small>
                                  </p>
                              
                                  <Select 
                                    value={userRole} 
                                    className="w-max"
                                    onValueChange={(value) => {
                                      handleRoleChange(user.user_id, grupo.grupo_id, value)
                                      setRole(value)
                                    } }
                                  >
                                    <SelectTrigger className="w-fit ml-0 mr-auto">
                                      <SelectValue placeholder="Seleccionar rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="viewer">Solo Ver</SelectItem>
                                      <SelectItem value="editor">Ver y Editar</SelectItem>
                                    </SelectContent>
                                  </Select>


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
                                          Estás a punto de sacar el acceso a{" "}
                                          <span className="text-red-600">
                                            {`${user.user_name} ${user.user_lastname}`}
                                          </span>{" "}
                                          de este grupo
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className="text-center">
                                          Puedes volver a darle acceso luego si quieres.
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
                              );
                            })
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
                          <div className="mt-4 space-y-6">
                            {/* SELECT DEL USUARIO PARA DARLE ACCESO */}
                            <Select 
                              onOpenChange={(open) => setIsSelectOpen(open)} 
                              onValueChange={(value) => {
                                setSelectedUser(value);
                                setIsSelectOpen(false);
                              }} 
                              open={isSelectOpen}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Elegir Usuario" />
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
                                          {user.user_name + " " + user.user_lastname} - {user.user_dni} <small>(D.N.I.)</small>
                                        </p>
                                      </SelectItem>
                                    ))
                                ) : (
                                  <p className="my-2 ml-2"> No se encontraron usuarios</p>
                                )}
                              </SelectContent>
                            </Select>
                            
                            <Select onValueChange={(value)=> setRole(value)}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Rol de usuario (Solo Ver por default)" /> 
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="viewer"> Solo Ver </SelectItem>
                                <SelectItem value="editor"> Ver y Editar</SelectItem>
                              </SelectContent>
                            </Select>

                            <div className="flex justify-center gap-x-5 pb-4 pt-3">
                              <Button
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => {
                                  setAddUserAccess(false);
                                  setSelectedUser("");
                                  setRole('viewer')
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
                    {/* BOTON BORRAR GRUPO */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={loadingDelete}>
                      {loadingDelete ? 'Borrando...' : 'Eliminar Grupo'} 
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-center">
                          ¿Estás seguro que quieres eliminar este grupo?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-red-600">
                          Esta acción no se puede deshacer. Esto eliminará
                          permanentemente el grupo y todos los datos asociados.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="flex flex-col items-center justify-center gap-y-2">
                        <Label htmlFor="confirmDelete">
                          Escribe &quot; CONFIRMO BORRAR TODO &quot; para continuar
                        </Label>
                        <Input
                          id="confirmDelete"
                          value={inputBorrar}
                          onChange={(e) => setInputBorrar(e.target.value)}
                          className="max-w-[300px]"
                        />
                      </div>
                      <AlertDialogFooter className="sm:justify-center">
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          disabled={disabledContinue}
                          onClick={() => handleDeleteGrupo(grupo.grupo_id)}
                        >
                          <div className="flex items-center justify-center gap-x-2">
                            Continuar
                          </div>

                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DialogFooter>

              </DialogContent>
            </Dialog>
          ))}
        </section>
      ) : (
        showSkeleton 
        ? <SkeCard />
        : <div className="flex flex-col items-center justify-center gap-y-4">
            <p className="text-xl font-medium text-gray-500">
              No tienes grupos creados
            </p>
          </div>
      )}
    </div>
  );
}

