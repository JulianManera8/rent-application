/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import useFetch from "../../hooks/use-fetch";
import { insertBalance } from "../../database/crudBalances";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ChevronsUpDown, Plus, XSquare, FileCheckIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "../ui/sheet";
import { Form } from "@remix-run/react";
import HandleGrupo from '../grupos/HandleGrupo';
import Spinner from "../helpers/loaderIcon";
import Error from "../helpers/Error";


export default function AddBalance({months, setBalanceCreated, userId}) {

  const year = new Date().getFullYear();
  const yearMin = year - 50;
  const yearValues = Array.from({ length: year - yearMin + 1 }, (_, i) => year - i);

  const [ loading, setLoading ] = useState(false)
  const [ errors, setErrors ] = useState([])
  const [ isOpen, setIsOpen ] = useState(false)
  const [file, setFile] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [showFile, setShowFile] = useState(false);
  
  const [balanceInfo, setBalanceInfo] = useState({
    user_id: "",
    grupo_id: "",
    mes_balance: "",
    año_balance: "",
    file: null, 
  });

  const { fn: dbInsertBalance } = useFetch(insertBalance, { balanceInfo });

  useEffect(() => {
      if (userId) {
        setBalanceInfo((prev) => ({ ...prev, user_id: userId }));
      }
  }, [userId]);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setBalanceInfo((prev) => ({ ...prev, file: uploadedFile }));
    setDisabled(!uploadedFile);
  };

  const validate = (dataBalance) => {
    if(dataBalance.mes_balance === '' || dataBalance.año_balance === '' || dataBalance.grupo_id === '') {
      return false
    }
    return true
  }

  const handleAddBalance = async (e) => {
    e.preventDefault();
    setErrors([]);
  
    if(!validate(balanceInfo)) {
      setDisabled(true)
      
      setTimeout(() => {
        setDisabled(false)
      }, 2000);
      return setErrors({error:'Debes completar todos los campos'})
    }

    if (userId !== null) {

      try {
        setLoading(true)
        await dbInsertBalance(balanceInfo);

        setFile(null);
        setBalanceCreated(balanceInfo)
        setIsOpen(false)
        setBalanceInfo({
          user_id: userId, 
          mes_balance: "",
          año_balance: "",
          file: null,
        });
        document.getElementById('file-upload').value = '';
        setDisabled(true)
        setLoading(false)

      } catch (error) {
        console.error("Error al cargar el balance:", error);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setBalanceInfo((prev) => ({ ...prev, file: null }));
    setDisabled(true);
    // Reset the file input
    const fileInput = document.getElementById('file-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSelectChange = (value) => {
    setBalanceInfo({...balanceInfo, grupo_id: value});
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="bg-green-600 rounded-lg text-white h-10 px-6 font-bold text-md hover:bg-green-800"
        onClick={() => {setIsOpen(true)}}
      >
        Agregar Balance
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>CARGAR NUEVO BALANCE</SheetTitle>
          <SheetDescription>
            Completa estos campos con el mes y el año correspondientes al balance, y luego carga el balance propiamente dicho.
          </SheetDescription>
        </SheetHeader>
        <Form className=" space-y-10 w-full mt-8">

          {/* GRUPO */}
          <div>
            <HandleGrupo onSelectChange={handleSelectChange} userId={userId}/>
          </div>

          {/* MES */} 
          <div className="min-w-full space-y-2">
            <Label htmlFor="mesBalance" className="font-bold text-md">Mes del balance</Label>
            <Select onValueChange={(value) => setBalanceInfo((prev) => ({ ...prev, mes_balance: value }))} className="w-full">
              <SelectTrigger className="w-full" >
                <SelectValue placeholder="Elegir mes" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* AÑO */}
          <div className="w-full space-y-2">
            <Label htmlFor="añoBalance" className="font-bold text-md">Año del balance</Label>
            <Select onValueChange={(value) => setBalanceInfo((prev) => ({ ...prev, año_balance: value }))} value={String(balanceInfo.año_balance)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Elegir año"/>
              </SelectTrigger>
              <SelectContent>
                {yearValues.map((year) => (
                  <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
         
          {/* DOCUMENTO */}
          <div className="min-w-56">
            <Label htmlFor="file-upload" className="font-bold mb-2 text-md">Documento</Label>
            <div className="file-upload">
              <Label htmlFor="file-upload" className="cursor-pointer text-black px-4 py-2 h-10 mt-2 rounded-lg border flex items-center justify-between">
                <span>Cargar documento</span>
                <Plus size={20} color="green" className="border-[3px] border-green-500 w-5 h-5 rounded-full" />
              </Label>
              <Input key={file ? 'file-present' : 'no-file'} id="file-upload" accept=".pdf, .xls, .xlsx, .csv" className="hidden" type="file" onChange={handleFileChange} />
            </div>

            <Collapsible className={`bg-gray-100 border rounded-b-2xl w-full ${showFile ? "h-auto" : "h-10"}`}>
              <CollapsibleTrigger onClick={() => setShowFile(!showFile)} className="w-full">
                <div className="flex w-full gap-3 h-10 items-center text-left cursor-pointer pl-2">
                  <ChevronsUpDown size={20} />
                  <p className="w-full text-sm whitespace-nowrap overflow-hidden text-ellipsis pt-0">
                    Ver documentos seleccionados
                  </p>
                </div>
              </CollapsibleTrigger>

              {file ? (
                <CollapsibleContent className="pl-6 pr-2 flex gap-3 h-12 items-center">
                  <FileCheckIcon size={23} />
                  <p className="w-3/4 overflow-hidden text-ellipsis whitespace-nowrap text-sm">{file.name}</p>
                  <XSquare className="text-red-600 cursor-pointer" onClick={removeFile} />
                </CollapsibleContent>
              ) : (
                <CollapsibleContent className="flex text-center justify-center gap-3 h-12 items-center">
                  <p className="text-xs">No hay documentos seleccionados</p>
                </CollapsibleContent>
              )}
            </Collapsible>
          </div>

          <SheetFooter className=" flex flex-col sm:flex-col sm:justify-end sm:space-x-2">
            <div className="flex mt-2 w-full flex-wrap-reverse gap-5 justify-center sm:justify-between mb-5">
              <Button type="button" onClick={() => {setFile(null), setIsOpen(false)}}>Cancelar</Button>
              <Button 
                type="submit"
                disabled={disabled || loading} 
                className="bg-green-600"
                onClick={(e) => handleAddBalance(e)}
              >
              {loading ? <Spinner /> : 'Guardar Balance'}
              </Button>
            </div>

            {errors?.error ? <Error errorMessage={errors?.error}/> : ''} 

          </SheetFooter>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

