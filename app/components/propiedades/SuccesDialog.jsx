/* eslint-disable react/prop-types */
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { CheckSquare } from 'lucide-react'

export function SuccessDialog({showSuccessDialog}) {
    return (
      <Dialog open={showSuccessDialog}>
        <DialogContent className="sm:max-w-[425px]" forceMount>
          <DialogHeader>
            <DialogTitle className='flex items-center justify-left gap-x-5'>
              <CheckSquare className='text-green-600' />
              ¡Propiedad cargada correctamente!
            </DialogTitle>
            <DialogDescription className='sr-only'>
              Selecciona un archivo para agregar a la propiedad.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

