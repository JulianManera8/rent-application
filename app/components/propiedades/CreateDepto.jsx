/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Form, NavLink, useNavigate } from "@remix-run/react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ChevronsUpDown, Plus, X, FileCheckIcon } from 'lucide-react';
import { FormInput } from "../helpers/FormInput";
import HandleGrupo from '../grupos/HandleGrupo';
import Spinner from '../helpers/loaderIcon';
import { createDepto } from '../../database/crudDeptos';
import useFetch from '../../hooks/use-fetch';
import { useUser } from '../../hooks/use-user';
import { validateRequired } from '../helpers/validation';
import { Label } from "../ui/label";
import { SuccessDialog } from "./SuccesDialog";
import { Switch } from "../ui/switch";


export default function CreateDepto() {
  const userLoged_id = useUser();
  const [files, setFiles] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [showFotos, setShowFotos] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  const [newDepto, setNewDepto] = useState({
    ubicacion_completa: '',
    descripcion: '',
    ocupado: false,
    propietario_name: '',
    locador_name: '',
    inquilino_name: '',
    cobrador_name: '',
    facturador_name: '',
    usufructuario_name: '',
    metodo_cobro: '',
    finalizacion_contrato: '',
    inscripto_reli: false,
    finalizacion_usufructo: '',
    monto_cobro: '',
    monto_cobro_inicio: '',
    fecha_actualizacion_cobro: '',
    user_id: '',
    obs_datos: '',
    files: [],
    fotos: [],
    grupo_id: '',
    inicio_contrato: '',
    inicio_usufructo: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (userLoged_id) {
      setNewDepto((prevDepto) => ({
        ...prevDepto,
        user_id: userLoged_id,
      }));
    }
  }, [userLoged_id]);

  useEffect(() => {
    setNewDepto((prevDepto) => ({
      ...prevDepto,
      files: files,
      fotos: fotos,
    }));
  }, [files, fotos]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDepto((prev) => {
      const updatedDepto = { ...prev, [name]: value };
      if (name === 'ocupado') {
        const isOcupado = value === 'true';
        if (!isOcupado) {
          updatedDepto.inquilino_name = '';
          updatedDepto.inicio_contrato = '';
          updatedDepto.finalizacion_contrato = '';
          updatedDepto.monto_cobro = '';
        }
      }
      if(name === 'usufructuario_name') {
        if (e.target.value.trim() === '') {
          updatedDepto.inicio_usufructo = '';
          updatedDepto.finalizacion_usufructo = '';
        }
      }
      return updatedDepto;
    });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = null;
    switch (name) {
      case 'ubicacion_completa':
      case 'grupo_id':
        error = validateRequired(value);
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles((f) => [...f, ...Array.from(e.target.files)]);
    }
  };

  const handleFotoChange = (e) => {
    if (e.target.files) {
      setFotos((f) => [...f, ...Array.from(e.target.files)]);
    }
  };

  const handleSelectChange = (value) => {
    setNewDepto({...newDepto, grupo_id: value});
  };

  const { loading, data: deptoCreated, fn: dbCreateDepto } = useFetch(createDepto, {newDepto});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    Object.entries(newDepto).forEach(([key, value]) => {
      if (typeof value === 'string') {
        validateField(key, value);
      }
    });

    // Check if there are any errors
    if (Object.values(errors).some((error) => error !== null)) {
      console.error('Form has errors. Please correct them before submitting.');
      return;
    }

    if (userLoged_id !== null) {
      try {
        const deptoWithoutEmptyDates = removeEmptyDates(newDepto);
        const deptoToSubmit = {
          ...deptoWithoutEmptyDates,
          files,
          fotos,
          user_id: userLoged_id
        };
        const data = await dbCreateDepto({ newDepto: deptoToSubmit });
        if (data) {
          setShowSuccessDialog(true);
          // Reset form after successful submission
          setNewDepto({
            ubicacion_completa: '',
            descripcion: '',
            ocupado: false,
            propietario_name: '',
            locador_name: '',
            inquilino_name: '',
            cobrador_name: '',
            facturador_name: '',
            usufructuario_name: '',
            metodo_cobro: '',
            finalizacion_contrato: '',
            inscripto_reli: false,
            finalizacion_usufructo: '',
            monto_cobro: '',
            monto_cobro_inicio: '',
            fecha_actualizacion_cobro: '',
            user_id: '',
            obs_datos: '',
            grupo_id: '',
            inicio_contrato: '',
            inicio_usufructo: '',
          });
          setFiles([]);
          setFotos([]);
        }
      } catch (error) {
        console.error('Error al cargar el depto o los docs', error);
        // Handle error (e.g., show error message to user)
      }
    }
  };

  function removeEmptyDates(deptoInfo) {
    const dateFields = ['finalizacion_contrato', 'finalizacion_usufructo', 'fecha_actualizacion_cobro', 'inicio_contrato', 'inicio_usufructo'];
    
    const filteredDepto = { ...deptoInfo };
    
    dateFields.forEach(field => {
      if (filteredDepto[field] === '') {
        delete filteredDepto[field];
      }
    });
  
    return filteredDepto;
  }

  useEffect(() => {
    if (deptoCreated !== null) {
      setShowSuccessDialog(true);

      const timer = setTimeout(() => {
        setShowSuccessDialog(false);
        navigate(`/dashboard/deptos`);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [deptoCreated, navigate]);

  const removeFile = (index) => {
    setFiles((f) => f.filter((_, i) => i !== index));
    if (files.length === 1) {
      setShowFiles(false);
    }
  };

  const removeFoto = (index) => {
    setFotos((f) => f.filter((_, i) => i !== index));
    if (fotos.length === 1) {
      setShowFotos(false);
    }
  };

  const isFormValid = () => {
    const requiredFields = [
      'grupo_id',
      'ubicacion_completa',
    ];

    const isValid = requiredFields.every(field => newDepto[field] !== '');
    
    // // Check inquilino_name only if the property is occupied
    // if (newDepto.ocupado && newDepto.inquilino_name === '') {
    //   return false;
    // }

    // if (newDepto.ocupado && newDepto.inicio_contrato === '' && newDepto.finalizacion_contrato === '') {
    //   return false;
    // }

    // if (newDepto.ocupado && newDepto.monto_cobro === '') {
    //   return false;
    // }

    // if (newDepto.usufructuario_name && newDepto.inicio_usufructo === '' && newDepto.finalizacion_usufructo === '') {
    //   return false;
    // }

    return isValid && Object.values(errors).every(error => error === null);
  };

  return (
    <div className="container mx-auto w-full px-4 mt-10">
      <Form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 gap-y-8 items-start justify-items-stretch">
        <SuccessDialog showSuccessDialog={showSuccessDialog}/>

        <HandleGrupo onSelectChange={handleSelectChange} />

        <FormInput
          label="Ubicación"
          name="ubicacion_completa"
          placeholder="Ej: San Juan 382, 7-A"
          value={newDepto.ubicacion_completa}
          onChange={handleInputChange}
          error={errors.ubicacion_completa}
          // disabled={false}
        />

        {/* OCUPADO */}
        <div className="min-w-56 flex items-center gap-5 my-auto">
          <Label htmlFor="ocupado" className="font-bold text-lg">Propiedad ocupada</Label>
          <Switch
            id="ocupado"
            name="ocupado"
            className="h-6 w-[44px] bg-zinc-400"
            checked={newDepto.ocupado}
            onCheckedChange={(checked) => {
            setNewDepto((prev) => ({
              ...prev,
              ocupado: checked,
              // inquilino_name: checked ? prev.inquilino_name : '',
              // inicio_contrato: checked ? prev.inicio_contrato : '',
              // finalizacion_contrato: checked ? prev.finalizacion_contrato : '',
              // monto_cobro: checked ? prev.monto_cobro : '',
            }));
            // if (!checked) {
            //   setErrors((prev) => ({
            //     ...prev,
            //     inquilino_name: null,
            //     inicio_contrato: null,
            //     finalizacion_contrato: null,
            //     monto_cobro: null
            //   }));
            // }
            }}
          />
          <Label>
            {newDepto.ocupado ? 'Si' : 'No'}
          </Label>
        </div>

        <FormInput
          label="Propietario"
          name="propietario_name"
          placeholder="Ej: Lionel Messi"
          value={newDepto.propietario_name}
          onChange={handleInputChange}
          error={errors.propietario_name}
        />

        <FormInput
          label="Locador"
          name="locador_name"
          placeholder="Ej: Angel Di Maria"
          value={newDepto.locador_name}
          onChange={handleInputChange}
          error={errors.locador_name}
        />

        <FormInput
          label="Locatario / Inquilino"
          name="inquilino_name"
          placeholder="Ej: Mateo Messi"
          value={newDepto.inquilino_name}
          onChange={handleInputChange}
          error={errors.inquilino_name}
          optional={!newDepto.ocupado}
          // disabled={!newDepto.ocupado}
        />

        <FormInput
          label="Facturador"
          name="facturador_name"
          placeholder="Ej: Angel Di Maria"
          value={newDepto.facturador_name}
          onChange={handleInputChange}
          error={errors.facturador_name}
        />

        <FormInput
          label="Cobrador"
          name="cobrador_name"
          placeholder="Ej: Angel Di Maria"
          value={newDepto.cobrador_name}
          onChange={handleInputChange}
          error={errors.cobrador_name}
        />

        <div className="min-w-56">
          <Label htmlFor="descripcion" className="font-bold flex justify-between items-center pr-1">Descripción (opcional)</Label>
          <Textarea
            id="descripcion"
            name="descripcion"
            className="mt-2 text-md p-2 border-zinc-500 bg-white placeholder:text-zinc-300 font-light"
            placeholder="Ej: 5 dormitorios, 3 baños, 350mt², edificio con pileta."
            value={newDepto.descripcion}
            onChange={handleInputChange}
          />
        </div>

        <FormInput
          label="Usufructuario (opcional)"
          name="usufructuario_name"
          placeholder="Ej: Lionel Messi"
          value={newDepto.usufructuario_name}
          onChange={handleInputChange}
        />

        <FormInput
          label="Inicio del Usufructo"
          name="inicio_usufructo"
          type="date"
          value={newDepto.inicio_usufructo}
          onChange={handleInputChange}
          // disabled={!newDepto.usufructuario_name}
        />

        <FormInput
          label="Finalización del Usufructo"
          name="finalizacion_usufructo"
          type="date"
          value={newDepto.finalizacion_usufructo}
          onChange={handleInputChange}
          // disabled={!newDepto.usufructuario_name}
        />

        <FormInput
          label="Inicio del contrato"
          name="inicio_contrato"
          type="date"
          value={newDepto.inicio_contrato}
          onChange={handleInputChange}
          error={errors.inicio_contrato}
          // disabled={!newDepto.ocupado}
        />

        <FormInput
          label="Finalización del contrato"
          name="finalizacion_contrato"
          type="date"
          value={newDepto.finalizacion_contrato}
          onChange={handleInputChange}
          error={errors.finalizacion_contrato}
          // disabled={!newDepto.ocupado}
        />

        <div className="min-w-56 flex items-center gap-5 mt-8">
          <Label htmlFor="inscripto_reli" className="font-bold text-lg">Inscripto en RELI</Label>
          <Switch
            id="inscripto_reli"
            name="inscripto_reli"
            className="h-6 w-[44px] bg-zinc-400"
            checked={newDepto.inscripto_reli}
            onCheckedChange={(checked) => setNewDepto((prev) => ({ ...prev, inscripto_reli: checked }))}
          />
          <Label>
            {newDepto.inscripto_reli ? 'Si' : 'No'}
          </Label>
        </div>

        <FormInput
          label="Método de cobro (opcional)"
          name="metodo_cobro"
          placeholder="Ej: Efectivo"
          value={newDepto.metodo_cobro}
          onChange={handleInputChange}
        />

        <FormInput
          label="Precio al inicio"
          name="monto_cobro_inicio"
          type="number"
          placeholder="Ej: 160000"
          value={newDepto.monto_cobro_inicio}
          onChange={handleInputChange}
          error={errors.monto_cobro_inicio}
          hint="Solo números, como el ej."
        />

        <FormInput
          label="Precio actual"
          name="monto_cobro"
          type="number"
          placeholder="Ej: 360000"
          value={newDepto.monto_cobro}
          // disabled={!newDepto.ocupado}
          onChange={handleInputChange}
          error={errors.monto_cobro}
          hint="Solo números, como el ej."
        />

        <FormInput
          label="Ultima actualización del precio (opcional)"
          name="fecha_actualizacion_cobro"
          type="date"
          value={newDepto.fecha_actualizacion_cobro}
          onChange={handleInputChange}
          error={errors.fecha_actualizacion_cobro}
        />

        {/* File upload section */}
        <div className="min-w-56">
          <label htmlFor="documentosVarios" className="font-bold flex justify-between items-center pr-1">
            <p> Documentos (opcional)</p> 
            <span className='text-gray-400 text-xs'>Peso max. 50 mb cada uno</span>
          </label>
          <div className="file-upload">
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-black px-4 py-2 h-10 mt-2 rounded-lg border flex items-center justify-between"
            >
              <span>Cargar documentos</span>
              <Plus size={20} color="green" className="border-[3px] border-green-500 w-5 h-5 rounded-full" />
            </label>
            <input
              id="file-upload"
              className="hidden"
              type="file"
              multiple
              onChange={handleFileChange}
            />
          </div>

          <Collapsible className={`bg-gray-100 border rounded-t-none rounded-b-2xl ${showFiles ? "h-auto" : "h-10"}`}>
            <CollapsibleTrigger onClick={() => setShowFiles(!showFiles)}>
              <div className="flex gap-3 h-10 items-center text-left cursor-pointer pl-2">
                <ChevronsUpDown size={20} />
                <p className="w-3/4 text-sm whitespace-nowrap overflow-hidden text-ellipsis pt-0">
                  Ver documentos seleccionados
                </p>
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent>
              {files.length > 0 ? (
                files.map((file, index) => (
                  <div key={index} className="pl-6 pr-2 flex gap-3 h-12 items-center">
                    <FileCheckIcon size={23} />
                    <p className="w-3/4 overflow-hidden text-ellipsis whitespace-nowrap text-sm">
                      {file.name}
                    </p>
                    <X className="text-red-600 cursor-pointer" onClick={() => removeFile(index)} />
                  </div>
                ))
              ) : (
                <div className="flex text-center justify-center gap-3 h-12 items-center">
                  <p className="text-xs">No hay documentos seleccionados</p>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Photo upload section */}
        <div className="min-w-56">
          <label htmlFor="upload" className="font-bold flex justify-between items-center pr-1">
            <p>Fotos (opcional)</p> <span className='text-gray-400 text-xs'>Peso max. 50 mb cada una</span>
          </label>
          <div className="foto-upload">
            <label
              htmlFor="foto-upload"
              className="cursor-pointer text-black px-4 py-2 h-10 mt-2 rounded-lg border flex items-center justify-between"
            >
              <span>Cargar fotos</span>
              <Plus size={20} color="green" className="border-[3px] border-green-500 w-5 h-5 rounded-full" />
            </label>
            <input
              id="foto-upload"
              className="hidden"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFotoChange}
            />
          </div>

          <Collapsible className={`bg-gray-100 border rounded-t-none rounded-b-2xl ${showFotos ? "h-auto" : "h-10"}`}>
            <CollapsibleTrigger onClick={() => setShowFotos(!showFotos)}>
              <div className="flex gap-3 h-10 items-center text-left cursor-pointer pl-2">
                <ChevronsUpDown size={20} />
                <p className="w-3/4 text-sm whitespace-nowrap overflow-hidden text-ellipsis pt-0">
                  Ver fotos seleccionadas
                </p>
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent>
              {fotos.length > 0 ? (
                fotos.map((foto, index) => (
                  <div key={index} className="pl-6 pr-2 flex gap-3 h-12 items-center">
                    <FileCheckIcon size={23} />
                    <p className="w-3/4 overflow-hidden text-ellipsis whitespace-nowrap text-sm">
                      {foto.name}
                    </p>
                    <X className="text-red-600 cursor-pointer" onClick={() => removeFoto(index)} />
                  </div>
                ))
              ) : (
                <div className="flex text-center justify-center gap-3 h-12 items-center">
                  <p className="text-xs">No hay fotos seleccionadas</p>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="min-w-56">
          <Label htmlFor="obs_datos" className="font-bold">Observaciones / datos extras (opcional)</Label>
          <Textarea
            id="obs_datos"
            name="obs_datos"
            className="mt-2 text-md p-2 border-zinc-500 bg-white placeholder:text-zinc-300 font-light"
            placeholder="Ej: Admite mascotas, fue reaconcidionado recientemente, cocina nueva a estrenar."
            value={newDepto.obs_datos}
            onChange={handleInputChange}
          />
        </div>
      </Form>

      <div className="flex justify-center gap-10 my-8">

        <Button className="bg-red-600 h-10 px-6 font-bold text-md hover:bg-red-800">
          <NavLink to='/dashboard/deptos'> Cancelar </NavLink>
        </Button>

        <Button
          type="submit"
          onClick={handleSubmit}
          className="bg-green-600 h-10 px-6 font-bold text-md hover:bg-green-800"
          disabled={loading || !isFormValid()}
        >
          {loading ? <Spinner /> : "Guardar"}
        </Button>
        
      </div>
    </div>
  );
}

