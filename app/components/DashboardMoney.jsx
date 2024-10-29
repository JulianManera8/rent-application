/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { NavLink, Link } from "@remix-run/react";
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { CheckCircle, FileChartColumnIncreasingIcon } from "lucide-react"
import { useEffect, useState } from "react";
import useFetch from "../hooks/use-fetch";
import supabase from "../lib/supabase";
import { getBalances } from "../database/crudBalances";
import { Skeleton } from "./ui/skeleton";


export default function DashboardMoney() {
  const [userLoged_id, setUserLogedId] = useState(null);
  const [balanceInfo, setBalanceInfo] = useState([
    {
    mes_balance: '',
    año_balance: '',
    url_balance: '',
    }
  ]);

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
    }
  }, [userLoged_id]);

  useEffect(() => {
    if (dataBalances) {
      setBalanceInfo(dataBalances);
    }
  }, [dataBalances]);


  //funcion para mostrar el ultimo balance cargado
  const last = balanceInfo.length - 1
  const urlBalance = balanceInfo[last].url_excel


  return (
    <Card className="w-full mx-auto border-none border-b-[1px]">
      <CardHeader className="px-0">
        <CardTitle className="text-3xl font-extrabold text-[#194567]">
          Balances Monetarios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading 
        ? (
          <div className="flex gap-6">
            <Skeleton className="w-[40%] h-5 bg-gray-200" />
            <Skeleton className="w-1/4 h-5 bg-gray-200" />
          </div>
        ) 
        : (
          <div className="flex items-center justify-start space-x-5">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <span className="text-xl font-bold">
                Ultimo balance: {balanceInfo[last].mes_balance},
                {' '} {balanceInfo[last].año_balance}
              </span>
            </div>
            <Button
              variant="outline"
              className="flex items-center space-x-2 text-lg"
            >
              <FileChartColumnIncreasingIcon className="h-5 w-5" />
              <a href={urlBalance} target="_blank" rel="noreferrer">
                Balance
              </a>
            </Button>
            <span className="text-sm text-gray-300"> Click para abrir </span>
          </div>
        )}

        <div className="flex justify-center mt-5">
          <Button className="h-[45px] px-7 text-md bg-[#003156] hover:bg-[#255a93] rounded-xl mt-3">
            <NavLink to="/dashboard/money"> VER TODOS </NavLink>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}