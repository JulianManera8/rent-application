/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import useFetch from "../../hooks/use-fetch";
import { removeBalance } from "../../database/crudBalances";
import { getRolesPerGroup } from "../../database/crudGrupos";
import { getAccessBalances } from "../../database/crudAccess/crudAccessBalances";
import { getAccessGrupos } from "../../database/crudAccess/crudAccessGrupos";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { FileLineChartIcon as FileChartColumnIncreasingIcon, XSquare, Download } from 'lucide-react';
import { Skeleton } from "../ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Card, CardContent, CardHeader, CardTitle,} from "../ui/card";

export default function DashboardMoneyAll({ balanceCreated, userId }) {

  const [balanceInfoInicio, setBalanceInfoInicio] = useState([]);
  const [balanceInfo, setBalanceInfo] = useState([]);
  const [sortOrder, setSortOrder] = useState("Mas reciente");
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [rolesPerGroup, setRolesPerGroup] = useState([])

  const { loading: loadingGrupos, error: errorGrupo, data: dataGruposAccess, fn: fnGetAccessGrupos } = useFetch(getAccessGrupos, userId );
  
  useEffect(() => {
      if(!loadingGrupos) {
        setTimeout(() => {
          setShowSkeleton(false)
        }, (4000));
      }
  }, [loadingGrupos])

  useEffect(() => {
    if (userId) {
        fnGetAccessGrupos({ user_id: userId });
        if (errorGrupo) console.error(errorGrupo);
    }
  }, [userId]);

  useEffect(() => {
    async function fetchAccessData() {
      if (userId && dataGruposAccess.length > 0) {
        try {

          const gruposId = dataGruposAccess.map(grupo => grupo.id)
          const dataRoles = await getRolesPerGroup(gruposId)
          if(dataRoles) {
            setRolesPerGroup(dataRoles)
          }

          const dataBalances = await getAccessBalances(dataGruposAccess);

          setBalanceInfoInicio(dataBalances);

        } catch (err) {
          console.error("Error fetching access balances:", err);
        }
      }
    }

    fetchAccessData()
  }, [dataGruposAccess, balanceCreated]);

  useEffect(() => {
    if (balanceInfoInicio) {
      const monthMap = {
        "Enero": 0, "Febrero": 1, "Marzo": 2, "Abril": 3, "Mayo": 4, "Junio": 5,
        "Julio": 6, "Agosto": 7, "Septiembre": 8, "Octubre": 9, "Noviembre": 10, "Diciembre": 11
      };
  
      const sortedBalances = [...balanceInfoInicio].sort((a, b) => {
        const yearA = parseInt(a.año_balance, 10);
        const yearB = parseInt(b.año_balance, 10);
        const monthA = monthMap[a.mes_balance];
        const monthB = monthMap[b.mes_balance];
  
        if (isNaN(monthA) || isNaN(monthB)) {
          console.error("Mes inválido:", a.mes_balance, b.mes_balance);
          return 0;
        }
  
        const dateA = new Date(yearA, monthA);
        const dateB = new Date(yearB, monthB);
  
        return sortOrder === "Mas reciente" ? dateB - dateA : dateA - dateB;
      });
  
      setBalanceInfo(sortedBalances);
    }

  }, [balanceInfoInicio, sortOrder]);

  const handleDeleteBalance = async (balanceSelected) => {
    const getPath = balanceSelected.url_excel.substring(75);

    const infoBalance = {
      id: balanceSelected.id,
      path: getPath,
    };

    try {
      await removeBalance(infoBalance);
      setBalanceInfo((prevBalances) =>
        prevBalances.filter((balance) => balance.id !== infoBalance.id)
      );
    } catch (error) {
      console.error("Error al eliminar el balance:", error.message);
    }
  };

  const isLoading = loadingGrupos;

  return (
    <div className='w-full py-10'>

      {isLoading ? (
        // Skeleton loading for groups
        Array.from({ length: 2 }).map((_, index) => (
          <div key={`skeleton-${index}`} className="flex flex-col md:flex-row w-full justify-between items-start md:items-center relative mb-8 md:mb-12">
            <div className="flex justify-between w-full items-center mb-4 md:mb-1">
              <Skeleton className="h-10 w-full md:w-1/2 bg-gray-100" />
            </div>
            <div className="flex items-center mt-4 md:mt-0 md:absolute md:top-5 md:right-0">
              <Skeleton className="h-6 w-32 mr-2" />
            </div>
          </div>
        ))
      ) : dataGruposAccess && dataGruposAccess.length > 0 ? (
        dataGruposAccess.map((grupo) => (
          <div className="flex flex-col w-full mx-auto justify-between items-start md:items-center border rounded-xl shadow-md hover:shadow-lg p-3 relative mb-8 md:mb-12 transition-all" key={grupo.id}>
            <Accordion type="multiple" className="w-full" defaultValue={[`item${grupo.id}`]}>
              <AccordionItem value={`item${grupo.id}`}>
                <AccordionTrigger className="flex justify-between bg-gradient-to-br from-green-100/60 to-white w-full px-3 rounded-t-xl">
                  <div className="flex justify-between items-center mb-1">
                    <h1 className="text-xl md:text-2xl font-medium text-[#176c2b]">
                      Grupo: {grupo.grupo_name}
                    </h1>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="overflow-x-auto">
                    <Table className="border-b-2 border-t-2 w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-1/4">AÑO</TableHead>
                          <TableHead className="w-1/4">MES</TableHead>
                          <TableHead className="w-1/4">PLANILLA</TableHead>
                          <TableHead className="w-1/4">ACCIONES</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {balanceInfo.filter(balance => balance.grupo_id === grupo.id).length === 0 ? (
                          <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={6} className="text-left font-semibold py-4">
                              No hay balances todavía.
                            </TableCell>
                          </TableRow>
                        ) : (
                          balanceInfo
                            .filter(balance => balance.grupo_id === grupo.id)
                            .map((balance, i) => (
                              <TableRow key={i} className="h-full text-sm md:text-lg">
                                <TableCell className="w-1/4"> {balance.año_balance} </TableCell>
                                <TableCell className="w-1/4"> {balance.mes_balance} </TableCell>
                                <TableCell className="w-1/4">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center text-xs md:text-sm"
                                  >
                                    <FileChartColumnIncreasingIcon className="mr-0 h-4 w-4" />
                                    <span className="hidden md:inline">Balance</span>
                                  </Button>
                                </TableCell>
                                <TableCell className="h-full">
                                  <div className="h-full flex flex-row items-center gap-4 sm:gap-7">
                                    {rolesPerGroup.find(role => role.grupo_id === grupo.id && role.user_id_access === userId)?.role === 'editor' && (
                                      <AlertDialog>
                                        <AlertDialogTrigger>
                                          <XSquare
                                            size={20}
                                            className="cursor-pointer hover:text-red-500 transition-all"
                                          />
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle className="text-center">
                                              Estás a punto de borrar un balance
                                            </AlertDialogTitle>
                                            <AlertDialogDescription className="text-center">
                                              ¡Esta acción no se puede revertir!
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter className="sm:justify-center justify-evenly flex flex-row items-center">
                                            <AlertDialogCancel className="h-10 mt-0">Cancelar</AlertDialogCancel>
                                            <AlertDialogAction
                                              className={`h-10 ${isLoading ? "opacity-50" : ""}`}
                                              disabled={isLoading}
                                              onClick={() => handleDeleteBalance(balance)}
                                            >
                                              {isLoading ? "Cargando..." : "Continuar"}
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    )}
                                    <Download
                                      size={20}
                                      className="cursor-pointer hover:text-green-500 transition-all"
                                      onClick={() => window.open(`${balance.url_excel}`, "_blank")}
                                    />
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
        
            {/* SORT BY */}
            <div className="flex items-center mt-4 md:mt-0 md:absolute md:top-7 md:right-5">
              <span className="mr-2 text-sm md:text-base">Sort by :</span>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-fit pr-2">
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mas reciente">Mas reciente</SelectItem>
                  <SelectItem value="Mas antiguo">Mas antiguo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ))
      ) : (
        showSkeleton 
        ?  Array.from({ length: 2 }).map((_, index) => (
          <div key={`skeleton-${index}`} className="flex flex-col md:flex-row w-full justify-between items-start md:items-center relative mb-8 md:mb-12">
            <div className="flex justify-between w-full items-center mb-4 md:mb-1">
              <Skeleton className="h-10 w-full md:w-1/2 bg-gray-100" />
            </div>
            <div className="flex items-center mt-4 md:mt-0 md:absolute md:top-5 md:right-0">
              <Skeleton className="h-6 w-32 mr-2" />
            </div>
          </div>
        ))
        : <div className="w-full flex justify-center h-56">
          <Card className="w-full md:w-96 h-auto md:h-40 mt-3 flex flex-col justify-center text-center shadow-lg">
            <CardHeader>
              <CardTitle className="text-base md:text-lg font-medium"> 
                Por el momento no hay balances cargados.
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              
            </CardContent>
          </Card>
        </div>
        
      )}
    </div>
  )
}

