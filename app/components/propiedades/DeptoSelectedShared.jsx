/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { ChevronLeft, Dot, ChevronRight, Download, FileText, DollarSign, Calendar, MapPin, User, Home, CreditCard, NotebookPenIcon, Expand} from 'lucide-react'
import { Button } from "../ui/button"
import { useLocation } from "@remix-run/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { getAllUser } from "../../database/crudUsers"
import { useUser } from '../../hooks/use-user'
import useFetch from "../../hooks/use-fetch"
import { useFetchBuckets } from '../../hooks/use-fetchBucket'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger} from "../ui/dialog"

export default function DeptoSelected() {
  const userLoged_id = useUser();
  const [usersInfo, setUsersInfo] = useState([])
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  const location = useLocation()
  const {infoDepto, infoGrupo} = location.state


  const { data: userData, fn: fnGetAllUsers } = useFetch(getAllUser, {});

  const { data: propertyImages, isLoading: imagesLoading } = useFetchBuckets('fotos_deptos', 'foto_url' ,{col: 'depto_id', key: `${infoDepto?.id}`})
  const { data: propertyDocs, isLoading: docsLoading } = useFetchBuckets('docs_deptos', '*' ,{col: 'depto_id', key: `${infoDepto?.id}`})

  useEffect(() => {
    if (userLoged_id) {
      fnGetAllUsers();
    }
  }, [userLoged_id]);

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

  const nextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => 
      prevIndex === (propertyImages?.length || 0) - 1 ? 0 : prevIndex + 1
    )
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => 
      prevIndex === 0 ? (propertyImages?.length || 1) - 1 : prevIndex - 1
    )
  }

  const selectPhoto = (index) => {
    setCurrentPhotoIndex(index)
  }


  const renderField = (item) => {
    
    if (item.label === "Inscripto en RELI" || item.label === "Estado") {
      return (
        <dd className='spaceGrotesk text-base sm:text-lg font-medium tracking-wide'>
          {item.label === "Estado" ? (infoDepto[item.key] ? "Ocupado" : "Desocupado") : (infoDepto[item.key] ? "Sí" : "No")}
        </dd>
      )
    } else if (item.type === "number") {
      return (
               <dd className="spaceGrotesk text-base sm:text-lg font-medium tracking-wide">
                  $ {infoDepto[item.key] ? formatNumber(infoDepto[item.key]) : "-"}
               </dd>
           );
    } else {
      return (
        <dd className='spaceGrotesk text-base sm:text-lg font-medium tracking-wide'>
          {infoDepto[item.key] ? infoDepto[item.key] : "-"}
        </dd>
      )
    }
  }


  function formatNumber(num) {
    return new Intl.NumberFormat('es-AR').format(num);
  }

  return (
    <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 gap-x-8">
        <h1 className="text-md sm:text-3xl text-gray-300 font-medium font-inter">
          DASHBOARD - <span className='text-[#0c426bd3]'> Propiedad Compartida </span>{" "}  
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* INFO GENERAL */}
        <Card className="lg:col-span-2">
        <CardHeader className='flex-col sm:flex-row items-start sm:items-center justify-between'>
            <CardTitle className='text-xl sm:text-2xl mb-2 sm:mb-0'>Pertenece al grupo: {infoGrupo.grupo_name} </CardTitle>
            <Badge variant={infoDepto?.ocupado ? "ocupado" : "destructive"} className='h-8 sm:h-10 text-sm sm:text-md'>
              {infoDepto?.ocupado ? 'OCUPADO' : 'DESOCUPADO'}
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
                { icon: CreditCard, label: "Usufructuario", key: "usufructuario_name" },
                { icon: Calendar, label: "Vencimiento del Usufructo", key: "vencimiento_usufructo", type: "date" },
                { icon: Calendar, label: "Vencimiento del contrato", key: "vencimiento_contrato", type: "date" },
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
          </CardContent>
        </Card>

        {/* DOCUMENTOS Y ACCESO DEL DEPTO */}
        <div className='lg:col-span-1 flex flex-col gap-6'>
          <Card className="flex-grow">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Documentos Asociados</CardTitle>
              <CardDescription>Lista de documentos relacionados con la propiedad</CardDescription>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[300px]">
              {docsLoading ? (
                <p>Cargando documentos...</p>
              ) : (
                <ul className="space-y-2">
                  {propertyDocs && propertyDocs.length > 0 ? (
                    propertyDocs.map((doc, index) => (
                      <li key={index} className="flex flex-wrap items-center justify-left gap-y-1 gap-x-5 p-2 rounded-md">
                        <Button className="flex items-center w-fit justify-start text-sm sm:text-base" onClick={() => window.open(`${doc.doc_url}`, "_blank")}>
                          <FileText className="w-4 h-4 mr-2" />
                          {doc.doc_name} 
                        </Button>
                        <span className='text-muted-foreground text-xs'> Click para descargar </span>
                      </li>
                    ))
                  ) : (
                    <li>No hay documentos disponibles</li>
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
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Galería de Fotos</CardTitle>
          </CardHeader>
          <CardContent>
            {imagesLoading ? (
              <p>Cargando imágenes...</p>
            ) : (
              <div className="space-y-4">
                <div className="relative mb-6 sm:mb-10">
                  {propertyImages && propertyImages.length > 0 ? (
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
                              src={propertyImages[currentPhotoIndex].foto_url}
                              alt={`Foto de la propiedad ${currentPhotoIndex + 1}`}
                              className="max-w-[85%] min-h-[calc(90vh-2rem)] max-h-[calc(95vh-2rem)] object-contain"
                            />
                            {propertyImages.length > 1 && (
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
                        src={propertyImages[currentPhotoIndex].foto_url}
                        alt={`Foto de la propiedad ${currentPhotoIndex + 1}`}
                        className="max-w-[85%] h-48 sm:h-96 object-contain rounded-md"
                      />
                      {propertyImages.length > 1 && (
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
                      <div className="absolute bottom-2 right-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="text-xs sm:text-sm"
                          onClick={() => window.open(`${propertyImages[currentPhotoIndex].foto_url}`, "_blank")}
                        >
                          <Download className="h-4 sm:w-4" />
                        </Button>
                      </div>
                      <p className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs sm:text-sm">
                        {currentPhotoIndex + 1} / {propertyImages.length}
                      </p>
                    </div>
                  ) : (
                    <p>No hay imágenes disponibles</p>
                  )}
                </div>
                {propertyImages && propertyImages.length > 1 && (
                  <div className="flex gap-2 sm:gap-4 justify-center overflow-x-auto p-2">
                    {propertyImages.map((image, index) => (
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

