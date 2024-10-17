import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";

export default function CreateDepto() {
  return (
    <div className="container mx-auto w-full mr-14 px-0 mt-10">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 ml-3 items-start justify-items-stretch min-w-full text-lg ">
        <div className="min-w-56">
          <label htmlFor="ubicacion" className="font-bold">Ubicación</label>
          <Input className="mt-2 text-md p-2" placeholder="Ej: San Juan 382 piso 7" name="ubicacion" />
        </div>
        <div className="min-w-56">
          <label htmlFor="propietario" className="font-bold">Propietario</label>
          <Input className="mt-2 text-md p-2" placeholder="Ej: Lionel Messi" name="propietario" />
        </div>
        <div className="min-w-56">
          <label htmlFor="usufructuario" className="font-bold">Usufructuario</label>
          <Input className="mt-2 text-md p-2" placeholder="Ej: Lionel Messi" name="usufructuario" />
        </div>
        <div className="min-w-56">
          <label htmlFor="locador" className="font-bold">Locador</label>
          <Input className="mt-2 text-md p-2" placeholder="Ej: Angel Di Maria" name="locador" />
        </div>
        <div className="min-w-56">
          <label htmlFor="locatario" className="font-bold">Locatario / Inquilino </label>
          <Input className="mt-2 text-md p-2" placeholder="Ej: Mateo Messi" name="locatario" />
        </div>
        <div className="min-w-56">
          <label htmlFor="facturador" className="font-bold">Facturador</label>
          <Input className="mt-2 text-md p-2" placeholder="Ej: Angel Di Maria" name="facturador" />
        </div>
        <div className="min-w-56">
          <label htmlFor="descripcion" className="font-bold">Descripción</label>
          <Textarea className="mt-2 text-md p-2" placeholder="Ej: 5 dormitorios, 3 baños, 350mt², edificio con pileta y parrilla en la terraza." name="descripcion" />
        </div>
        <div className="min-w-56">
          <label htmlFor="vencimientoUsufructo" className="font-bold">Vencimiento del Usufructo</label>
          <Input className="mt-2 text-md p-2" type="date" name="vencimientoUsufructo" />
        </div>
        <div className="min-w-56">
          <label htmlFor="Contrato" className="font-bold">Contrato</label>
          <Input className="mt-2 text-md p-2" placeholder="Ej: " type="file" name="Contrato" />
        </div>
        <div className="min-w-56">
          <label htmlFor="metodoCobro" className="font-bold">Metodo de cobro</label>
          <Input className="mt-2 text-md p-2" placeholder="Ej: Efectivo" name="metodoCobro" />
        </div>
        <div className="min-w-56">
          <label htmlFor="precioInicio" className="font-bold">Precio al inicio</label>
          <div className="relative">
            <span className="absolute top-[6px] left-[8px] font-bold"> $ </span>
            <Input className="mt-2 text-md p-2 pl-6" placeholder="160.000,00" type="number" name="precioInicio" />
          </div>
        </div>
        <div className="min-w-56">
          <label htmlFor="precioActual" className="font-bold">Precio Actual</label>
          <div className="relative">
            <span className="absolute top-[6px] left-[8px] font-bold"> $ </span>
            <Input className="mt-2 text-md p-2 pl-6" placeholder="360.000,00" type="number" name="precioActual" />
          </div>
        </div>
        <div className="min-w-56">
          <label htmlFor="ultimaActualizacionPrecio" className="font-bold">
            Ultima  actualización del precio
          </label>
          <Input className="mt-2 text-md p-2" placeholder="" type="date" name="ultimaActualizacionPrecio" />
        </div>
        <div className="min-w-56 flex items-center gap-5 mt-[44px]">
          <label htmlFor="reli" className="font-bold">Inscripto en RELI</label>
          <Checkbox className="h-6 w-6" name="reli" />
        </div>
        <div className="min-w-56">
          <label htmlFor="documentosVarios" className="font-bold">Documentos varios</label>
          <Input className="mt-2 text-md p-2" placeholder="" type="text" name="documentosVarios" />
        </div>
        <div className="min-w-56">
          <label htmlFor="obsDatos" className="font-bold"> Observaciónes / datos extras</label>
          <Textarea className="mt-2 text-md p-2" placeholder="Ej: Admite mascotas, fue reaconcidionado recientemente, cocina nueva a estrenar." name="obsDatos" />
        </div>

        <div>
            Galeria de fotos
        </div>

      </section>

      <div className="flex justify-center gap-10">
        <Button className="bg-green-600 h-10 px-6 font-bold text-md hover:bg-green-800"> GUARDAR PROPIEDAD </Button>
        <Button className="bg-red-600 h-10 px-6 font-bold text-md hover:bg-red-800"> CANCELAR Y VOLVER </Button>
      </div>
    </div>
  );
}
