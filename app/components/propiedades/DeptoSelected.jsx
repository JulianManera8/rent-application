// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { Label } from "../ui/label";
// import { Textarea } from "../ui/textarea";
// import { Checkbox } from "../ui/checkbox";
// import { Lock, LockOpen } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "@remix-run/react";
// import { removeDepto } from "../../database/crudDeptos";
// import  useFetch  from '../../hooks/use-fetch'
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"



// export default function DeptoSelected() {

//   const [edit, setEdit] = useState(false)
//   const [inputBorrar, setInputBorrar ] = useState('')
//   const [disabledContinue, setDisabledContinue ] = useState(true)
//   const location = useLocation()
//   const infoDepto = location.state.infoDepto

//   const navigate = useNavigate()

//   const { fn: fnDeleteDepto } = useFetch(removeDepto, {deptoId: infoDepto.id})

//   useEffect(() => {
    
//     if(inputBorrar === 'BORRAR') {
//       return setDisabledContinue(false)
//     } else {
//       return setDisabledContinue(true)
//     }

//   }, [inputBorrar])

//   const handleDeleteDepto = async (e) => {
//     e.preventDefault()
    
//     await fnDeleteDepto(infoDepto.id)
//     navigate('/dashboard/deptos')
//   }


//   return (
//     <div>
//       <div className="flex items-center mt-8 justify-between ">
//         <h1 className="text-3xl text-gray-300 font-medium font-inter">
//           DASHBOARD - Propiedad Seleccionada
//         </h1>
//         <div className="flex gap-24 mr-6">
//           <div className="flex items-center">
//             <span
//               className={`px-5 py-3 rounded-full text-xl font-semibold ${
//                 infoDepto.ocupado === true
//                   ? "bg-green-100 text-green-800 border-2 border-green-600"
//                   : "bg-red-100 text-red-800 border-2 border-red-600"
//               }`}
//             >
//               {infoDepto.ocupado ? "Ocupado" : "Desocupado"}
//             </span>
//           </div>
//           <button
//             onClick={() => setEdit(!edit)}
//             className="flex items-center border border-gray-200 shadow-md rounded-full h-20 w-20 justify-center hover:shadow-lg transition-all cursor-pointer"
//           >
//             {!edit ? (
//               <Lock className="w-10 h-10" />
//             ) : (
//               <LockOpen className="w-10 h-10" />
//             )}
//           </button>
//         </div>
//       </div>
//       <div className="container mx-auto w-full mr-14 px-0 mt-10">
//         <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 ml-3 items-start justify-items-stretch min-w-full text-lg ">
//           <div className="min-w-56">
//             <label
//               htmlFor="ubicacion_completa"
//               className={`font-bold text-md ${
//                 !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
//               }`}
//             >
//               {" "}
//               Ubicación{" "}
//             </label>
//             <Input
//               className={`mt-2 text-xl  ${
//                 edit ? "text-gray-600 p-2" : "text-black border-none p-2"
//               }`}
//               placeholder="Ej: San Juan 382 piso 7"
//               name="ubicacion_completa"
//               value={
//                 infoDepto.ubicacion_completa
//                   ? infoDepto.ubicacion_completa
//                   : "No hay info."
//               }
//               readOnly={!edit}
//             />
//           </div>
//           <div className="min-w-56">
//             <label
//               htmlFor="propietario"
//               className={`font-bold text-md ${
//                 !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
//               }`}
//             >
//               {" "}
//               Propietario{" "}
//             </label>
//             <Input
//               className={`mt-2 text-xl  ${
//                 edit ? "text-gray-600 p-2" : "text-black border-none p-2"
//               }`}
//               placeholder="Ej: Lionel Messi"
//               name="propietario"
//               value={
//                 infoDepto.propietario_name
//                   ? infoDepto.propietario_name
//                   : "No hay info."
//               }
//               readOnly={!edit}
//             />
//           </div>
//           <div className="min-w-56">
//             <label
//               htmlFor="usufructuario"
//               className={`font-bold text-md ${
//                 !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
//               }`}
//             >
//               {" "}
//               Usufructuario{" "}
//             </label>
//             <Input
//               className={`mt-2 text-xl  ${
//                 edit ? "text-gray-600 p-2" : "text-black border-none p-2"
//               }`}
//               placeholder="Ej: Lionel Messi"
//               name="usufructuario"
//               value={
//                 infoDepto.usufructuario_name
//                   ? infoDepto.usufructuario_name
//                   : "No hay info."
//               }
//               readOnly={!edit}
//             />
//           </div>
//           <div className="min-w-56">
//             <label
//               htmlFor="locador"
//               className={`font-bold text-md ${
//                 !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
//               }`}
//             >
//               {" "}
//               Locador{" "}
//             </label>
//             <Input
//               className={`mt-2 text-xl  ${
//                 edit ? "text-gray-600 p-2" : "text-black border-none p-2"
//               }`}
//               placeholder="Ej: Angel Di Maria"
//               name="locador"
//               value={
//                 infoDepto.locador_name ? infoDepto.locador_name : "No hay info."
//               }
//               readOnly={!edit}
//             />
//           </div>
//           <div className="min-w-56">
//             <label
//               htmlFor="locatario"
//               className={`font-bold text-md ${
//                 !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
//               }`}
//             >
//               {" "}
//               Locatario / Inquilino{" "}
//             </label>
//             <Input
//               className={`mt-2 text-xl  ${
//                 edit ? "text-gray-600 p-2" : "text-black border-none p-2"
//               }`}
//               placeholder="Ej: Mateo Messi"
//               name="locatario"
//               value={
//                 infoDepto.inquilino_name
//                   ? infoDepto.inquilino_name
//                   : "No hay info."
//               }
//               readOnly={!edit}
//             />
//           </div>
//           <div className="min-w-56">
//             <label
//               htmlFor="facturador"
//               className={`font-bold text-md ${
//                 !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
//               }`}
//             >
//               {" "}
//               Facturador{" "}
//             </label>
//             <Input
//               className={`mt-2 text-xl  ${
//                 edit ? "text-gray-600 p-2" : "text-black border-none p-2"
//               }`}
//               placeholder="Ej: Angel Di Maria"
//               name="facturador"
//               value={
//                 infoDepto.facturador_name
//                   ? infoDepto.facturador_name
//                   : "No hay info."
//               }
//               readOnly={!edit}
//             />
//           </div>
//           <div className="min-w-56">
//             <label
//               htmlFor="descripcion"
//               className={`font-bold text-md ${
//                 !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
//               }`}
//             >
//               {" "}
//               Descripción{" "}
//             </label>
//             <Textarea
//               className={`mt-2 text-xl  ${
//                 edit ? "text-gray-600 p-2" : "text-black border-none p-2"
//               }`}
//               placeholder="Ej: 5 dormitorios, 3 baños, 350mt², edificio con pileta y parrilla en la terraza."
//               name="descripcion"
//               value={
//                 infoDepto.descripcion ? infoDepto.descripcion : "No hay info."
//               }
//               readOnly={!edit}
//               rows={4}
//             />
//           </div>
//           <div className="min-w-56">
//             <label
//               htmlFor="vencimientoUsufructo"
//               className={`font-bold text-md ${
//                 !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
//               }`}
//             >
//               {" "}
//               Vencimiento del Usufructo{" "}
//             </label>
//             <Input
//               className={`mt-2 text-xl  ${
//                 edit ? "text-gray-600 p-2" : "text-black border-none p-2"
//               }`}
//               type="date"
//               name="vencimientoUsufructo"
//               value={
//                 infoDepto.vencimiento_usufructo
//                   ? infoDepto.vencimiento_usufructo
//                   : "No hay info."
//               }
//               readOnly={!edit}
//             />
//           </div>
//           <div className="min-w-56">
//             <label
//               htmlFor="Contrato"
//               className={`font-bold text-md ${
//                 !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
//               }`}
//             >
//               {" "}
//               Contrato{" "}
//             </label>
//             <Input
//               className={`mt-2 text-xl  ${
//                 edit ? "text-gray-600 p-2" : "text-black border-none p-2"
//               }`}
//               placeholder="Ej: "
//               type="file"
//               name="Contrato"
//               value={infoDepto.contrato_url ? infoDepto.contrato_url : ""}
//               readOnly={!edit}
//             />
//           </div>
//           <div className="min-w-56">
//             <label
//               htmlFor="metodoCobro"
//               className={`font-bold text-md ${
//                 !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
//               }`}
//             >
//               {" "}
//               Metodo de cobro{" "}
//             </label>
//             <Input
//               className={`mt-2 text-xl  ${
//                 edit ? "text-gray-600 p-2" : "text-black border-none p-2"
//               }`}
//               placeholder="Ej: Efectivo"
//               name="metodoCobro"
//               value={
//                 infoDepto.metodo_cobro ? infoDepto.metodo_cobro : "No hay info."
//               }
//               readOnly={!edit}
//             />
//           </div>
//           <div className="min-w-56">
//             <label
//               htmlFor="precioInicio"
//               className={`font-bold text-md ${
//                 !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
//               }`}
//             >
//               {" "}
//               Precio al inicio{" "}
//             </label>
//             <div className="relative">
//               <span className="absolute top-[6px] left-[8px] font-bold">
//                 {" "}
//                 ${" "}
//               </span>
//               <Input
//                 className={`mt-2 text-xl ${
//                   edit ? "text-gray-600 pl-6" : "text-black border-none pl-6"
//                 }`}
//                 placeholder="160.000,00"
//                 type="number"
//                 name="precioInicio"
//                 value={
//                   infoDepto.monto_cobro_inicio
//                     ? infoDepto.monto_cobro_inicio
//                     : "No hay info."
//                 }
//                 readOnly={!edit}
//               />
//             </div>
//           </div>
//           <div className="min-w-56">
//             <label
//               htmlFor="precioActual"
//               className={`font-bold text-md ${
//                 !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
//               }`}
//             >
//               Precio Actual
//             </label>
//             <div className="relative">
//               <span className="absolute top-[6px] left-[8px] font-bold">
//                 {" "}
//                 ${" "}
//               </span>
//               <Input
//                 className={`mt-2 text-xl ${
//                   edit ? "text-gray-600 pl-6" : "text-black border-none pl-6"
//                 }`}
//                 placeholder="360.000,00"
//                 type="number"
//                 name="precioActual"
//                 value={
//                   infoDepto.monto_cobro ? infoDepto.monto_cobro : "No hay info."
//                 }
//                 readOnly={!edit}
//               />
//             </div>
//           </div>
//           <div className="min-w-56">
//             <label
//               htmlFor="ultimaActualizacionPrecio"
//               className={`font-bold text-md ${
//                 !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
//               }`}
//             >
//               Ultima actualización del precio
//             </label>
//             <Input
//               className={`mt-2 text-xl  ${
//                 edit ? "text-gray-600 p-2" : "text-black border-none p-2"
//               }`}
//               placeholder=""
//               type="date"
//               name="ultimaActualizacionPrecio"
//               value={
//                 infoDepto.fecha_actuallizacion_cobro
//                   ? infoDepto.fecha_actuallizacion_cobro
//                   : "No hay info."
//               }
//               readOnly={!edit}
//             />
//           </div>
//           <div className="min-w-56 flex items-center gap-5 mt-[44px]">
//             <label
//               htmlFor="reli"
//               className={`font-bold text-md ${
//                 !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
//               }`}
//             >
//               Inscripto en RELI
//             </label>
//             <Checkbox
//               className="h-6 w-6"
//               name="reli"
//               readOnly={!edit}
//               checked={
//                 infoDepto.inscripto_reli ? infoDepto.inscripto_reli : false
//               }
//             />
//           </div>
//           <div className="min-w-56">
//             <label
//               htmlFor="documentosVarios"
//               className={`font-bold text-md ${
//                 !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
//               }`}
//             >
//               Documentos varios
//             </label>
//             <Input
//               className={`mt-2 text-xl  ${
//                 edit ? "text-gray-600 p-2" : "text-black border-none p-2"
//               }`}
//               placeholder=""
//               type="text"
//               name="documentosVarios"
//               value={infoDepto.documentos ? infoDepto.documentos : ""}
//               readOnly={!edit}
//             />
//           </div>
//           <div className="min-w-56">
//             <label
//               htmlFor="obsDatos"
//               className={`font-bold text-md ${
//                 !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
//               }`}
//             >
//               {" "}
//               Observaciónes / datos extras
//             </label>
//             <Textarea
//               className={`mt-2 text-xl  ${
//                 edit ? "text-gray-600 p-2" : "text-black border-none p-2"
//               }`}
//               placeholder="Ej: Admite mascotas, fue reaconcidionado recientemente, cocina nueva a estrenar."
//               name="obsDatos"
//               value={infoDepto.obs_datos ? infoDepto.obs_datos : "No hay info."}
//               readOnly={!edit}
//             />
//           </div>

