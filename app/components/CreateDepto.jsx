/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { useEffect, useState } from "react";
import { createPrueba, createDepto } from '../database/crudDatabase'
import useFetch from '../hooks/use-fetch'
import Error from '../components/Error'
import { Form, json } from "@remix-run/react";
import { useActionData } from "@remix-run/react";
import supabase from "../lib/supabase";


export async function action({request}) {

  const body = await request.formData();
  const ubicacion_completa = body.get('ubicacion_completa')
  const descripcion = body.get('descripcion')
  const ocupado = body.get('ocupado')
  const propietario_name = body.get('propietario_name')
  const locador_name = body.get('locador_name')
  const inquilino_name = body.get('inquilino_name')
  const cobrador_name = body.get('cobrador_name')
  const facturador_name = body.get('facturador_name')
  const usufructuario_name = body.get('usufructuario_name')
  const metodo_cobro = body.get('metodo_cobro')
  const vencimiento_contrato = body.get('vencimiento_contrato')
  const inscripto_reli = body.get('inscripto_reli')
  const vencimiento_usufructo = body.get('vencimiento_usufructo')
  const monto_cobro = body.get('monto_cobro')
  const monto_cobro_inicio = body.get('monto_cobro_inicio')
  const obs_datos = body.get('obs_datos')
  const fecha_actualizacion_cobro = body.get('fecha_actualizacion_cobro')
  //fotos
  //documentos

  const errors = {}
  if(!ubicacion_completa || ubicacion_completa === null || ubicacion_completa === '') {
    errors.ubicacion_completa = 'Ubicacion_completa no valida.'
  }
  if(!descripcion || descripcion === null || descripcion === '') {
    errors.descripcion = 'Descripcion no valida.'
  }
  if(!propietario_name || propietario_name === null || propietario_name === '') {
    errors.propietario_name = 'Propietario no valido.'
  }
  if(!locador_name || locador_name === null || locador_name === '') {
    errors.locador_name = 'Locador no valido.'
  }
  if(!inquilino_name || inquilino_name === null || inquilino_name === '') {
    errors.inquilino_name = 'Inquilino no valido.'
  }
  if(!cobrador_name || cobrador_name === null || cobrador_name === '') {
    errors.cobrador_name = 'Cobrador no valido.'
  }
  if(!facturador_name || facturador_name === null || facturador_name === '') {
    errors.facturador_name = 'Facturador no valido.'
  }
  if(!usufructuario_name || usufructuario_name === null || usufructuario_name === '') {
    errors.usufructuario_name = 'Usufructuario no valido.'
  }
  if(!metodo_cobro || metodo_cobro === null || metodo_cobro === '') {
    errors.metodo_cobro = 'Metodo de cobro no valido.'
  }
  if(!vencimiento_contrato || vencimiento_contrato === null || vencimiento_contrato === '') {
    errors.vencimiento_contrato = 'Fecha de vencimiento del contrato no valida.'
  }
  if(!vencimiento_usufructo || vencimiento_usufructo === null || vencimiento_usufructo === '') {
    errors.vencimiento_usufructo = 'Fecha de vencimiento del usufructo no valida.'
  }
  if(!monto_cobro || monto_cobro === null || monto_cobro === '') {
    errors.monto_cobro = 'Monto a cobrar no valido.'
  }
  if(!monto_cobro_inicio || monto_cobro_inicio === null || monto_cobro_inicio === '') {
    errors.monto_cobro_inicio = 'Monto a cobrar al inicio no valido.'
  }
  if(!fecha_actualizacion_cobro || fecha_actualizacion_cobro === null || fecha_actualizacion_cobro === '') {
    errors.fecha_actualizacion_cobro = 'Fecha de ultima actualizacion de cobro no valida.'
  }

  if(Object.keys(errors).length > 0) {
    return json({errors})
  }


}

