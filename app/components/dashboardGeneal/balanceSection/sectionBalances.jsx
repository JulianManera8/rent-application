import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { useUser } from '../../../hooks/use-user'
import { getGroups } from "../groupSection/getGroupData";
import { getBalances } from "./getBalanceData";

import {
  FileChartColumnIcon,
  FileChartColumnIncreasingIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "../../ui/skeleton";

export default function SectionPropiedades() {
  const userLoged_id = useUser()
  const [loading, setLoading] = useState(true)
  const [balancesByGroup, setBalancesByGroup] = useState([])
  const [showSkeleton, setShowSkeleton] = useState(true)

  useEffect(() => {
    async function getData() {
      if (userLoged_id) {
        setLoading(true)
        const [dataGroups, dataBalances] = await Promise.all([
          getGroups(userLoged_id),
          getBalances(userLoged_id)
        ])
        divideBalances(dataGroups, dataBalances);
        setLoading(false)
      }
    }
    getData()
  }, [userLoged_id])

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowSkeleton(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [loading])

  function divideBalances(dataGroups, dataBalances) {
    if(dataGroups && dataBalances) {
      const groupsWithBalances = dataGroups.map(group => ({
        grupo: group,
        balance: dataBalances
          .filter(balance => balance.grupo_id === group.id)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 1)
      }))
      console.log(groupsWithBalances)
      setBalancesByGroup(groupsWithBalances)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-medium text-[#0c426bd3] mb-3">Balances</h1>

      <div className="flex flex-col md:flex-row gap-y-4 md:gap-x-10 max-h-full">
        <Card className="border-1 shadow-md shadow-black/15 border-[0.6px] border-t-[1px] w-full md:w-[410px] flex flex-col justify-evenly">
          <CardHeader className="flex flex-row items-center justify-between w-full space-y-0 py-3 mb-2 h-1/3">
            <CardTitle className="text-md md:text-lg font-medium text-left w-[80%]">
              Últimos Balances cargados por grupo
            </CardTitle>
            <FileChartColumnIcon className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            {loading || showSkeleton ? (
              Array(3).fill(0).map((_, i) => (
                <div className="flex items-center text-sm gap-x-3 w-full" key={i}>
                  <Skeleton className="w-3/5 h-4 bg-zinc-200"/>
                  <Skeleton className="w-4/5 h-4 bg-zinc-200"/>
                  <Skeleton className="w-[36%] h-4 bg-zinc-200"/>
                </div>
              ))
            ) : (
              balancesByGroup.map((el, i) => (
                <div className="flex items-center text-md font-bold gap-x-4 w-full flex-wrap" key={i}>
                  <span className="w-full font-normal underline mb-2 text-zinc-600">
                    Grupo: {el.grupo.grupo_name}
                  </span>
                  {el.balance.length > 0 ? (
                    <div className="flex flex-row justify-between ml-8 mx-5 w-full">
                      <div className="flex items-center sm:w-fit space-x-2">
                        <span className="text-md w-max font-medium text-right text-blue-400">
                          {el.balance[0].mes_balance}, {el.balance[0].año_balance}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        className="flex items-center space-x-2 text-md"
                      >
                        <FileChartColumnIncreasingIcon className="h-3 w-3" />
                        <a href={el.balance[0].url_excel} target="_blank" rel="noreferrer">
                          Balance
                        </a>
                      </Button>
                    </div>
                  ) : (<span className="ml-8 mx-5 font-medium my-1"> No hay balances</span>)}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