//           <div>Galeria de fotos</div>
//         </section>

//         <div className="flex justify-center gap-10 my-8">
//           {!edit ? (
//             <>
//               <Button className="bg-[#003156] text-white h-10 px-6 font-bold text-md hover:bg-blue-600">
//                 {" "}
//                 Editar{" "}
//               </Button>
//               <AlertDialog>
//                 <AlertDialogTrigger className="bg-red-600 hover:bg-red-700 text-white p-2 px-4 rounded-md">
//                   Borrar Propiedad
//                 </AlertDialogTrigger>
//                 <AlertDialogContent className="flex flex-col items-center">
//                   <AlertDialogHeader>
//                     <AlertDialogTitle className="text-center text-2xl">
//                       Estas a punto de borrar una propiedad
//                     </AlertDialogTitle>
//                     <AlertDialogDescription className="text-center text-lg">
//                       ¡Esta accion no se puede revertir!
//                     </AlertDialogDescription>
//                   </AlertDialogHeader>
//                   <AlertDialogFooter className="flex justify-center gap-6 mt-3 md:justify-center">
//                     <AlertDialogCancel onClick={() => setInputBorrar('')}>Cancelar</AlertDialogCancel>
//                     <AlertDialogAction onClick={(e) => handleDeleteDepto(e)}  disabled={disabledContinue}>Continuar</AlertDialogAction>
//                   </AlertDialogFooter>
//                       <div>
//                         <Label> Escribe <strong className="px-2"> BORRAR </strong> para confirmar esta accion</Label>
//                         <Input 
//                           className="mt-4" 
//                           type="text" 
//                           value={inputBorrar} 
//                           onChange={(e) => setInputBorrar(e.target.value.trim().toUpperCase())}
//                         />
//                       </div>
//                 </AlertDialogContent>
//               </AlertDialog>
//             </>
//           ) : (
//             <>
//               <Button className="bg-green-600 h-10 px-6 font-bold text-md hover:bg-green-800">
//                 {" "}
//                 GUARDAR{" "}
//               </Button>
//               <Button className="bg-red-600 h-10 px-6 font-bold text-md hover:bg-red-800">
//                 {" "}
//                 CANCELAR{" "}
//               </Button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Download, FileText, DollarSign, Calendar, MapPin, User, Home, CreditCard, NotebookPenIcon } from 'lucide-react'
import { Button } from "../ui/button";
import { useLocation } from "@remix-run/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Separator } from '../ui/separator';