export default function CreateDepto() {

  const [userLoged_id, setUserLogedId] = useState(null)
  const [files, setFiles] = useState([]); // For file upload

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data) {
        setUserLogedId(data.user.id);
      }
      if (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    getUser()
  }, []);

  const handleFileChange = (e) => {
    setFiles((f) => [...f, ...e.target.files]); 
  };

  const objPrueba = {
    ubicacion_completa: 'Hola',
    user_id: userLoged_id,
    files: files,
  }

  const { loading, fn: dbCreatePrueba } = useFetch(createPrueba, {objPrueba});

  const actionData = useActionData()

  const [newDepto, setNewDepto] = useState({
    ubicacion_completa: '',
    descripcion: '',
    ocupado: '',
    propietario_name: '',
    locador_name: '',
    inquilino_name: '',
    cobrador_name: '',
    facturador_name: '',
    usufructuario_name: '',
    metodo_cobro: '',
    vencimiento_contrato: '',
    inscripto_reli: '',
    vencimiento_usufructo: '',
    monto_cobro: '',
    monto_cobro_inicio: '',
    fecha_actualizacion_cobro: '',
    user_id: '',
    obs_datos: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userLoged_id !== null) {
      dbCreatePrueba(objPrueba);
    }

    setFiles([])

  };

  
  return (
    <div className="container mx-auto w-full mr-14 px-0 mt-10">
      <button onClick={(e) => handleSubmit(e)} className="bg-red-400 w-full">awd</button>
      <form 
      
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 ml-3 items-start justify-items-stretch min-w-full text-lg "
      >
        <div className="min-w-56">
          <label htmlFor="ubicacion_completa" className="font-bold">
            Ubicación
          </label> 
          <Input
            className="mt-2 text-md p-2"
            placeholder="Ej: San Juan 382 piso 7"
            name="ubicacion_completa"
          />
          {actionData?.errors?.ubicacion_completa && <Error errorMessage={actionData?.errors?.ubicacion_completa} />}
        </div>
        {/* <div className="min-w-56">
          <label htmlFor="propietario_name" className="font-bold">
            Propietario
          </label>
          <Input
            className="mt-2 text-md p-2"
            placeholder="Ej: Lionel Messi"
            name="propietario_name"
          />
        </div>
        <div className="min-w-56">
          <label htmlFor="usufructuario_name" className="font-bold">
            Usufructuario
          </label>
          <Input
            className="mt-2 text-md p-2"
            placeholder="Ej: Lionel Messi"
            name="usufructuario_name"
          />
          
        </div>
        <div className="min-w-56">
          <label htmlFor="locador_name" className="font-bold">
            Locador
          </label>
          <Input
            className="mt-2 text-md p-2"
            placeholder="Ej: Angel Di Maria"
            name="locador_name"
          />
          
        </div>
        <div className="min-w-56">
          <label htmlFor="inquilino_name" className="font-bold">
            Locatario / Inquilino
          </label>
          <Input
            className="mt-2 text-md p-2"
            placeholder="Ej: Mateo Messi"
            name="inquilino_name"
          />
          
        </div>
        <div className="min-w-56">
          <label htmlFor="facturador_name" className="font-bold">
            Facturador
          </label>
          <Input
            className="mt-2 text-md p-2"
            placeholder="Ej: Angel Di Maria"
            name="facturador_name"
          />
          
        </div>
        <div className="min-w-56">
          <label htmlFor="descripcion" className="font-bold">
            Descripción
          </label>
          <Textarea
            className="mt-2 text-md p-2"
            placeholder="Ej: 5 dormitorios, 3 baños, 350mt², edificio con pileta y parrilla en la terraza."
            name="descripcion"
          />
          
        </div>
        <div className="min-w-56">
          <label htmlFor="vencimiento_usufructo" className="font-bold">
            Vencimiento del Usufructo
          </label>
          <Input
            className="mt-2 text-md p-2"
            type="date"
            name="vencimiento_usufructo"
          />
          
        </div>
        <div className="min-w-56">
          <label htmlFor="metodo_cobro" className="font-bold">
            Metodo de cobro
          </label>
          <Input
            className="mt-2 text-md p-2"
            placeholder="Ej: Efectivo"
            name="metodo_cobro"
          />
          
        </div>
        <div className="min-w-56">
          <label htmlFor="monto_cobro_inicio" className="font-bold">
            Precio al inicio
          </label>
          <div className="relative">
            <span className="absolute top-[12px] left-[8px] font-bold"> $ </span>
            <Input
              className="mt-2 text-md p-2 pl-6"
              placeholder="160.000,00"
              type="number"
              name="monto_cobro_inicio"
            />
            
          </div>
        </div>
        <div className="min-w-56">
          <label htmlFor="monto_cobro" className="font-bold">
            Precio Actual
          </label>
          <div className="relative">
            <span className="absolute top-[12px] left-[8px] font-bold"> $ </span>
            <Input
              className="mt-2 text-md p-2 pl-6"
              placeholder="360.000,00"
              type="number"
              name="monto_cobro"
            />
            
          </div>
        </div>
        <div className="min-w-56">
          <label htmlFor="fecha_actualizacion_cobro" className="font-bold">
            Ultima actualización del precio
          </label>
          <Input
            className="mt-2 text-md p-2"
            placeholder=""
            type="date"
            name="fecha_actualizacion_cobro"
          />
          
        </div>
        <div className="min-w-56 flex items-center gap-5 mt-[44px]">
          <label htmlFor="inscripto_reli" className="font-bold">
            Inscripto en RELI
          </label>
          <Checkbox className="h-6 w-6" name="inscripto_reli" />
          
        </div>
        <div className="min-w-56 flex items-center gap-5 mt-[44px]">
          <label htmlFor="ocupado" className="font-bold">
            Propiedad ocupada
          </label>
          <Checkbox className="h-6 w-6" name="ocupado" />
          
        </div> */}
        <div className="min-w-56">
          <label htmlFor="documentosVarios" className="font-bold">
            Documentos
          </label>
          <Input
            className="mt-2 text-md p-2"
            type="file"
            name="file"
            multiple
            onChange={handleFileChange} // Capture file change
          />
        </div>
        {/*<div className="min-w-56">
          <label htmlFor="obs_datos" className="font-bold">
            {" "}
            Observaciónes / datos extras
          </label>
          <Textarea
            className="mt-2 text-md p-2"
            placeholder="Ej: Admite mascotas, fue reaconcidionado recientemente, cocina nueva a estrenar."
            name="obs_datos"
          />
          
        </div> */}

        <div>Galeria de fotos</div>
        <div className="flex justify-center gap-10 my-8">
        <Button type="submit" className="bg-green-600 h-10 px-6 font-bold text-md hover:bg-green-800">
          GUARDAR
        </Button>
        <Button className="bg-red-600 h-10 px-6 font-bold text-md hover:bg-red-800">
          CANCELAR
        </Button>
      </div>
      </form>

      
    </div>
  );
}
