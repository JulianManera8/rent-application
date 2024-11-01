/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import supabase from "../lib/supabase";
import useFetch from "../hooks/use-fetch";
import { insertBalance } from "../database/crudBalances";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/ui/collapsible";
import { ChevronsUpDown, Plus, X, FileCheckIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "../components/ui/sheet";
import { Form } from "@remix-run/react";

export default function AddBalance({months}) {

  const year = new Date().getFullYear();
  const yearMin = year - 50;
  const yearValues = Array.from({ length: year - yearMin + 1 }, (_, i) => year - i);

  
  const [file, setFile] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [showFile, setShowFile] = useState(false);
  const [userLoged_id, setUserLogedId] = useState(null);
  
  const [balanceInfo, setBalanceInfo] = useState({
    user_id: "",
    mes_balance: "",
    año_balance: "",
    file: null, 
  });

  const { loading, fn: dbInsertBalance } = useFetch(insertBalance, { balanceInfo });

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data && data.user) {
        setUserLogedId(data.user.id);
        setBalanceInfo((prev) => ({ ...prev, user_id: data.user.id }));
      }
      if (error) console.error("Error al obtener el usuario:", error);
    };
    getUser();
  }, []);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0]; 
    if (uploadedFile) {
      setFile(uploadedFile);
      setBalanceInfo((prev) => ({ ...prev, file: uploadedFile })); 
      setDisabled(false)
    }
  };

  const handleAddBalance = async (e) => {
    e.preventDefault();

    if (userLoged_id !== null) {
      try {
        await dbInsertBalance(balanceInfo);

        setFile(null);
        setBalanceInfo({
          user_id: userLoged_id, 
          mes_balance: "",
          año_balance: "",
          file: null,
        });
        setDisabled(true)
        console.log("Added balance")
      } catch (error) {
        console.error("Error al cargar el balance:", error);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setBalanceInfo((prev) => ({ ...prev, file: null })); 
    setDisabled(true)
  };

  console.log(loading)

  return (
    <Sheet>
      <SheetTrigger className="bg-green-600 w-fit flex items-center text-white rounded-lg h-12 px-6 font-bold text-md hover:bg-green-800 transition-all">
        Agregar Balance
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>CARGAR NUEVO BALANCE</SheetTitle>
          <SheetDescription>
            Completa estos campos con el mes y el año correspondientes al balance, y luego carga el balance propiamente dicho.
            <br />
            <br />
            Recuerda que solo puedes cargar 1 archivo por mes.
          </SheetDescription>
        </SheetHeader>
        <Form className=" space-y-10 w-full mt-8">
          <div className="min-w-full space-y-2">
            <Label htmlFor="mesBalance" className="font-bold text-md">Mes del balance</Label>
            <Select onValueChange={(value) => setBalanceInfo((prev) => ({ ...prev, mes_balance: value }))} className="w-full">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Elegir mes" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full space-y-2">
            <Label htmlFor="añoBalance" className="font-bold text-md">Año del balance</Label>
            <Select onValueChange={(value) => setBalanceInfo((prev) => ({ ...prev, año_balance: value }))} value={String(balanceInfo.año_balance)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Elegir año"/>
              </SelectTrigger>
              <SelectContent>
                {yearValues.map((year,  index) => (
                  <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
         

          <div className="min-w-56">
            <Label htmlFor="file-upload" className="font-bold mb-2 text-md">Documento</Label>
            <div className="file-upload">
              <Label htmlFor="file-upload" className="cursor-pointer text-black px-4 py-2 h-10 mt-2 rounded-lg border flex items-center justify-between">
                <span>Cargar documento</span>
                <Plus size={20} color="green" className="border-[3px] border-green-500 w-5 h-5 rounded-full" />
              </Label>
              <Input id="file-upload" accept=".pdf, .xls, .xlsx, .csv" className="hidden" type="file" onChange={handleFileChange} />
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
                  <X className="text-red-600 cursor-pointer" onClick={removeFile} />
                </CollapsibleContent>
              ) : (
                <CollapsibleContent className="flex text-center justify-center gap-3 h-12 items-center">
                  <p className="text-xs">No hay documentos seleccionados</p>
                </CollapsibleContent>
              )}
            </Collapsible>
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <div className="flex mt-6 w-full justify-between">
                <Button type="button" onClick={() => setFile(null)}>Cancelar</Button>
                <Button 
                    type="submit" 
                    disabled={disabled} 
                    className="bg-green-600"
                    onClick={(e) => handleAddBalance(e)}
                >Guardar Balance</Button>
              </div>
            </SheetClose>
          </SheetFooter>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