// Mock data - replace with actual data fetching in a real application
const propertyData = {
  status: "Desocupado",
  location: "Urquiza 2215 - 5A",
  owner: "Marcelo Manera",
  tenant: "Marcelo Manera",
  lessor: "Marcelo Manera",
  biller: "Marcelo Manera",
  description: "awd",
  usufructExpiry: "17/11/2024",
  paymentMethod: "Transferencia",
  initialPrice: "$ 22",
  currentPrice: "$ 260000",
  lastPriceUpdate: "dd/mm/aaaa",
  registeredInRELI: true,
  photos: [
    "/chart.png",
    "/chart2.png",
    "/logo.png"
  ],
  documents: [
    { name: "Contrato de alquiler", type: "pdf" },
    { name: "Inventario", type: "docx" },
    { name: "Recibo de pago", type: "pdf" }
  ]
}

export default function DeptoSelected() {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  const location = useLocation()
  const infoDepto = location.state.infoDepto

  const nextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => 
      prevIndex === propertyData.photos.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => 
      prevIndex === 0 ? propertyData.photos.length - 1 : prevIndex - 1
    )
  }

  return (
    <div className="container mx-auto py-8">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-gray-300 font-medium font-inter">
          DASHBOARD - <span className='text-[#0c426bd3]'> Propiedad Seleccionada </span>
        </h1>

        <Badge variant={infoDepto?.ocupado ? "default" : "destructive"} className='h-10 text-md'>
          {infoDepto?.ocupado ? 'OCUPADO' : 'DESOCUPADO'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* INFO GENERAL */}
        <Card className="md:col-span-2">
          <CardHeader className='flex-row items-center justify-between'>
            <CardTitle className='text-3xl'>Información General</CardTitle>
            <CardDescription className='text-red-600'> Grupo: PONER LO DEL GRUPO </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-lg text-muted-foreground  text-[#0f4564] mb-1 opacity-70 flex items-center"><MapPin className="w-5 h-5 mr-2" /> Ubicación</dt>
                <dd className='spaceGrotesk text-lg font-medium tracking-wide'>{infoDepto?.ubicacion_completa}</dd>
              </div>
              <div>
                <dt className="text-lg text-muted-foreground  text-[#0f4564] mb-1 opacity-70 flex items-center"><User className="w-5 h-5 mr-2" /> Propietario</dt>
                <dd className='spaceGrotesk text-lg font-medium tracking-wide'>{infoDepto?.propietario_name}</dd>
              </div>
              <div>
                <dt className="text-lg text-muted-foreground  text-[#0f4564] mb-1 opacity-70 flex items-center"><Home className="w-5 h-5 mr-2" /> Inquilino</dt>
                <dd className='spaceGrotesk text-lg font-medium tracking-wide'>{infoDepto?.inquilino_name}</dd>
              </div>
              <div>
                <dt className="text-lg text-muted-foreground  text-[#0f4564] mb-1 opacity-70 flex items-center"><User className="w-5 h-5 mr-2" /> Locador</dt>
                <dd className='spaceGrotesk text-lg font-medium tracking-wide'>{infoDepto?.locador_name}</dd>
              </div>
              <div>
                <dt className="text-lg text-muted-foreground  text-[#0f4564] mb-1 opacity-70 flex items-center"><CreditCard className="w-5 h-5 mr-2" /> Facturador</dt>
                <dd className='spaceGrotesk text-lg font-medium tracking-wide'>{infoDepto?.facturador_name}</dd>
              </div>
              <div>
                <dt className="text-lg text-muted-foreground  text-[#0f4564] mb-1 opacity-70 flex items-center"><FileText className="w-5 h-5 mr-2" /> Descripción</dt>
                <dd className='spaceGrotesk text-lg font-medium tracking-wide'>{infoDepto?.descripcion}</dd>
              </div>
              <div>
                <dt className="text-lg text-muted-foreground  text-[#0f4564] mb-1 opacity-70 flex items-center"><Calendar className="w-5 h-5 mr-2" /> Vencimiento del Usufructo</dt>
                <dd className='spaceGrotesk text-lg font-medium tracking-wide'>{infoDepto?.vencimiento_usufructo}</dd>
              </div>
              <div>
                <dt className="text-lg text-muted-foreground  text-[#0f4564] mb-1 opacity-70 flex items-center"><DollarSign className="w-5 h-5 mr-2" /> Método de cobro</dt>
                <dd className='spaceGrotesk text-lg font-medium tracking-wide'>{infoDepto?.metodo_cobro}</dd>
              </div>
              <div>
                <dt className="text-lg text-muted-foreground  text-[#0f4564] mb-1 opacity-70 flex items-center"><DollarSign className="w-5 h-5 mr-2" /> Precio Inicial</dt>
                <dd className='spaceGrotesk text-lg font-medium tracking-wide'>{infoDepto?.monto_cobro_inicio}</dd>
              </div>
              <div>
                <dt className="text-lg text-muted-foreground  text-[#0f4564] mb-1 opacity-70 flex items-center"><DollarSign className="w-5 h-5 mr-2" /> Precio Actual</dt>
                <dd className='spaceGrotesk text-lg font-medium tracking-wide'>{infoDepto?.monto_cobro}</dd>
              </div>
              <div>
                <dt className="text-lg text-muted-foreground  text-[#0f4564] mb-1 opacity-70 flex items-center"><Calendar className="w-5 h-5 mr-2" /> Última actualización del precio</dt>
                <dd className='spaceGrotesk text-lg font-medium tracking-wide'>{infoDepto?.fecha_actualizacion_cobro}</dd>
              </div>
              <div>
                <dt className="text-lg text-muted-foreground  text-[#0f4564] mb-1 opacity-70 flex items-center"><FileText className="w-5 h-5 mr-2" /> Inscripto en RELI</dt>
                <dd className='spaceGrotesk text-lg font-medium tracking-wide'>{infoDepto?.inscripto_reli ? "Sí" : "No"}</dd>
              </div>
              <div>
                <dt className="text-lg text-muted-foreground  text-[#0f4564] mb-1 opacity-70 flex items-center"><NotebookPenIcon className="w-5 h-5 mr-2" /> Notas / Observaciones</dt>
                <dd className='spaceGrotesk text-lg font-medium tracking-wide'>{infoDepto?.obs_datos}</dd>
              </div>
              <div>
                <dt className="text-lg text-muted-foreground  text-[#0f4564] mb-1 opacity-70 flex items-center"><NotebookPenIcon className="w-5 h-5 mr-2" /> Usuarios con acceso </dt>
                <dd className='spaceGrotesk text-lg font-medium tracking-wide text-red-600 '> ACA VA EL SELECT DE COMPARTIR ACCESO </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* DOCUMENTOS DEL DEPTO */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Documentos Asociados</CardTitle>
            <CardDescription>Lista de documentos relacionados con la propiedad</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {propertyData.documents.map((doc, index) => (
                <li key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <span className="flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    {doc.name}
                  </span>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* FOTOS DEL DEPTO */}
        <Card className='col-span-3'>
          <CardHeader>
            <CardTitle>Galería de Fotos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <img
                src={propertyData.photos[currentPhotoIndex]}
                alt={`Foto de la propiedad ${currentPhotoIndex + 1}`}
                className="w-full h-96 object-contain rounded-md"
              />
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
            </div>
            <p className="text-center mt-2 text-sm text-muted-foreground">
              {currentPhotoIndex + 1} / {propertyData.photos.length}
            </p>
          </CardContent>
        </Card>

        
      </div>
    </div>
  )
}