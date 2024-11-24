/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Form, NavLink, useNavigate } from "@remix-run/react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ChevronsUpDown, Plus, X, FileCheckIcon } from 'lucide-react';
import { FormInput } from "../helpers/FormInput";
import HandleGrupo from '../grupos/HandleGrupo';
import Spinner from '../helpers/loaderIcon';
import { createDepto } from '../../database/crudDeptos';
import useFetch from '../../hooks/use-fetch';
import { useUser } from '../../hooks/use-user';
import { validateRequired, validateDate, validateNumber } from '../helpers/validation';
import { Label } from "../ui/label";


export default function CreateDepto() {
  const userLoged_id = useUser();
  const [files, setFiles] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [showFotos, setShowFotos] = useState(false);
  const [errors, setErrors] = useState({});

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
    vencimiento_contrato: '',
    inscripto_reli: false,
    vencimiento_usufructo: '',
    monto_cobro: '',
    monto_cobro_inicio: '',
    fecha_actualizacion_cobro: '',
    user_id: '',
    obs_datos: '',
    files: [],
    fotos: [],
    grupo_id: '',
    shared_with: [],
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
    setNewDepto((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = null;
    switch (name) {
      case 'ubicacion_completa':
      case 'propietario_name':
      case 'locador_name':
      case 'cobrador_name':
      case 'facturador_name':
      case 'usufructuario_name':
      case 'metodo_cobro':
        error = validateRequired(value);
        break;
      case 'vencimiento_contrato':
      case 'vencimiento_usufructo':
      case 'fecha_actualizacion_cobro':
        error = validateDate(value);
        break;
      case 'monto_cobro':
      case 'monto_cobro_inicio':
        error = validateNumber(value);
        break;
      case 'inquilino_name':
        if (newDepto.ocupado) {
          error = validateRequired(value);
        }
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
        await dbCreateDepto(newDepto);
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
          vencimiento_contrato: '',
          inscripto_reli: false,
          vencimiento_usufructo: '',
          monto_cobro: '',
          monto_cobro_inicio: '',
          fecha_actualizacion_cobro: '',
          user_id: '',
          obs_datos: '',
          files: [],
          fotos: [],
          grupo_id: '',
        });
        setFiles([]);
        setFotos([]);
      } catch (error) {
        console.error('Error al cargar el depto o los docs', error);
      }
    }
  };

  useEffect(() => {
    if(deptoCreated !== null) {
      navigate(`/dashboard/deptos`);
    }
  }, [deptoCreated])

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
      'ubicacion_completa',
      'propietario_name',
      'locador_name',
      'cobrador_name',
      'facturador_name',
      'usufructuario_name',
      'metodo_cobro',
      'vencimiento_contrato',
      'vencimiento_usufructo',
      'monto_cobro',
      'monto_cobro_inicio',
      'fecha_actualizacion_cobro',
    ];

    const isValid = requiredFields.every(field => newDepto[field] !== '');
    
    // Check inquilino_name only if the property is occupied
    if (newDepto.ocupado && newDepto.inquilino_name === '') {
      return false;
    }

    return isValid && Object.values(errors).every(error => error === null);
  };

  return (
    <div className="container mx-auto w-full px-4 mt-10">
      <Form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 gap-y-8 items-start justify-items-stretch">
        <HandleGrupo onSelectChange={handleSelectChange} />

        <FormInput
          label="Ubicación"
          name="ubicacion_completa"
          placeholder="Ej: San Juan 382, 7-A"
          value={newDepto.ubicacion_completa}
          onChange={handleInputChange}
          error={errors.ubicacion_completa}
        />

        <FormInput
          label="Propietario"
          name="propietario_name"
          placeholder="Ej: Lionel Messi"
          value={newDepto.propietario_name}
          onChange={handleInputChange}
          error={errors.propietario_name}
        />

        <FormInput
          label="Usufructuario"
          name="usufructuario_name"
          placeholder="Ej: Lionel Messi"
          value={newDepto.usufructuario_name}
          onChange={handleInputChange}
          error={errors.usufructuario_name}
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
            className="mt-2 text-md p-2"
            rows={1}
            placeholder="Ej: 5 dormitorios, 3 baños, 350mt², edificio con pileta."
            value={newDepto.descripcion}
            onChange={handleInputChange}
          />
        </div>

        <FormInput
          label="Vencimiento del Usufructo"
          name="vencimiento_usufructo"
          type="date"
          value={newDepto.vencimiento_usufructo}
          onChange={handleInputChange}
          error={errors.vencimiento_usufructo}
        />

        <FormInput
          label="Vencimiento del contrato"
          name="vencimiento_contrato"
          type="date"
          value={newDepto.vencimiento_contrato}
          onChange={handleInputChange}
          error={errors.vencimiento_contrato}
        />

        <FormInput
          label="Metodo de cobro"
          name="metodo_cobro"
          placeholder="Ej: Efectivo"
          value={newDepto.metodo_cobro}
          onChange={handleInputChange}
          error={errors.metodo_cobro}
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
          onChange={handleInputChange}
          error={errors.monto_cobro}
          hint="Solo números, como el ej."
        />

        <FormInput
          label="Ultima actualización del precio"
          name="fecha_actualizacion_cobro"
          type="date"
          value={newDepto.fecha_actualizacion_cobro}
          onChange={handleInputChange}
          error={errors.fecha_actualizacion_cobro}
        />

        <div className="min-w-56 flex items-center gap-5 mt-8">
          <Label htmlFor="inscripto_reli" className="font-bold text-lg">Inscripto en RELI</Label>
          <Checkbox
            id="inscripto_reli"
            name="inscripto_reli"
            className="h-6 w-6"
            checked={newDepto.inscripto_reli}
            onCheckedChange={(checked) => setNewDepto((prev) => ({ ...prev, inscripto_reli: checked }))}
          />
        </div>

        <div className="min-w-56 flex items-center gap-5 mt-8">
          <Label htmlFor="ocupado" className="font-bold text-lg">Propiedad ocupada</Label>
          <Checkbox
            id="ocupado"
            name="ocupado"
            className="h-6 w-6"
            checked={newDepto.ocupado}
            onCheckedChange={(checked) => {
              setNewDepto((prev) => ({ ...prev, ocupado: checked }));
              if (!checked) {
                setNewDepto((prev) => ({ ...prev, inquilino_name: '' }));
                setErrors((prev) => ({ ...prev, inquilino_name: null }));
              }
            }}
          />
        </div>

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
          <Label htmlFor="obs_datos" className="font-bold">Observaciónes / datos extras (opcional)</Label>
          <Textarea
            id="obs_datos"
            name="obs_datos"
            className="mt-2 text-md p-2"
            placeholder="Ej: Admite mascotas, fue reaconcidionado recientemente, cocina nueva a estrenar."
            rows={4}
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

