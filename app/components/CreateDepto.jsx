import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";

// import { Button } from "../components/ui/button";
// import { NavLink } from "@remix-run/react";

export default function CreateDepto() {
  return (
    <div className="container mx-auto w-full mr-14 px-0">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl text-gray-300 font-extrabold font-inter mb-10 mt-8">
          {" "}
          Agregar Nuevo Departamento{" "}
        </h1>
      </div>
      <section>
        <div>
          <label htmlFor="ubicacion">Ubicacion</label>
          <Input name="ubicacion" />
        </div>
        <div>
          <label htmlFor="propietario">propietario</label>
          <Input name="propietario" />
        </div>
        <div>
          <label htmlFor="usufructuario">usufructuario</label>
          <Input name="usufructuario" />
        </div>
        <div>
          <label htmlFor="locador">locador</label>
          <Input name="locador" />
        </div>
        <div>
          <label htmlFor="locatario">locatario</label>
          <Input name="locatario" />
        </div>
        <div>
          <label htmlFor="facturador">facturador</label>
          <Input name="facturador" />
        </div>
        <div>
          <label htmlFor="descripcion">descripcion</label>
          <Textarea name="descripcion" />
        </div>
        <div>
          <label htmlFor="vencimientoUsufructo">vencimientoUsufructo</label>
          <Input type="date" name="vencimientoUsufructo" />
        </div>
        <div>
          <label htmlFor="Contrato">Contrato</label>
          <Input type="file" name="Contrato" />
        </div>
        <div>
          <label htmlFor="precioInicio">Precio al inicio</label>
          <Input type="number" name="precioInicio" />
        </div>
        <div>
          <label htmlFor="precioActual">Precio Actual</label>
          <Input type="number" name="precioActual" />
        </div>
        <div>
          <label htmlFor="ultimaActualizacionPrecio">
            Ultima actualizacion del precio
          </label>
          <Input type="date" name="ultimaActualizacionPrecio" />
        </div>
        <div>
          <label htmlFor="reli">Inscripto en RELI</label>
          <Checkbox name="reli" />
        </div>
        <div>
          <label htmlFor="documentosVarios">Documentos varios</label>
          <Input type="text" name="documentosVarios" />
        </div>
        <div>
          <label htmlFor="obsDatos"> Observaciones / datos extras</label>
          <Textarea name="obsDatos" />
        </div>

        <div>
            Galeria de fotos
        </div>

      </section>
    </div>
  );
}
