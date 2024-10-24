/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { Lock, LockOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "@remix-run/react";
import { removeDepto } from "../database/crudDatabase";
import  useFetch  from '../hooks/use-fetch'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog"

import supabase from "../lib/supabase";


export default function DeptoSelected() {

  const [edit, setEdit] = useState(false)
  const [inputBorrar, setInputBorrar ] = useState('')
  const [disabledContinue, setDisabledContinue ] = useState(true)
  const location = useLocation()
  const infoDepto = location.state.infoDepto

  const navigate = useNavigate()

  const { loading, error, data, fn: fnDeleteDepto } = useFetch(removeDepto, {deptoId: infoDepto.id})

  useEffect(() => {
    
    if(inputBorrar === 'BORRAR') {
      return setDisabledContinue(false)
    } else {
      return setDisabledContinue(true)
    }

  }, [inputBorrar])

  const handleDeleteDepto = async (e) => {
    e.preventDefault()
    
    await fnDeleteDepto(infoDepto.id)
    navigate('/dashboard/deptos')
  }


  return (
    <div>
      <div className="flex items-center mt-8 justify-between ">
        <h1 className="text-3xl text-gray-300 font-extrabold font-inter">
          DASHBOARD - Propiedad Seleccionada
        </h1>
        <div className="flex gap-24 mr-6">
          <div className="flex items-center">
            <span
              className={`px-5 py-3 rounded-full text-xl font-semibold ${
                infoDepto.ocupado === true
                  ? "bg-green-100 text-green-800 border-2 border-green-600"
                  : "bg-red-100 text-red-800 border-2 border-red-600"
              }`}
            >
              {infoDepto.ocupado ? "Ocupado" : "Desocupado"}
            </span>
          </div>
          <button
            onClick={() => setEdit(!edit)}
            className="flex items-center border border-gray-200 shadow-md rounded-full h-20 w-20 justify-center hover:shadow-lg transition-all cursor-pointer"
          >
            {!edit ? (
              <Lock className="w-10 h-10" />
            ) : (
              <LockOpen className="w-10 h-10" />
            )}
          </button>
        </div>
      </div>
      <div className="container mx-auto w-full mr-14 px-0 mt-10">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 ml-3 items-start justify-items-stretch min-w-full text-lg ">
          <div className="min-w-56">
            <label
              htmlFor="ubicacion_completa"
              className={`font-bold text-md ${
                !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
              }`}
            >
              {" "}
              Ubicación{" "}
            </label>
            <Input
              className={`mt-2 text-xl  ${
                edit ? "text-gray-600 p-2" : "text-black border-none p-2"
              }`}
              placeholder="Ej: San Juan 382 piso 7"
              name="ubicacion_completa"
              value={
                infoDepto.ubicacion_completa
                  ? infoDepto.ubicacion_completa
                  : "No hay info."
              }
              readOnly={!edit}
            />
          </div>
          <div className="min-w-56">
            <label
              htmlFor="propietario"
              className={`font-bold text-md ${
                !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
              }`}
            >
              {" "}
              Propietario{" "}
            </label>
            <Input
              className={`mt-2 text-xl  ${
                edit ? "text-gray-600 p-2" : "text-black border-none p-2"
              }`}
              placeholder="Ej: Lionel Messi"
              name="propietario"
              value={
                infoDepto.propietario_name
                  ? infoDepto.propietario_name
                  : "No hay info."
              }
              readOnly={!edit}
            />
          </div>
          <div className="min-w-56">
            <label
              htmlFor="usufructuario"
              className={`font-bold text-md ${
                !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
              }`}
            >
              {" "}
              Usufructuario{" "}
            </label>
            <Input
              className={`mt-2 text-xl  ${
                edit ? "text-gray-600 p-2" : "text-black border-none p-2"
              }`}
              placeholder="Ej: Lionel Messi"
              name="usufructuario"
              value={
                infoDepto.usufructuario_name
                  ? infoDepto.usufructuario_name
                  : "No hay info."
              }
              readOnly={!edit}
            />
          </div>
          <div className="min-w-56">
            <label
              htmlFor="locador"
              className={`font-bold text-md ${
                !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
              }`}
            >
              {" "}
              Locador{" "}
            </label>
            <Input
              className={`mt-2 text-xl  ${
                edit ? "text-gray-600 p-2" : "text-black border-none p-2"
              }`}
              placeholder="Ej: Angel Di Maria"
              name="locador"
              value={
                infoDepto.locador_name ? infoDepto.locador_name : "No hay info."
              }
              readOnly={!edit}
            />
          </div>
          <div className="min-w-56">
            <label
              htmlFor="locatario"
              className={`font-bold text-md ${
                !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
              }`}
            >
              {" "}
              Locatario / Inquilino{" "}
            </label>
            <Input
              className={`mt-2 text-xl  ${
                edit ? "text-gray-600 p-2" : "text-black border-none p-2"
              }`}
              placeholder="Ej: Mateo Messi"
              name="locatario"
              value={
                infoDepto.inquilino_name
                  ? infoDepto.inquilino_name
                  : "No hay info."
              }
              readOnly={!edit}
            />
          </div>
          <div className="min-w-56">
            <label
              htmlFor="facturador"
              className={`font-bold text-md ${
                !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
              }`}
            >
              {" "}
              Facturador{" "}
            </label>
            <Input
              className={`mt-2 text-xl  ${
                edit ? "text-gray-600 p-2" : "text-black border-none p-2"
              }`}
              placeholder="Ej: Angel Di Maria"
              name="facturador"
              value={
                infoDepto.facturador_name
                  ? infoDepto.facturador_name
                  : "No hay info."
              }
              readOnly={!edit}
            />
          </div>
          <div className="min-w-56">
            <label
              htmlFor="descripcion"
              className={`font-bold text-md ${
                !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
              }`}
            >
              {" "}
              Descripción{" "}
            </label>
            <Textarea
              className={`mt-2 text-xl  ${
                edit ? "text-gray-600 p-2" : "text-black border-none p-2"
              }`}
              placeholder="Ej: 5 dormitorios, 3 baños, 350mt², edificio con pileta y parrilla en la terraza."
              name="descripcion"
              value={
                infoDepto.descripcion ? infoDepto.descripcion : "No hay info."
              }
              readOnly={!edit}
              rows={4}
            />
          </div>
          <div className="min-w-56">
            <label
              htmlFor="vencimientoUsufructo"
              className={`font-bold text-md ${
                !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
              }`}
            >
              {" "}
              Vencimiento del Usufructo{" "}
            </label>
            <Input
              className={`mt-2 text-xl  ${
                edit ? "text-gray-600 p-2" : "text-black border-none p-2"
              }`}
              type="date"
              name="vencimientoUsufructo"
              value={
                infoDepto.vencimiento_usufructo
                  ? infoDepto.vencimiento_usufructo
                  : "No hay info."
              }
              readOnly={!edit}
            />
          </div>
          <div className="min-w-56">
            <label
              htmlFor="Contrato"
              className={`font-bold text-md ${
                !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
              }`}
            >
              {" "}
              Contrato{" "}
            </label>
            <Input
              className={`mt-2 text-xl  ${
                edit ? "text-gray-600 p-2" : "text-black border-none p-2"
              }`}
              placeholder="Ej: "
              type="file"
              name="Contrato"
              value={infoDepto.contrato_url ? infoDepto.contrato_url : ""}
              readOnly={!edit}
            />
          </div>
          <div className="min-w-56">
            <label
              htmlFor="metodoCobro"
              className={`font-bold text-md ${
                !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
              }`}
            >
              {" "}
              Metodo de cobro{" "}
            </label>
            <Input
              className={`mt-2 text-xl  ${
                edit ? "text-gray-600 p-2" : "text-black border-none p-2"
              }`}
              placeholder="Ej: Efectivo"
              name="metodoCobro"
              value={
                infoDepto.metodo_cobro ? infoDepto.metodo_cobro : "No hay info."
              }
              readOnly={!edit}
            />
          </div>
          <div className="min-w-56">
            <label
              htmlFor="precioInicio"
              className={`font-bold text-md ${
                !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
              }`}
            >
              {" "}
              Precio al inicio{" "}
            </label>
            <div className="relative">
              <span className="absolute top-[6px] left-[8px] font-bold">
                {" "}
                ${" "}
              </span>
              <Input
                className={`mt-2 text-xl ${
                  edit ? "text-gray-600 pl-6" : "text-black border-none pl-6"
                }`}
                placeholder="160.000,00"
                type="number"
                name="precioInicio"
                value={
                  infoDepto.monto_cobro_inicio
                    ? infoDepto.monto_cobro_inicio
                    : "No hay info."
                }
                readOnly={!edit}
              />
            </div>
          </div>
          <div className="min-w-56">
            <label
              htmlFor="precioActual"
              className={`font-bold text-md ${
                !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
              }`}
            >
              Precio Actual
            </label>
            <div className="relative">
              <span className="absolute top-[6px] left-[8px] font-bold">
                {" "}
                ${" "}
              </span>
              <Input
                className={`mt-2 text-xl ${
                  edit ? "text-gray-600 pl-6" : "text-black border-none pl-6"
                }`}
                placeholder="360.000,00"
                type="number"
                name="precioActual"
                value={
                  infoDepto.monto_cobro ? infoDepto.monto_cobro : "No hay info."
                }
                readOnly={!edit}
              />
            </div>
          </div>
          <div className="min-w-56">
            <label
              htmlFor="ultimaActualizacionPrecio"
              className={`font-bold text-md ${
                !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
              }`}
            >
              Ultima actualización del precio
            </label>
            <Input
              className={`mt-2 text-xl  ${
                edit ? "text-gray-600 p-2" : "text-black border-none p-2"
              }`}
              placeholder=""
              type="date"
              name="ultimaActualizacionPrecio"
              value={
                infoDepto.fecha_actuallizacion_cobro
                  ? infoDepto.fecha_actuallizacion_cobro
                  : "No hay info."
              }
              readOnly={!edit}
            />
          </div>
          <div className="min-w-56 flex items-center gap-5 mt-[44px]">
            <label
              htmlFor="reli"
              className={`font-bold text-md ${
                !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
              }`}
            >
              Inscripto en RELI
            </label>
            <Checkbox
              className="h-6 w-6"
              name="reli"
              readOnly={!edit}
              checked={
                infoDepto.inscripto_reli ? infoDepto.inscripto_reli : false
              }
            />
          </div>
          <div className="min-w-56">
            <label
              htmlFor="documentosVarios"
              className={`font-bold text-md ${
                !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
              }`}
            >
              Documentos varios
            </label>
            <Input
              className={`mt-2 text-xl  ${
                edit ? "text-gray-600 p-2" : "text-black border-none p-2"
              }`}
              placeholder=""
              type="text"
              name="documentosVarios"
              value={infoDepto.documentos ? infoDepto.documentos : ""}
              readOnly={!edit}
            />
          </div>
          <div className="min-w-56">
            <label
              htmlFor="obsDatos"
              className={`font-bold text-md ${
                !edit ? "text-[#d4d4d4] p-2" : "text-black border-none p-2"
              }`}
            >
              {" "}
              Observaciónes / datos extras
            </label>
            <Textarea
              className={`mt-2 text-xl  ${
                edit ? "text-gray-600 p-2" : "text-black border-none p-2"
              }`}
              placeholder="Ej: Admite mascotas, fue reaconcidionado recientemente, cocina nueva a estrenar."
              name="obsDatos"
              value={infoDepto.obs_datos ? infoDepto.obs_datos : "No hay info."}
              readOnly={!edit}
            />
          </div>

          <div>Galeria de fotos</div>
        </section>

        <div className="flex justify-center gap-10 my-8">
          {!edit ? (
            <>
              <Button className="bg-[#003156] text-white h-10 px-6 font-bold text-md hover:bg-blue-600">
                {" "}
                Editar{" "}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger className="bg-red-600 hover:bg-red-700 text-white p-2 px-4 rounded-md">
                  Borrar Propiedad
                </AlertDialogTrigger>
                <AlertDialogContent className="flex flex-col items-center">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-center text-2xl">
                      Estas a punto de borrar una propiedad
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-lg">
                      ¡Esta accion no se puede revertir!
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex justify-center gap-6 mt-3 md:justify-center">
                    <AlertDialogCancel onClick={() => setInputBorrar('')}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={(e) => handleDeleteDepto(e)}  disabled={disabledContinue}>Continuar</AlertDialogAction>
                  </AlertDialogFooter>
                      <div>
                        <Label> Escribe <strong className="px-2"> BORRAR </strong> para confirmar esta accion</Label>
                        <Input 
                          className="mt-4" 
                          type="text" 
                          value={inputBorrar} 
                          onChange={(e) => setInputBorrar(e.target.value.trim().toUpperCase())}
                        />
                      </div>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <>
              <Button className="bg-green-600 h-10 px-6 font-bold text-md hover:bg-green-800">
                {" "}
                GUARDAR{" "}
              </Button>
              <Button className="bg-red-600 h-10 px-6 font-bold text-md hover:bg-red-800">
                {" "}
                CANCELAR{" "}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}