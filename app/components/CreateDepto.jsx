/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import Spinner from '../components/loaderIcon'
import HandleGrupo from './HandleGrupo';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { useEffect, useState } from "react";
import { createDepto } from '../database/crudDeptos'
import useFetch from '../hooks/use-fetch'
import Error from '../components/Error'
import { Form } from "@remix-run/react";
import supabase from "../lib/supabase";
import {Collapsible,CollapsibleContent,CollapsibleTrigger } from "../components/ui/collapsible"
import { ChevronsUpDown, Plus, X, FileCheckIcon } from "lucide-react"


export default function CreateDepto() {

  const [userLoged_id, setUserLogedId] = useState(null)
  const [files, setFiles] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [showFotos, setShowFotos] = useState(false);
  const [grupoSelected, setGrupoSelected] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data && data.user) {
        setUserLogedId(data.user.id);
        setNewDepto((prevDepto) => ({
          ...prevDepto,
          user_id: data.user.id,
        }));
      }
      if (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    setNewDepto((prevDepto) => ({
      ...prevDepto,
      files: files
    }));
  }, [files])

  useEffect(() => {
    setNewDepto((prevDepto) => ({
      ...prevDepto,
      fotos: fotos
    }));
  }, [fotos])

  const handleFileChange = (e) => {
    setFiles((f) => [...f, ...e.target.files]);
  };

  const handleFotoChange = (e) => {
    setFotos((f) => [...f, ...e.target.files]);
  };


  const [newDepto, setNewDepto] = useState({
    ubicacion_completa: '', //text
    descripcion: '', // text
    ocupado: false, //booleano
    propietario_name: '', //text
    locador_name: '', //text
    inquilino_name: '', //text
    cobrador_name: '', //text
    facturador_name: '', //text
    usufructuario_name: '', //text
    metodo_cobro: '', //text
    vencimiento_contrato: '', //date year/month/day
    inscripto_reli: false, // boolean
    vencimiento_usufructo: '', //date year/month/day
    monto_cobro: '', //number 
    monto_cobro_inicio: '', //number
    fecha_actualizacion_cobro: '', //date year/month/day
    user_id: '',
    obs_datos: '', //text
    files: files,
    fotos: fotos,
    grupo_id:''
  })

  const { loading, fn: dbCreatePrueba } = useFetch(createDepto, {newDepto});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userLoged_id !== null) {
      try {
        await dbCreatePrueba(newDepto);

        setFiles([])
        setFotos([])

        setNewDepto({
          ubicacion_completa: "", //text
          descripcion: "", // text
          ocupado: false, //booleano
          propietario_name: "", //text
          locador_name: "", //text
          inquilino_name: "", //text
          cobrador_name: "", //text
          facturador_name: "", //text
          usufructuario_name: "", //text
          metodo_cobro: "", //text
          vencimiento_contrato: "", //date year/month/day
          inscripto_reli: false, // boolean
          vencimiento_usufructo: "", //date year/month/day
          monto_cobro: "", //number
          monto_cobro_inicio: "", //number
          fecha_actualizacion_cobro: "", //date year/month/day
          user_id: "",
          obs_datos: "", //text
          files: files,
          fotos: fotos,
          grupo_id: "", 
        });

      } catch (error) {
        console.error('error al cargar el depto o los docs')
      }
    }

  };

  const removeFile = (index) => {
    setFiles((f) => f.filter((_, i) => i !== index));
    if(files.length === 0) {
      return setShowFiles(false)
    }
  };

  const removeFoto = (index) => {
    setFotos((f) => f.filter((_, i) => i !== index));
    if(fotos.length === 0) {
      return setShowFotos(false)
    }
  };
  
  return (
    <div className="container mx-auto w-full mr-14 px-0 mt-10">
      <Form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 ml-3 items-start justify-items-stretch min-w-full text-lg ">
        
        <HandleGrupo />

        <div className="min-w-56">
          <label htmlFor="documentosVarios" className="font-bold flex justify-between items-center pr-1">
            <p>Ubicacion</p> <span className='text-gray-400 text-xs'>Calle numero, piso-departamento</span>
          </label>
          <Input
            className="mt-2 text-md p-2"
            placeholder="Ej: San Juan 382, 7-A"
            name="ubicacion_completa"
            value={newDepto.ubicacion_completa}
            onChange={(e) =>
              setNewDepto({ ...newDepto, ubicacion_completa: e.target.value })
            }
          />
          {/* {actionData?.errors?.ubicacion_completa && (
            <Error errorMessage={actionData?.errors?.ubicacion_completa} />
          )} */}
        </div>
        
        <div className="min-w-56">
          <label htmlFor="propietario_name" className="font-bold">
            Propietario
          </label>
          <Input
            className="mt-2 text-md p-2"
            placeholder="Ej: Lionel Messi"
            name="propietario_name"
            value={newDepto.propietario_name}
            onChange={(e) =>
              setNewDepto({ ...newDepto, propietario_name: e.target.value })
            }
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
            value={newDepto.usufructuario_name}
            onChange={(e) =>
              setNewDepto({ ...newDepto, usufructuario_name: e.target.value })
            }
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
            value={newDepto.locador_name}
            onChange={(e) =>
              setNewDepto({ ...newDepto, locador_name: e.target.value })
            }
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
            value={newDepto.inquilino_name}
            onChange={(e) =>
              setNewDepto({ ...newDepto, inquilino_name: e.target.value })
            }
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
            value={newDepto.facturador_name}
            onChange={(e) =>
              setNewDepto({ ...newDepto, facturador_name: e.target.value })
            }
          />
        </div>

        <div className="min-w-56">
          <label htmlFor="cobrador_name" className="font-bold">
            Cobrador
          </label>
          <Input
            className="mt-2 text-md p-2"
            placeholder="Ej: Angel Di Maria"
            name="cobrador_name"
            value={newDepto.cobrador_name}
            onChange={(e) =>
              setNewDepto({ ...newDepto, cobrador_name: e.target.value })
            }
          />
        </div>

        <div className="min-w-56">
          <label htmlFor="descripcion" className="font-bold">
            Descripción
          </label>
          <Textarea
            className="mt-2 text-md p-2"
            rows={4}
            placeholder="Ej: 5 dormitorios, 3 baños, 350mt², edificio con pileta y parrilla en la terraza."
            name="descripcion"
            value={newDepto.descripcion}
            onChange={(e) =>
              setNewDepto({ ...newDepto, descripcion: e.target.value })
            }
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
            value={newDepto.vencimiento_usufructo}
            onChange={(e) =>
              setNewDepto({
                ...newDepto,
                vencimiento_usufructo: e.target.value,
              })
            }
          />
        </div>

        <div className="min-w-56">
          <label htmlFor="vencimiento_contrato" className="font-bold">
            Vencimiento del contrato
          </label>
          <Input
            className="mt-2 text-md p-2"
            type="date"
            name="vencimiento_contrato"
            value={newDepto.vencimiento_contrato}
            onChange={(e) =>
              setNewDepto({
                ...newDepto,
                vencimiento_contrato: e.target.value,
              })
            }
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
            value={newDepto.metodo_cobro}
            onChange={(e) =>
              setNewDepto({ ...newDepto, metodo_cobro: e.target.value })
            }
          />
        </div>

        <div className="min-w-56">
          <label htmlFor="monto_cobro_inicio" className="font-bold flex justify-between items-center pr-1">
            <p>Precio al inicio</p> <span className='text-gray-400 text-xs'>Solo numeros, como el ej.</span>
          </label>
          <div className="relative">
            <span className="absolute top-[6px] left-[7px] font-bold"> $ </span>
            <Input
              className="mt-2 text-md p-2 pl-6"
              placeholder="Ej: 160000"
              type="number"
              name="monto_cobro_inicio"
              value={newDepto.monto_cobro_inicio}
              onChange={(e) =>
                setNewDepto({ ...newDepto, monto_cobro_inicio: e.target.value })
              }
            />
          </div>
        </div>

        <div className="min-w-56">
          <label htmlFor="monto_cobro" className="font-bold flex justify-between items-center pr-1">
            <p>Precio actual</p> <span className='text-gray-400 text-xs'>Solo numeros, como el ej.</span>
          </label>
          <div className="relative">
            <span className="absolute top-[6px] left-[7px] font-bold"> $ </span>
            <Input
              className="mt-2 text-md p-2 pl-6"
              placeholder="Ej: 360000"
              type="number"
              name="monto_cobro"
              value={newDepto.monto_cobro}
              onChange={(e) =>
                setNewDepto({ ...newDepto, monto_cobro: e.target.value })
              }
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
            value={newDepto.fecha_actualizacion_cobro}
            onChange={(e) =>
              setNewDepto({
                ...newDepto,
                fecha_actualizacion_cobro: e.target.value,
              })
            }
          />
        </div>

        <div className="min-w-56 flex items-center gap-5 mt-[44px]">
          <label htmlFor="inscripto_reli" className="font-bold text-lg">
            Inscripto en RELI
          </label>
          <Checkbox
            className="h-6 w-6"
            name="inscripto_reli"
            checked={newDepto.inscripto_reli}
            onCheckedChange={(checked) =>
              setNewDepto((prevState) => ({
                ...prevState,
                inscripto_reli: checked,
              }))
            }
          />
        </div>

        <div className="min-w-56 flex items-center gap-5 mt-[44px]">
          <label htmlFor="ocupado" className="font-bold text-lg">
            Propiedad ocupada
          </label>
          <Checkbox
            className="h-6 w-6"
            name="ocupado"
            checked={newDepto.ocupado} // Vincula el checkbox al estado
            onCheckedChange={(checked) =>
              setNewDepto((prevState) => ({
                ...prevState,
                ocupado: checked,
              }))
            }
          />
        </div>

        {/* documentos */}
        <div className="min-w-56">
          <label htmlFor="documentosVarios" className="font-bold flex justify-between items-center pr-1">
            <p>Documentos</p> <span className='text-gray-400 text-xs'>Peso max. 50 mb cada uno</span>
          </label>
          <div className="file-upload">
            <Label
              htmlFor="file-upload"
              className="cursor-pointer text-black px-4 py-2 h-10 mt-2 rounded-lg border flex items-center justify-between"
            >
              <span>Cargar documentos</span>
              <Plus
                size={20}
                color="green"
                className="border-[3px] border-green-500 w-5 h-5 rounded-full"
              />
            </Label>
            <Input
              id="file-upload"
              className="hidden"
              type="file"
              multiple
              onChange={handleFileChange}
            />
          </div>

          <div>
            <Collapsible
              className={`bg-gray-100 border rounded-t-none rounded-b-2xl ${
                showFiles ? "h-auto" : "h-10"
              }`}
            >
              <CollapsibleTrigger onClick={() => setShowFiles(!showFiles)}>
                <div className="flex gap-3 h-10 items-center text-left  cursor-pointer pl-2">
                  <ChevronsUpDown size={20} />
                  <p className="w-3/4 text-sm whitespace-nowrap overflow-hidden text-ellipsis pt-0">
                    Ver documentos seleccionados
                  </p>
                </div>
              </CollapsibleTrigger>

              {files.length > 0 ? (
                files.map((file, index) => (
                  <div key={index}>
                    <CollapsibleContent className=" pl-6 pr-2 flex gap-3 h-12 items-center">
                      <FileCheckIcon size={23} />
                      <p className="w-3/4 overflow-hidden text-ellipsis whitespace-nowrap text-sm">
                        {file.name}
                      </p>
                      <X
                        className="text-red-600 cursor-pointer"
                        onClick={() => removeFile(index)}
                      />
                    </CollapsibleContent>
                  </div>
                ))
              ) : (
                <CollapsibleContent className="flex text-center justify-center gap-3 h-12 items-center">
                  <p className=" text-xs"> No hay documentos seleccionados</p>
                </CollapsibleContent>
              )}
            </Collapsible>
          </div>
        </div>

        {/* fotos */}
        <div className="min-w-56">
          <label htmlFor="upload" className="font-bold flex justify-between items-center pr-1">
            <p>Fotos</p> <span className='text-gray-400 text-xs'>Peso max. 50 mb cada una</span>
          </label>
          <div className="foto-upload">
            <Label
              htmlFor="foto-upload"
              className="cursor-pointer text-black px-4 py-2 h-10 mt-2 rounded-lg border flex items-center justify-between"
            >
              <span>Cargar fotos</span>
              <Plus
                size={20}
                color="green"
                className="border-[3px] border-green-500 w-5 h-5 rounded-full"
              />
            </Label>
            <Input
              id="foto-upload"
              className="hidden"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFotoChange}
            />
          </div>

          <div>
            <Collapsible
              className={`bg-gray-100 border rounded-t-none rounded-b-2xl ${
                showFotos ? "h-auto" : "h-10"
              }`}
            >
              <CollapsibleTrigger onClick={() => setShowFotos(!showFotos)}>
                <div className="flex gap-3 h-10 items-center text-left  cursor-pointer pl-2">
                  <ChevronsUpDown size={20} />
                  <p className="w-3/4 text-sm whitespace-nowrap overflow-hidden text-ellipsis pt-0">
                    Ver fotos seleccionadas
                  </p>
                </div>
              </CollapsibleTrigger>

              {fotos.length > 0 ? (
                fotos.map((foto, index) => (
                  <div key={index}>
                    <CollapsibleContent className=" pl-6 pr-2 flex gap-3 h-12 items-center">
                      <FileCheckIcon size={23} />
                      <p className="w-3/4 overflow-hidden text-ellipsis whitespace-nowrap text-sm">
                        {foto.name}
                      </p>
                      <X
                        className="text-red-600 cursor-pointer"
                        onClick={() => removeFoto(index)}
                      />
                    </CollapsibleContent>
                  </div>
                ))
              ) : (
                <CollapsibleContent className="flex text-center justify-center gap-3 h-12 items-center">
                  <p className=" text-xs"> No hay fotos seleccionadas</p>
                </CollapsibleContent>
              )}
            </Collapsible>
          </div>
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
            rows={4}
            value={newDepto.obs_datos}
            onChange={(e) =>
              setNewDepto({ ...newDepto, obs_datos: e.target.value })
            }
          />
        </div>

      </Form>

      <div className="flex justify-center gap-10 my-8">
        <Button
          type="submit"
          onClick={(e) => handleSubmit(e)}
          className="bg-green-600 h-10 px-6 font-bold text-md hover:bg-green-800"
        >
        {loading ? "Guardar" : <Spinner/>}
        </Button>
        <Button className="bg-red-600 h-10 px-6 font-bold text-md hover:bg-red-800">
          CANCELAR
        </Button>
      </div>
    </div>
  );
}
