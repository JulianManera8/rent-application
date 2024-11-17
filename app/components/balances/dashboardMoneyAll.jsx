/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import useFetch from "../../hooks/use-fetch";
import { useUser } from "../../hooks/use-user";
import { getBalances, removeBalance } from "../../database/crudBalances";
import { getGrupos } from "../../database/crudGrupos";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { FileChartColumnIncreasingIcon, XSquare, Download } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Card, CardContent, CardHeader, CardTitle,} from "../ui/card";
import { NavLink } from "@remix-run/react";

export default function DashboardMoneyAll({ balanceCreated }) {
  const userLoged_id = useUser();
  const [balanceInfo, setBalanceInfo] = useState([
    {
      mes_balance: "",
      año_balance: "",
      url_balance: "",
    },
  ]);
  const [grupoInfo, setGrupoInfo] = useState([
    {
      nombre_grupo: "",
      id: "",
    },
  ])
  const [sortOrder, setSortOrder] = useState("Mas reciente");

  useEffect(() => {
    if (userLoged_id) {
      fnGetBalances({ userId: userLoged_id });
      fnGetGrupos({ user_id: userLoged_id})
      if (error) console.error(error);
      if (errorGrupo) console.error(errorGrupo);
    }
  }, [userLoged_id]);

  const { loading: loadingBalance, error, data: dataBalances, fn: fnGetBalances } = useFetch(getBalances, { userId: userLoged_id });

  const { loading: loadingGrupos, error: errorGrupo, data: dataGrupos, fn: fnGetGrupos } = useFetch(getGrupos, { user_id: userLoged_id });

  
  useEffect(() => {
    if (dataBalances) {
      // Mapa de meses a índices (0 = Enero, 1 = Febrero, ...)
      const monthMap = {
        "Enero": 0,
        "Febrero": 1,
        "Marzo": 2,
        "Abril": 3,
        "Mayo": 4,
        "Junio": 5,
        "Julio": 6,
        "Agosto": 7,
        "Septiembre": 8,
        "Octubre": 9,
        "Noviembre": 10,
        "Diciembre": 11
      };
  
      const sortedBalances = [...dataBalances].sort((a, b) => {
        // Convertir año a entero
        const yearA = parseInt(a.año_balance, 10);
        const yearB = parseInt(b.año_balance, 10);
        
        // Convertir mes a número (restando 1 para ajustar a 0-indexed)
        const monthA = monthMap[a.mes_balance];
        const monthB = monthMap[b.mes_balance];
  
        // Verificar si los valores de mes son válidos
        if (isNaN(monthA) || isNaN(monthB)) {
          console.error("Mes inválido:", a.mes_balance, b.mes_balance);
          return 0;
        }
  
        // Crear las fechas (usamos mesA y mesB como índices numéricos)
        const dateA = new Date(yearA, monthA);
        const dateB = new Date(yearB, monthB);
  
        // Comparar las fechas
        return sortOrder === "Mas reciente" ? dateB - dateA : dateA - dateB;
      });
  
      setBalanceInfo(sortedBalances);
    }
  
    if (dataGrupos) {
      setGrupoInfo(dataGrupos);
    }
  }, [dataBalances, dataGrupos, sortOrder]);


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

  useEffect(() => {
    if (userLoged_id && balanceCreated) {
      fnGetBalances({ userId: userLoged_id });
    }
  }, [balanceCreated]);

  return (
    <div className="container mx-auto px-4 py-8">

      {loadingGrupos 
      ? (
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
      )
      : (
        grupoInfo.length > 0 
        ?  
        grupoInfo.map((grupo) => (
          <div className="flex flex-col w-full mx-auto justify-between items-start md:items-center border rounded-xl shadow-md hover:shadow-lg p-3 relative mb-8 md:mb-12 transition-all" key={grupo.id}>
            <Accordion type="multiple" className="w-full" defaultValue={[`item${grupo.id}`]}>
              <AccordionItem value={`item${grupo.id}`}>
                <AccordionTrigger className="flex justify-between bg-gradient-to-br from-[#37a5ea61] to-white w-full px-3 rounded-t-xl">
                  <div className="flex justify-between items-center mb-1">
                    <h1 className="text-xl md:text-2xl font-medium text-[#194567]">
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
                      {loadingBalance 
                        ? (
                          // SKELETON
                          Array.from({ length: 2 }).map((_, i) => (
                            <TableRow key={i}>
                              <TableCell><Skeleton className="w-full h-5 bg-gray-200" /></TableCell>
                              <TableCell><Skeleton className="w-full h-5 bg-gray-200" /></TableCell>
                              <TableCell><Skeleton className="w-full h-5 bg-gray-200" /></TableCell>
                              <TableCell><Skeleton className="w-full h-5 bg-gray-200" /></TableCell>
                            </TableRow>
                          ))
                        ) 
                        : balanceInfo.filter(balance => balance.grupo_id === grupo.id).length === 0 ? (
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
                                    <FileChartColumnIncreasingIcon className="mr-2 h-4 w-4" />
                                    <span className="hidden md:inline">{balance.file}</span>
                                    <span className="md:hidden">Balance</span>
                                  </Button>
                                </TableCell>
                                <TableCell className="h-full">
                                  <div className="h-full flex flex-row items-center gap-4 sm:gap-7">
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
                                            className={`h-10 ${loadingBalance ? "opacity-50" : ""}`}
                                            disabled={loadingBalance}
                                            onClick={() => handleDeleteBalance(balance)}
                                          >
                                            {loadingBalance ? "Cargando..." : "Continuar"}
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>

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
        : (
          <div className="w-full flex justify-center h-56">
            <Card className="w-full md:w-96 h-auto md:h-40 mt-3 flex flex-col justify-center text-center shadow-lg">
              <CardHeader>
                <CardTitle className="text-base md:text-lg font-medium"> 
                  No hay grupos creados por el momento, por lo tanto tampoco hay balances.
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <NavLink to='/dashboard/grupos'>
                  <p className="w-fit items-center flex bg-green-600 rounded-lg text-white h-10 px-4 md:px-6 font-bold text-sm md:text-md hover:bg-green-800">
                    Ir a Grupos
                  </p>
                </NavLink>
              </CardContent>
            </Card>
          </div>
        )
      )}
    </div>
  )
}
