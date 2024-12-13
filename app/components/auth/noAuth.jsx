import { NavLink } from "@remix-run/react"
import { Button } from "../ui/button"
import { ShieldAlert } from 'lucide-react'

export default function Component() {
  return (
    <div className="min-h-screen flex items-start mt-[10%] justify-center ">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-xl rounded-lg">
        <div className="text-center">
          <ShieldAlert className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-6 text-3xl font-medium text-gray-900">Acceso no autorizado</h2>
          <p className="mt-2 text-sm text-gray-600">
            Esta pagina requiere autenticación.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="text-sm text-center">
            <p className="font-medium text-indigo-600">
              Por favor inicia sesión, o confirma el email para poder disfrutar de este sistema y todas sus funcionalidades.
            </p>
          </div>
          <div className="flex justify-center">
            <NavLink to="/">
              <Button className="w-full sm:w-auto">
                Ir a iniciar sesión
              </Button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}