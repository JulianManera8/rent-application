/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { Lock, LockOpen } from "lucide-react";
import { useState } from "react";

const departamentos = [
  {
    id: 1,
    foto: "/placeholder.svg",
    direccion: "Salta 1234",
    propietario: "Marcelo Manera",
    facturador: "Marcelo Manera",
    cobrador: "Javier Deptos",
    inquilino: "Julio Cesar",
    estado: "Ocupado",
  },
  {
    id: 2,
    foto: "/placeholder.svg",
    direccion: "Rioja 765",
    propietario: "Marcelo Manera",
    facturador: "Marcelo Manera",
    cobrador: "Javier Deptos",
    inquilino: "-",
    estado: "Desocupado",
  },
  {
    id: 3,
    foto: "/placeholder.svg",
    direccion: "Buenos aires 234",
    propietario: "Veronica Manera",
    facturador: "Veronica Manera",
    cobrador: "Javier Deptos",
    inquilino: "-",
    estado: "Desocupado",
  },
  {
    id: 4,
    foto: "/placeholder.svg",
    direccion: "Urquiza 6754",
    propietario: "Veronica Manera",
    facturador: "Veronica Manera",
    cobrador: "Javier Deptos",
    inquilino: "Tiger Woods",
    estado: "Ocupado",
  },
  {
    id: 5,
    foto: "/placeholder.svg",
    direccion: "Urquiza 754",
    propietario: "Veronica Manera",
    facturador: "Marcelo Manera",
    cobrador: "Julian Manera",
    inquilino: "Tiger Woods",
    estado: "Ocupado",
  },
  {
    id: 6,
    foto: "/placeholder.svg",
    direccion: "Santa Fe 1754",
    propietario: "Veronica Manera",
    facturador: "Veronica Manera",
    cobrador: "Julian Manera",
    inquilino: "Tiger Woods",
    estado: "Ocupado",
  },
  {
    id: 7,
    foto: "/placeholder.svg",
    direccion: "Rioja 2754",
    propietario: "Veronica Manera",
    facturador: "Marcelo Manera",
    cobrador: "Julian Manera",
    inquilino: "Tiger Woods",
    estado: "Ocupado",
  },
  {
    id: 8,
    foto: "/placeholder.svg",
    direccion: "Buenos Aires 3754",
    propietario: "Veronica Manera",
    facturador: "Veronica Manera",
    cobrador: "Javier Deptos",
    inquilino: "-",
    estado: "Desocupado",
  },
  {
    id: 9,
    foto: "/placeholder.svg",
    direccion: "San Lorenzo 354",
    propietario: "Veronica Manera",
    facturador: "Marcelo Manera",
    cobrador: "Javier Deptos",
    inquilino: "Lionel Messi",
    estado: "Ocupado",
  },
  {
    id: 10,
    foto: "/placeholder.svg",
    direccion: "Brown 1754",
    propietario: "Veronica Manera",
    facturador: "Marcelo Manera",
    cobrador: "Julian Manera",
    inquilino: "Tiger Woods",
    estado: "Ocupado",
  },
  {
    id: 11,
    foto: "/placeholder.svg",
    direccion: "Brown 714",
    propietario: "Veronica Manera",
    facturador: "Marcelo Manera",
    cobrador: "Julian Manera",
    inquilino: "Tiger Woods",
    estado: "Ocupado",
  },
  {
    id: 12,
    foto: "/placeholder.svg",
    direccion: "Rioja 254",
    propietario: "Veronica Manera",
    facturador: "Marcelo Manera",
    cobrador: "Julian Manera",
    inquilino: "Lionel Messi",
    estado: "Ocupado",
  },
  {
    id: 13,
    foto: "/placeholder.svg",
    direccion: "San Juan 54",
    propietario: "Veronica Manera",
    facturador: "Marcelo Manera",
    cobrador: "Julian Manera",
    inquilino: "Tiger Woods",
    estado: "Ocupado",
  },
  {
    id: 14,
    foto: "/placeholder.svg",
    direccion: "Alem 1354",
    propietario: "Veronica Manera",
    facturador: "Marcelo Manera",
    cobrador: "Julian Manera",
    inquilino: "Lionel Messi",
    estado: "Ocupado",
  },
  {
    id: 15,
    foto: "/placeholder.svg",
    direccion: "Juan Manuel de Rosas 7234",
    propietario: "Veronica Manera",
    facturador: "Marcelo Manera",
    cobrador: "Julian Manera",
    inquilino: "Tiger Woods",
    estado: "Ocupado",
  },
];

export async function loader({ params }) {
  const slug = params.slug;
  return slug;
}

