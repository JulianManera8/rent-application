/* eslint-disable react/prop-types */
"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { PlusSquare } from 'lucide-react'
import { insertNewDoc } from '../../database/crudDeptos'

export function AddDocumentDialog({ deptoId, onSuccess }) {
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    setIsUploading(true)
    try {
      const newDoc = await insertNewDoc({
        file,
        depto_id: deptoId
      })
      
      onSuccess(newDoc)
      setFile(null)
      setIsOpen(false)

    } catch (error) {
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className='flex items-center border border-zinc-300 cursor-pointer hover:bg-zinc-100 p-2 rounded-lg my-2 w-fit'>
          <PlusSquare className='text-green-600'/>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Documento</DialogTitle>
          <DialogDescription>
            Selecciona un archivo para agregar a la propiedad.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="document" className="text-right">
              Documento
            </Label>
            <Input
              id="document"
              type="file"
              className="col-span-3"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>
          <Button type="submit" disabled={!file || isUploading}>
            {isUploading ? 'Subiendo...' : 'Subir Documento'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

