/* eslint-disable no-unused-vars */
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { useEffect, useState } from "react";
import { createPrueba, createDepto } from '../database/crudDatabase'
import useFetch from '../hooks/use-fetch'
import Error from '../components/Error'
import { Form } from "@remix-run/react";
import { useActionData } from "@remix-run/react";

export async function action({request}) {
  const body = await request.formData();
  const ubicacion = body.get('ubicacion')
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
  //contrato
  //documentos varios

  // const errors = {}
}

export default function CreateDepto() {
  const erros = useActionData()


  const [newDepto, setNewDepto] = useState({
    ubicacion: '',
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

  // const objPrueba = {
  //   text: 'Hola',
  //   number: '200000',
  //   date: '2024-10-20'
  // }

  // const { loading, data: deptos, error, fn } = useFetch(createPrueba, {objPrueba});
  
  // useEffect(() => {
  //   fn(objPrueba)
  // }, [])
  // console.log(error)
  return (
    <div className="container mx-auto w-full mr-14 px-0 mt-10">
      <Form 
      method="POST"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 ml-3 items-start justify-items-stretch min-w-full text-lg "
      >
        <div className="min-w-56">
          <label htmlFor="ubicacion" className="font-bold">
            Ubicación
          </label>
          <Input
            className="mt-2 text-md p-2"
            placeholder="Ej: San Juan 382 piso 7"
            name="ubicacion"
          />
          {/* {errors.auth && <Error errorMessage={errors.auth} />} */}
        </div>
        <div className="min-w-56">
          <label htmlFor="propietario_name" className="font-bold">
            Propietario
          </label>
          <Input
            className="mt-2 text-md p-2"
            placeholder="Ej: Lionel Messi"
            name="propietario_name"
          />
          {/* {errors.auth && <Error errorMessage={errors.auth} />} */}
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
          {/* {errors.auth && <Error errorMessage={errors.auth} />} */}
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
          {/* {errors.auth && <Error errorMessage={errors.auth} />} */}
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
          {/* {errors.auth && <Error errorMessage={errors.auth} />} */}
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
          {/* {errors.auth && <Error errorMessage={errors.auth} />} */}
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
          {/* {errors.auth && <Error errorMessage={errors.auth} />} */}
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
          {/* {errors.auth && <Error errorMessage={errors.auth} />} */}
        </div>
        <div className="min-w-56">
          <label htmlFor="Contrato" className="font-bold">
            Contrato
          </label>
          <Input
            className="mt-2 text-md p-2"
            placeholder="Ej: "
            type="file"
            name="Contrato"
          />
          {/* {errors.auth && <Error errorMessage={errors.auth} />} */}
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
          {/* {errors.auth && <Error errorMessage={errors.auth} />} */}
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
            {/* {errors.auth && <Error errorMessage={errors.auth} />} */}
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
            {/* {errors.auth && <Error errorMessage={errors.auth} />} */}
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
          {/* {errors.auth && <Error errorMessage={errors.auth} />} */}
        </div>
        <div className="min-w-56 flex items-center gap-5 mt-[44px]">
          <label htmlFor="inscripto_reli" className="font-bold">
            Inscripto en RELI
          </label>
          <Checkbox className="h-6 w-6" name="inscripto_reli" />
          {/* {errors.auth && <Error errorMessage={errors.auth} />} */}
        </div>
        <div className="min-w-56">
          <label htmlFor="documentosVarios" className="font-bold">
            Documentos varios
          </label>
          <Input
            className="mt-2 text-md p-2"
            placeholder=""
            type="text"
            name="documentosVarios"
          />
          {/* {errors.auth && <Error errorMessage={errors.auth} />} */}
        </div>
        <div className="min-w-56">
          <label htmlFor="obs_datos" className="font-bold">
            {" "}
            Observaciónes / datos extras
          </label>
          <Textarea
            className="mt-2 text-md p-2"
            placeholder="Ej: Admite mascotas, fue reaconcidionado recientemente, cocina nueva a estrenar."
            name="obs_datos"
          />
          {/* {errors.auth && <Error errorMessage={errors.auth} />} */}
        </div>

        <div>Galeria de fotos</div>
      </Form>

      <div className="flex justify-center gap-10 my-8">
        <Button className="bg-green-600 h-10 px-6 font-bold text-md hover:bg-green-800">
          GUARDAR
        </Button>
        <Button className="bg-red-600 h-10 px-6 font-bold text-md hover:bg-red-800">
          CANCELAR
        </Button>
      </div>
    </div>
  );
}