export default function DeptoSelected({ slug }) {

  const [edit, setEdit] = useState(false)

  const deptoSelected = departamentos.filter(
    (depto) => parseInt(slug) === depto.id
  );

  const deptoObjetoPrueba = {
    estado: deptoSelected[0].estado,
    ubicacion: deptoSelected[0].direccion,
    propietario: deptoSelected[0].propietario,
    usufructuario: "Marcelo Manera",
    locador: "Marcelo Manera",
    locatario: "Marcelo Manera",
    facturador: deptoSelected[0].facturador,
    descripcion: "3 dormitorios, terraza y cocina nueva.",
    vencimientoUsufructo: "20/05/2025",
    contrato: "",
    precioInicio: 300000,
    precioActual: 600000,
    ultimaActualizacionPrecio: "20/05/2025",
    reli: true,
    documentosVarios: "",
    obsDatos: "3 dormitorios, terraza y cocina nueva.",
  };

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
                deptoObjetoPrueba.estado === "Ocupado"
                  ? "bg-green-100 text-green-800 border-2 border-green-600"
                  : "bg-red-100 text-red-800 border-2 border-red-600"
              }`}
            >
              {deptoObjetoPrueba.estado}
            </span>
          </div>
          <button onClick={() => setEdit(!edit)} className="flex items-center border border-gray-200 shadow-md rounded-full h-20 w-20 justify-center hover:shadow-lg transition-all cursor-pointer">
            {!edit ? <Lock className="w-10 h-10"/> : <LockOpen className="w-10 h-10"/>}
          </button>
        </div>
      </div>
      <div className="container mx-auto w-full mr-14 px-0 mt-10">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 ml-3 items-start justify-items-stretch min-w-full text-lg ">
          <div className="min-w-56">
            <label htmlFor="ubicacion" className={`font-bold text-md ${!edit ? 'text-[#dbdbdb] p-2' : 'text-black border-none p-2'}`}> Ubicación </label>
            <Input
              className={`mt-2 text-xl  ${edit ? 'text-gray-600 p-2' : 'text-black border-none p-2'}`}
              placeholder="Ej: San Juan 382 piso 7"
              name="ubicacion"
              value={deptoObjetoPrueba.ubicacion}
              readOnly={!edit}
            />
          </div>
          <div className="min-w-56">
            <label htmlFor="propietario" className={`font-bold text-md ${!edit ? 'text-[#dbdbdb] p-2' : 'text-black border-none p-2'}`}> Propietario </label>
            <Input
              className={`mt-2 text-xl  ${edit ? 'text-gray-600 p-2' : 'text-black border-none p-2'}`}
              placeholder="Ej: Lionel Messi"
              name="propietario"
              value={deptoObjetoPrueba.propietario}
              readOnly={!edit}
            />
          </div>
          <div className="min-w-56">
            <label htmlFor="usufructuario" className={`font-bold text-md ${!edit ? 'text-[#dbdbdb] p-2' : 'text-black border-none p-2'}`}> Usufructuario </label>
            <Input
              className={`mt-2 text-xl  ${edit ? 'text-gray-600 p-2' : 'text-black border-none p-2'}`}
              placeholder="Ej: Lionel Messi"
              name="usufructuario"
              value={deptoObjetoPrueba.usufructuario}
              readOnly={!edit}
            />
          </div>
          <div className="min-w-56">
            <label htmlFor="locador" className={`font-bold text-md ${!edit ? 'text-[#dbdbdb] p-2' : 'text-black border-none p-2'}`}> Locador </label>
            <Input
              className={`mt-2 text-xl  ${edit ? 'text-gray-600 p-2' : 'text-black border-none p-2'}`}
              placeholder="Ej: Angel Di Maria"
              name="locador"
              value={deptoObjetoPrueba.locador}
              readOnly={!edit}
            />
          </div>
          <div className="min-w-56">
            <label htmlFor="locatario" className={`font-bold text-md ${!edit ? 'text-[#dbdbdb] p-2' : 'text-black border-none p-2'}`}> Locatario / Inquilino{" "} </label>
            <Input
              className={`mt-2 text-xl  ${edit ? 'text-gray-600 p-2' : 'text-black border-none p-2'}`}
              placeholder="Ej: Mateo Messi"
              name="locatario"
              value={deptoObjetoPrueba.locatario}
              readOnly={!edit}
            />
          </div>
          <div className="min-w-56">
            <label htmlFor="facturador" className={`font-bold text-md ${!edit ? 'text-[#dbdbdb] p-2' : 'text-black border-none p-2'}`}> Facturador </label>
            <Input
              className={`mt-2 text-xl  ${edit ? 'text-gray-600 p-2' : 'text-black border-none p-2'}`}
              placeholder="Ej: Angel Di Maria"
              name="facturador"
              value={deptoObjetoPrueba.facturador}
              readOnly={!edit}
            />
          </div>
          <div className="min-w-56">
            <label htmlFor="descripcion" className={`font-bold text-md ${!edit ? 'text-[#dbdbdb] p-2' : 'text-black border-none p-2'}`}> Descripción </label>
            <Textarea
              className={`mt-2 text-xl  ${edit ? 'text-gray-600 p-2' : 'text-black border-none p-2'}`}
              placeholder="Ej: 5 dormitorios, 3 baños, 350mt², edificio con pileta y parrilla en la terraza."
              name="descripcion"
              value={deptoObjetoPrueba.descripcion}
              readOnly={!edit}
            />
          </div>
          <div className="min-w-56">
            <label htmlFor="vencimientoUsufructo" className={`font-bold text-md ${!edit ? 'text-[#dbdbdb] p-2' : 'text-black border-none p-2'}`}> Vencimiento del Usufructo </label>
            <Input
              className={`mt-2 text-xl  ${edit ? 'text-gray-600 p-2' : 'text-black border-none p-2'}`}
              type="date"
              name="vencimientoUsufructo"
              value={deptoObjetoPrueba.vencimientoUsufructo}
              readOnly={!edit}
            />
          </div>
          <div className="min-w-56">
            <label htmlFor="Contrato" className={`font-bold text-md ${!edit ? 'text-[#dbdbdb] p-2' : 'text-black border-none p-2'}`}> Contrato </label>
            <Input
              className={`mt-2 text-xl  ${edit ? 'text-gray-600 p-2' : 'text-black border-none p-2'}`}
              placeholder="Ej: "
              type="file"
              name="Contrato"
              value={deptoObjetoPrueba.contrato}
              readOnly={!edit}
            />
          </div>
          <div className="min-w-56">
            <label htmlFor="precioInicio" className={`font-bold text-md ${!edit ? 'text-[#dbdbdb] p-2' : 'text-black border-none p-2'}`}> Precio al inicio </label>
            <div className="relative">
              <span className="absolute top-[6px] left-[8px] font-bold"> $ </span>
              <Input
              className={`mt-2 text-xl ${edit ? 'text-gray-600 pl-6' : 'text-black border-none pl-6'}`}
                placeholder="160.000,00"
                type="number"
                name="precioInicio"
                value={deptoObjetoPrueba.precioInicio}
                readOnly={!edit}
              />
            </div>
          </div>
          <div className="min-w-56">
            <label htmlFor="precioActual" className={`font-bold text-md ${!edit ? 'text-[#dbdbdb] p-2' : 'text-black border-none p-2'}`}>Precio Actual</label>
            <div className="relative">
            <span className="absolute top-[6px] left-[8px] font-bold"> $ </span>
              <Input
              className={`mt-2 text-xl ${edit ? 'text-gray-600 pl-6' : 'text-black border-none pl-6'}`}
              placeholder="360.000,00"
                type="number"
                name="precioActual"
                value={deptoObjetoPrueba.precioActual}
                readOnly={!edit}
              />
            </div>
          </div>
          <div className="min-w-56">
            <label htmlFor="ultimaActualizacionPrecio" className={`font-bold text-md ${!edit ? 'text-[#dbdbdb] p-2' : 'text-black border-none p-2'}`}>Ultima actualización del precio</label>
            <Input
              className={`mt-2 text-xl  ${edit ? 'text-gray-600 p-2' : 'text-black border-none p-2'}`}
              placeholder=""
              type="date"
              name="ultimaActualizacionPrecio"
              value={deptoObjetoPrueba.ultimaActualizacionPrecio}
              readOnly={!edit}
            />
          </div>
          <div className="min-w-56 flex items-center gap-5 mt-[44px]">
            <label htmlFor="reli" className={`font-bold text-md ${!edit ? 'text-[#dbdbdb] p-2' : 'text-black border-none p-2'}`}>Inscripto en RELI</label>
            <Checkbox
              className="h-6 w-6"
              name="reli"
              value={deptoObjetoPrueba.reli}
              readOnly={!edit}
            />
          </div>
          <div className="min-w-56">
            <label htmlFor="documentosVarios" className={`font-bold text-md ${!edit ? 'text-[#dbdbdb] p-2' : 'text-black border-none p-2'}`}>Documentos varios</label>
            <Input
              className={`mt-2 text-xl  ${edit ? 'text-gray-600 p-2' : 'text-black border-none p-2'}`}
              placeholder=""
              type="text"
              name="documentosVarios"
              value={deptoObjetoPrueba.documentosVarios}
              readOnly={!edit}
            />
          </div>
          <div className="min-w-56">
            <label htmlFor="obsDatos" className={`font-bold text-md ${!edit ? 'text-[#dbdbdb] p-2' : 'text-black border-none p-2'}`}>{" "}Observaciónes / datos extras</label>
            <Textarea
              className={`mt-2 text-xl  ${edit ? 'text-gray-600 p-2' : 'text-black border-none p-2'}`}
              placeholder="Ej: Admite mascotas, fue reaconcidionado recientemente, cocina nueva a estrenar."
              name="obsDatos"
              value={deptoObjetoPrueba.obsDatos}
              readOnly={!edit}
            />
          </div>

          <div>Galeria de fotos</div>
        </section>

        <div className="flex justify-center gap-10">
          <Button className="bg-green-600 h-10 px-6 font-bold text-md hover:bg-green-800">
            {" "}
            GUARDAR PROPIEDAD{" "}
          </Button>
          <Button className="bg-red-600 h-10 px-6 font-bold text-md hover:bg-red-800">
            {" "}
            CANCELAR Y VOLVER{" "}
          </Button>
        </div>
      </div>
    </div>
  );
}
