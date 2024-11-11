/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import useFetch from "../hooks/use-fetch";
import supabase from "../lib/supabase";
import Spinner from '../components/loaderIcon'
import { getBalances, removeBalance } from "../database/crudBalances";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { FileChartColumnIncreasingIcon, EditIcon, XSquare, Download } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { useNavigation } from "@remix-run/react";


export default function DashboardMoneyAll({ months, balanceCreated }) {


  const [userLoged_id, setUserLogedId] = useState(null);
  const [balanceInfo, setBalanceInfo] = useState([
    {
    mes_balance: '',
    año_balance: '',
    url_balance: '',
    }
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [filterValue, setFilterValue] = useState("sinfiltro");

  const navigation = useNavigation()

  useEffect(() => {
    setFilterValue(filterValue)
  }, [filterValue, setFilterValue])

  const filteredMonths = months.filter((month) =>
    month.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { loading, error, data: dataBalances, fn: fnGetBalances } = useFetch(getBalances, { userId: userLoged_id});

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data && data.user) {
        setUserLogedId(data.user.id);
      }
      if (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (userLoged_id) {
      fnGetBalances({ userId: userLoged_id }); 
      if(error) console.error(error)
    }
  }, [userLoged_id]);

  useEffect(() => {
    if (dataBalances) {
      setBalanceInfo(dataBalances);
    }
  }, [dataBalances]);

  const filteredBalances = (balanceInfo || []).filter((balance) => {
    const matchesSearchTerm =
      balance.mes_balance.toLowerCase().includes(searchTerm.toLowerCase()) ||
      balance.año_balance.toLowerCase().includes(searchTerm.toLowerCase())
  
    return matchesSearchTerm;
  });

  const handleDeleteBalance = async (balanceSelected) => {

    const getPath = balanceSelected.url_excel.substring(75)

    const infoBalance = {
      id: balanceSelected.id,
      path: getPath
    }

    try {
      await removeBalance(infoBalance);
      
      setBalanceInfo((prevBalances) =>
        prevBalances.filter(balance => balance.id !== infoBalance.id)
      );
      
    } catch (error) {
      console.error("Error al eliminar el balance:", error.message);
    }
  }

  useEffect(() => {
    if(userLoged_id && balanceCreated) {
      fnGetBalances({ userId: userLoged_id });
    }
  }, [balanceCreated])
  console.log(filteredBalances)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-[#194567]">
          Todos los Balances Monetarios
        </h1>

        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <div className="flex items-center">
          <span className="mr-2">Sort by :</span>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Newest">Newest</SelectItem>
              <SelectItem value="Oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>AÑO</TableHead>
            <TableHead>MES</TableHead>
            <TableHead>PLANILLA</TableHead>
            <TableHead>ACCIONES</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading 
          ? (
            //SKELETON
            <>
              <TableRow>
                <TableCell>
                  <Skeleton className="w-2/4 h-5 bg-gray-200" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-2/4 h-5 bg-gray-200" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-2/4 h-5 bg-gray-200" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-2/4 h-5 bg-gray-200" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Skeleton className="w-2/4 h-5 bg-gray-200" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-2/4 h-5 bg-gray-200" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-2/4 h-5 bg-gray-200" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-2/4 h-5 bg-gray-200" />
                </TableCell>
              </TableRow>
            </>
          ) 
          : (
            filteredBalances.length < 1 
            ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="text-center py-4">
                  No hay balances todavía.
                </TableCell>
              </TableRow>)
            : (
              filteredBalances.map((balance, i) => (
                <TableRow key={i} className="h-full">
                  <TableCell className="w-1/4">{balance.año_balance}</TableCell>
                  <TableCell className="w-1/4">{balance.mes_balance}</TableCell>
                  <TableCell className="w-1/4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      <FileChartColumnIncreasingIcon />
                      {balance.file} Balance
                    </Button>
                  </TableCell>          
                  <TableCell className="h-full"> 
                    <div className="h-full flex flex-row items-center  gap-7 ">
                    <EditIcon size={28} className="cursor-pointer hover:text-blue-500 transition-all" />

                    {/* Borrar balance */}
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <XSquare size={28} className="cursor-pointer hover:text-red-500 transition-all"/>
                      </AlertDialogTrigger>
                      <AlertDialogContent className=''>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-center">Estas a punto de borrar un balance</AlertDialogTitle>
                          <AlertDialogDescription className="text-center"> ¡Esta accion no se puede revertir!</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="sm:justify-center justify-evenly flex flex-row items-center">
                          <AlertDialogCancel className='h-10 mt-0'>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            className={`h-10 ${ loading ? 'opacity-50' : ''}`}
                            disabled={loading}
                            onClick={() => handleDeleteBalance(balance)}
                          >
                            {loading ? <Spinner /> : 'Continue'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Download
                      size={28}
                      className="cursor-pointer hover:text-green-500 transition-all"
                      onClick={() => window.open(`${balance.url_excel}`, '_blank')}
                    />                    
                    </div>
                  </TableCell>
                </TableRow>
              ))
              )
            ) 
            
          
          }

          
        </TableBody>
      </Table>
    </div>
  );
}
