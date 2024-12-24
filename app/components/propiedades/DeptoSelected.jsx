/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { ChevronLeft, Dot, ChevronRight, Download, FileText, DollarSign, Calendar, MapPin, User, Home, CreditCard, NotebookPenIcon, Expand, Lock, Unlock, XSquare, Trash2 } from 'lucide-react'
import { Button } from "../ui/button"
import { useLocation, useNavigate } from "@remix-run/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Switch } from "../ui/switch"
import { Label } from "../ui/label"
import { getAllUser } from "../../database/crudUsers"
import { useUser } from '../../hooks/use-user'
import useFetch from "../../hooks/use-fetch"
import { useFetchBuckets } from '../../hooks/use-fetchBucket'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger} from "../ui/dialog"
import { getDeptoById, editDepto, removeDocument, removeDepto, removeImage,  } from "../../database/crudDeptos"
import { SkeletonDeptoSelected } from '../helpers/skeletonDeptoSelected'
import {AddDocumentDialog} from '../propiedades/AddDocumentDialog'
import {AddImageDialog} from '../propiedades/AddImageDialog'
// import Error from '../helpers/Error'


export default function DeptoSelected() {
  const userLoged_id = useUser();
  const [usersInfo, setUsersInfo] = useState([])
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [editedInfoDepto, setEditedInfoDepto] = useState({})
  const [inputBorrar, setInputBorrar ] = useState('')
  const [disabledContinue, setDisabledContinue ] = useState(true)
  const [loadingDelete, setLoadingDelete] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const { dataDepto, infoGrupo } = location.state || {}; 

  const [isLoading, setIsLoading] = useState(true);

  const [ dataDocs, setDataDocs ] = useState([])
  const [ dataImagen, setDataImagen ] = useState([])

  const { data: userData, fn: fnGetAllUsers } = useFetch(getAllUser, {});
  const { data: deptoData, fn: fetchDepto } = useFetch(getDeptoById, dataDepto?.id);
  
  const { data: propertyImages, isLoading: imagesLoading } = useFetchBuckets('fotos_deptos', 'foto_url' ,{col: 'depto_id', key: `${dataDepto.id}`})
  const { data: propertyDocs, isLoading: docsLoading } = useFetchBuckets('docs_deptos', '*' ,{col: 'depto_id', key: `${dataDepto.id}`})

  useEffect(() => {
    if (propertyDocs) {
      setDataDocs(propertyDocs);
    }
  }, [propertyDocs]);

  useEffect(() => {
    if (propertyImages) {
      setDataImagen(propertyImages);
    }
  }, [propertyImages]);

  useEffect(() => {
    if (userLoged_id) {
      fnGetAllUsers();
    }
  }, [userLoged_id]);

  useEffect(() => {
    if (dataDepto.id) {
      fetchDepto(dataDepto.id);
    }
  }, [dataDepto.id]);

  useEffect(() => {
    if (deptoData) {
      setIsLoading(false);
    } 
  }, [deptoData]);

  useEffect(() => {
    if (userData) {
      const newUsersInfo = userData.map((user) => ({
        user_id: user.id,
        user_name: user.user_name,
        user_lastname: user.user_lastname,
        user_dni: user.user_dni,
      }));
      setUsersInfo(newUsersInfo);
    }
  }, [userData]);

  //GALLERY OF PHOTOS
  const nextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => 
      prevIndex === (dataImagen?.length || 0) - 1 ? 0 : prevIndex + 1
    )
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => 
      prevIndex === 0 ? (dataImagen?.length || 1) - 1 : prevIndex - 1
    )
  }

  const selectPhoto = (index) => {
    setCurrentPhotoIndex(index)
  }

  
  //REMOVE AND ADD NEW DOCUMENTS TO THE PROPERTY
  const handleDeleteDocument = async (docSelected) => {
    const docPath = docSelected.doc_url;

    try {
      await removeDocument(docPath);

      setDataDocs((prevDocs) =>
        prevDocs.filter((doc) => doc.doc_url !== docPath)
      );

    } catch (error) {
      console.error("Error al eliminar el documento:", error.message);
    }
  };

  const handleAddDocument = (newDoc) => {
    setDataDocs(prevDocs => [...prevDocs, newDoc])
  }

  const handleAddImage = (newImage) => {
    setDataImagen(prevImages => [...prevImages, newImage])
  }

  const handleDeleteImage = async (image) => {
    if (!image || !image.foto_url) {
      console.error("Invalid image data");
      return;
    }
  
    const imgPath = image.foto_url;
    try {
      await removeImage(imgPath);
  
      setDataImagen(prevImages => {
        const newImages = prevImages.filter((img) => img && img.foto_url && img.foto_url !== imgPath);
        if (currentPhotoIndex >= newImages.length) {
          setCurrentPhotoIndex(Math.max(0, newImages.length - 1));
        }
        return newImages;
      });
  
    } catch (error) {
      console.error("Error al eliminar la imagen:", error.message);
    }
  };
  

  const toggleEditing = async () => {
    if (isEditing) {
      setEditedInfoDepto({ ...deptoData, ...editedInfoDepto });
    } else {
      setEditedInfoDepto({ ...deptoData });
    }
    setIsEditing(!isEditing);
    // setErrors(false);
  }

  const handleInputChange = (key, value) => {
    setEditedInfoDepto({ ...editedInfoDepto, [key]: value })
  }

  const saveEdit = async (idDepto) => {
    const response = await editDepto(idDepto, editedInfoDepto);
    if (response) {
      setIsLoading(true);
      await fetchDepto(idDepto)
      if (deptoData) {
        setIsLoading(false);
      }
      setEditedInfoDepto({});
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if(inputBorrar === 'CONFIRMO BORRAR PROPIEDAD') {
      return setDisabledContinue(false)
    } else {
      return setDisabledContinue(true)
    }
  }, [inputBorrar])

  const handleDeleteDepto = async (idDepto) => {
    setLoadingDelete(true)
    try {
     await removeDepto(idDepto)
     setTimeout(() => {
       setLoadingDelete(false)
       setInputBorrar('')
       navigate('/dashboard/deptos')
     }, 1000);
    } catch (error) {
       setLoadingDelete(false)
       console.error("Error al crear el grupo:", error.message || error);
     }
   }

  const renderField = (item) => {
   if (isEditing) {
    if (item.label === "Inscripto en RELI" || item.label === "Estado") {
      return (
        <div className="flex items-center space-x-2">
          <Switch
            id={item.label}
            checked={editedInfoDepto[item.key] || false}
            onCheckedChange={(checked) => {
              // Actualiza el estado del Switch
              setEditedInfoDepto((prevState) => ({
                ...prevState,
                [item.key]: checked,
              }));
    
              // Si cambia a "Desocupado", limpia los datos relacionados
              if (!checked && item.label === "Estado") {
                setEditedInfoDepto((prevState) => ({
                  ...prevState,
                  inquilino_name: '',
                  inicio_contrato: '',
                  finalizacion_contrato: '',
                  monto_cobro: 0,
                }));
              }
            }}
          />
          <Label htmlFor={item.label}>
            {item.label === "Estado"
              ? (editedInfoDepto[item.key] ? "Ocupado" : "Desocupado")
              : "Inscripto en RELI"}
          </Label>
        </div>
      );
    } else if (item.label === "Notas / Observaciones") {
        return (
            <Textarea
                value={editedInfoDepto[item.key] || "―"}
                onChange={(e) => handleInputChange(item.key, e.target.value)}
                className="w-full"
            />
        );
    } else if (item.label === "Usufructuario") {
        return (
          <Input
            type={item.type || "text"}
            value={editedInfoDepto[item.key] ? editedInfoDepto[item.key] : ''}
            onChange={ (e) => { 
              handleInputChange(item.key, e.target.value),                  
              setEditedInfoDepto((prev)=> ({...prev, inicio_usufructo: '', finalizacion_usufructo: '',}))
            }}
            className="w-full"
          />
        )
    } else {
        return (
            <Input
                type={item.type || "text"}
                value={editedInfoDepto[item.key] ? editedInfoDepto[item.key] : ''}
                onChange={(e) => handleInputChange(item.key, e.target.value)}
                className="w-full"
            />
        );
    }
   } else {
       if (item.label === "Inscripto en RELI" || item.label === "Estado") {
           return (
               <dd className="spaceGrotesk text-base sm:text-lg font-medium tracking-wide">
                   {item.label === "Estado"
                       ? (deptoData[item.key] ? "Ocupado" : "Desocupado")
                       : deptoData[item.key] ? "Sí" : "No"}
               </dd>
           );
       } else if (item.type === "number") {
           return (
               <dd className="spaceGrotesk text-base sm:text-lg font-medium tracking-wide">
                   $ {deptoData[item.key] ? formatNumber(deptoData[item.key]) : "―"}
               </dd>
           );
       } else {
           return (
               <dd className="spaceGrotesk text-base sm:text-lg font-medium tracking-wide">
                   {deptoData[item.key] ? deptoData[item.key] : "―"}
               </dd>
           );
       }
   }
  };


  if (isLoading) {
    return <SkeletonDeptoSelected />
  }

  function formatNumber(num) {
    return new Intl.NumberFormat('es-AR').format(num);
  }

  return (
    <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 gap-x-8">
        <h1 className="text-md sm:text-3xl text-gray-300 font-medium font-inter">
          DASHBOARD - <span className='text-[#0c426bd3]'> Propiedad Seleccionada </span>
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className='gap-x-3' onClick={toggleEditing}>
            {isEditing ? <Unlock className="h-8 w-8" /> : <Lock className="w-12 h-12" />}
            {isEditing ? 'Cerrar Editor' : 'Editar'}
          </Button>

          {/* BOTON PARA BORRAR DEPTO */}
          <AlertDialog>
            <AlertDialogTrigger disabled={loadingDelete} className="text-sm transition-all duration-200 bg-destructive text-destructive-foreground hover:bg-destructive/70 p-2 rounded-md">
                {loadingDelete ? 'Borrando...' : 'Borrar Propiedad'} 
              </AlertDialogTrigger>
            <AlertDialogContent >
              <AlertDialogHeader>
                <AlertDialogTitle className="text-center">
                  ¿Estás seguro que quieres eliminar esta propiedad?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-center text-red-600">
                  Esta acción no se puede deshacer. Esto eliminará
                  permanentemente la propiedad y todos sus datos asociados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex flex-col items-center justify-center gap-y-2">
                <Label htmlFor="confirmDelete">
                  Escribe &quot; CONFIRMO BORRAR PROPIEDAD &quot; para continuar
                </Label>
                <Input
                  id="confirmDelete"
                  value={inputBorrar}
                  onChange={(e) => setInputBorrar(e.target.value)}
                  className="max-w-[350px]"
                />
              </div>
              <AlertDialogFooter className="sm:justify-center">
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  disabled={disabledContinue}
                  onClick={() => handleDeleteDepto(deptoData.id)}
                >
                    {loadingDelete ? 'Borrando...' : 'Eliminar'} 
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* INFO GENERAL */}
        <Card className="lg:col-span-2">
          <CardHeader className='flex-col sm:flex-row items-start sm:items-center justify-between'>
            <CardTitle className='text-xl sm:text-2xl mb-2 sm:mb-0'>Pertenece al grupo: {infoGrupo.grupo_name} </CardTitle>
            <Badge variant={deptoData?.ocupado ? "ocupado" : "destructive"} className='h-8 sm:h-10 text-sm sm:text-md'>
              {deptoData?.ocupado ? 'OCUPADO' : 'DESOCUPADO'}
            </Badge>          
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: MapPin, label: "Ubicación", key: "ubicacion_completa" },
                { icon: User, label: "Propietario", key: "propietario_name" },
                { icon: Home, label: "Inquilino", key: "inquilino_name" },
                { icon: User, label: "Locador", key: "locador_name" },
                { icon: CreditCard, label: "Facturador", key: "facturador_name" },
                { icon: CreditCard, label: "Cobrador", key: "cobrador_name" },
                { icon: CreditCard, label: "Usufructuario", key: "usufructuario_name" },
                { icon: Calendar, label: "Inicio del Usufructo", key: "inicio_usufructo", type: "date" },
                { icon: Calendar, label: "Finalización del Usufructo", key: "finalizacion_usufructo", type: "date" },
                { icon: Calendar, label: "Inicio del contrato", key: "inicio_contrato", type: "date" },
                { icon: Calendar, label: "Finalización del contrato", key: "finalizacion_contrato", type: "date" },
                { icon: DollarSign, label: "Método de cobro", key: "metodo_cobro" },
                { icon: DollarSign, label: "Precio Inicial", key: "monto_cobro_inicio", type: "number" },
                { icon: DollarSign, label: "Precio Actual", key: "monto_cobro", type: "number" },
                { icon: Calendar, label: "Última actualización del precio", key: "fecha_actualizacion_cobro", type: "date" },
                { icon: FileText, label: "Inscripto en RELI", key: "inscripto_reli" },
                { icon: Home, label: "Estado", key: "ocupado" },
                { icon: FileText, label: "Descripción", key: "descripcion" },
                { icon: NotebookPenIcon, label: "Notas / Observaciones", key: "obs_datos" },
              ].map((item, index) => (
                <div key={index} className='mb-2'>
                  <dt className="text-base sm:text-lg text-muted-foreground text-[#0f4564] mb-1 opacity-70 flex items-center">
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> {item.label}
                  </dt>
                  {renderField(item)}
                </div>
              ))}
            </dl>
            {isEditing && 
              <div className='grid col-span-2 my-4'>
                <div className='flex justify-center space-x-5'>
                  <Button 
                    className='bg-red-700 hover:bg-red-800' 
                    onClick={() => {setEditedInfoDepto({}); setIsEditing(false);}}
                  > 
                    Cancelar 
                  </Button>
                  <Button className='bg-green-600 hover:bg-green-700' onClick={() => saveEdit(deptoData?.id)}> Guardar Cambios </Button>
                </div>
                {/* {errors && <p className='text-red-600 text-center w-full mt-5 text-lg font-semibold'> Debes completar todos los campos </p>} */}
              </div>
            }
          </CardContent>
        </Card>

        {/* DOCUMENTOS Y ACCESO DEL DEPTO */}
        <div className='lg:col-span-1 flex flex-col gap-6'>
          <Card className="flex-grow">
            <CardHeader className='flex justify-between gap-x-2'>
              <CardTitle className="text-xl sm:text-xl flex items-center justify-between">
                Documentos Asociados
                <AddDocumentDialog deptoId={deptoData.id} onSuccess={handleAddDocument} />
              </CardTitle>
              <CardDescription className="sr-only"> Lista de documentos relacionados con la propiedad </CardDescription>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[300px]">
              {docsLoading ? (
                <p className="text-center text-gray-500">Cargando documentos...</p>
              ) : (
                <ul className="space-y-2">
                  {dataDocs && dataDocs.length > 0 ? (
                    dataDocs.map((doc, index) => (
                      <li
                        key={index}
                        className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition"
                      >
                        {/* File Open Button */}
                        <Button
                          className="flex items-center  max-w-full sm:max-w-[175px] whitespace-nowrap overflow-hidden text-ellipsis justify-start text-sm sm:text-base"
                          onClick={() => window.open(`${doc.doc_url}`, "_blank")}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          <p className="whitespace-nowrap overflow-hidden text-ellipsis text-sm">
                            {doc.doc_name}
                          </p>
                        </Button>
                    
                        {/* Action Buttons */}
                        <div className="flex items-center gap-4">
                          {/* Delete Dialog */}
                          <AlertDialog>
                            <AlertDialogTrigger>
                              <XSquare size={20}className="cursor-pointer hover:text-red-500 transition-all" />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-center">
                                  Estás a punto de borrar un documento
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-center">
                                  Esta acción no se puede revertir, lo deberás volver a cargar
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="sm:justify-center justify-evenly flex flex-row items-center">
                                <AlertDialogCancel className="h-10 mt-0">
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="h-10"
                                  onClick={() => handleDeleteDocument(doc)}
                                >
                                  Continuar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                    
                          {/* Download Button */}
                          <Download
                            size={20}
                            className="cursor-pointer hover:text-green-500 transition-all"
                            onClick={() => window.open(`${doc.doc_url}`, "_blank")}
                          />
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 text-sm w-full text-center">
                      No hay documentos cargados.
                    </li>
                  )}
                </ul>
              )}
            </CardContent>
          </Card>


          <Card className="flex-grow">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Usuarios con acceso</CardTitle>
              <CardDescription>Lista de usuarios con acceso a los datos de esta propiedad</CardDescription>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[300px]">
              <ul className="w-full">
                {Array.isArray(infoGrupo?.shared_with) && infoGrupo?.shared_with.length > 0 ? (
                  usersInfo
                    .filter((user) => infoGrupo.shared_with.includes(user?.user_id))
                    .map((user, i) => (
                      <li key={i} className="flex items-center mb-3 text-left w-full">
                        <Dot />
                        <p className="overflow-hidden text-ellipsis w-full mr-4 whitespace-nowrap pl-1 text-sm sm:text-base">
                          {user.user_name + " " + user.user_lastname} - {user.user_dni}{" "}
                          <small>(D.N.I.)</small>
                        </p>
                        {user?.user_id === userLoged_id}
                      </li>
                    ))
                ) : (
                  <li className="text-gray-500 text-sm w-full">Nadie más tiene acceso a este grupo.</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* FOTOS DEL DEPTO */}
        <Card className='col-span-full'>
          <CardHeader className='flex-row items-center justify-between'>
            <CardTitle className="text-xl sm:text-2xl">Galería de Fotos</CardTitle>
            <AddImageDialog deptoId={deptoData.id} onSuccess={handleAddImage} />                
          </CardHeader>
          <CardContent>
            {imagesLoading ? (
              <p>Cargando imágenes...</p>
            ) : (
              <div className="space-y-4">
                <div className="relative mb-6 sm:mb-10">
                  {dataImagen && dataImagen.length > 0 ? (
                    <div className='flex justify-center'>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-10">
                            <Expand className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
                          <DialogTitle className="sr-only">Imagen ampliada</DialogTitle>
                          <DialogDescription className="sr-only">Vista ampliada de la imagen de la propiedad</DialogDescription>
                          <div className="relative flex items-center justify-center w-full h-full">
                            <img
                              src={dataImagen[currentPhotoIndex]?.foto_url}
                              alt={`Foto de la propiedad ${currentPhotoIndex + 1}`}
                              className="max-w-[85%] min-h-[calc(90vh-2rem)] max-h-[calc(95vh-2rem)] object-contain"
                            />
                            {dataImagen.length > 1 && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-1/2 left-2 transform -translate-y-1/2"
                                  onClick={prevPhoto}
                                >
                                  <ChevronLeft className="h-6 w-6" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-1/2 right-2 transform -translate-y-1/2"
                                  onClick={nextPhoto}
                                >
                                  <ChevronRight className="h-6 w-6" />
                                </Button>
                              </>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <img
                        src={dataImagen[currentPhotoIndex].foto_url}
                        alt={`Foto de la propiedad ${currentPhotoIndex + 1}`}
                        className="max-w-[85%] h-48 sm:h-96 object-contain rounded-md"
                      />
                      {dataImagen.length > 1 && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute top-1/2 left-2 transform -translate-y-1/2"
                            onClick={prevPhoto}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute top-1/2 right-2 transform -translate-y-1/2"
                            onClick={nextPhoto}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <div className="absolute bottom-2 right-2 flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="text-xs sm:text-sm"
                          onClick={() => window.open(`${dataImagen[currentPhotoIndex].foto_url}`, "_blank")}
                        >
                          <Download className="h-4 sm:w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="text-xs sm:text-sm">
                              <Trash2 className="h-4 sm:w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Esto eliminará permanentemente la imagen de la propiedad.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteImage(dataImagen[currentPhotoIndex])}>
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      <p className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs sm:text-sm">
                        {currentPhotoIndex + 1} / {dataImagen.length}
                      </p>
                    </div>
                  ) : (
                    <p>No hay imágenes disponibles</p>
                  )}
                </div>

                {dataImagen && dataImagen.length > 1 && (
                  <div className="flex gap-2 sm:gap-4 justify-center overflow-x-auto p-2">
                    {dataImagen.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => selectPhoto(index)}
                        className={`relative flex-shrink-0 rounded-md overflow-hidden ${
                          index === currentPhotoIndex ? 'ring-2 p-1 ring-primary' : ''
                        }`}
                      >
                        <img
                          src={image.foto_url}
                          alt={`Miniatura ${index + 1}`}
                          className="h-16 sm:h-20 w-16 sm:w-20 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

