/* eslint-disable react/prop-types */
import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Button } from "../../ui/button"
import { useUser } from '../../../hooks/use-user'
import { getGroups } from "../groupSection/getGroupData"
import { getBalances } from "./getBalanceData"
import { FileLineChartIcon as FileChartColumnIcon, FileLineChartIcon as FileChartColumnIncreasingIcon } from 'lucide-react'
import { Skeleton } from "../../ui/skeleton"

const calculateBalancesByGroup = (groups, balances) => {
  if (!groups || !balances) return []

  return groups.map(group => ({
    grupo: group,
    balance: balances
      .filter(balance => balance.grupo_id === group.id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 1)
  }))
}

function LoadingSkeleton() {
  return (
    <>
      {Array(3).fill(0).map((_, i) => (
        <div className="flex items-center text-sm gap-x-3 w-full" key={i}>
          <Skeleton className="w-3/5 h-4 bg-zinc-200"/>
          <Skeleton className="w-4/5 h-4 bg-zinc-200"/>
          <Skeleton className="w-[36%] h-4 bg-zinc-200"/>
        </div>
      ))}
    </>
  )
}

function GroupBalanceRow({ groupBalance }) {
  return (
    <div className="flex items-center text-md font-bold gap-x-4 w-full flex-wrap">
      <span className="w-full font-normal underline mb-2 text-zinc-600">
        Grupo: {groupBalance.grupo.grupo_name}
      </span>
      {groupBalance.balance.length > 0 ? (
        <div className="flex flex-row justify-between md:ml-8 ml-3 mx-5 w-full">
          <div className="flex items-center sm:w-fit space-x-2">
            <span className="text-md w-max font-medium text-right text-blue-400">
              {groupBalance.balance[0].mes_balance}, {groupBalance.balance[0].año_balance}
            </span>
          </div>
          <Button
            variant="outline"
            className="flex items-center space-x-2 text-md"
          >
            <FileChartColumnIncreasingIcon className="h-3 w-3" />
            <a href={groupBalance.balance[0].url_excel} target="_blank" rel="noreferrer">
              Balance
            </a>
          </Button>
        </div>
      ) : (
        <span className="ml-8 mx-5 font-medium my-1"> No hay balances</span>
      )}
    </div>
  )
}

export default function SectionPropiedades() {
  const userLoged_id = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [groups, setGroups] = useState([])
  const [balances, setBalances] = useState([])

  useEffect(() => {
    async function fetchData() {
      if (userLoged_id) {
        setIsLoading(true)
        try {
          const [dataGroups, dataBalances] = await Promise.all([
            getGroups(userLoged_id),
            getBalances(userLoged_id)
          ])
          setGroups(dataGroups || [])
          setBalances(dataBalances || [])
        } catch (error) {
          console.error("Error fetching data:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchData()
  }, [userLoged_id])

  const balancesByGroup = useMemo(() => 
    calculateBalancesByGroup(groups, balances),
    [groups, balances]
  )

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
            {isLoading ? (
              <LoadingSkeleton />
            ) : balancesByGroup.length > 0 ? (
              balancesByGroup.map((groupBalance, index) => (
                <GroupBalanceRow key={index} groupBalance={groupBalance} />
              ))
            ) : (
              <span className="text-md text-zinc-600 font-normal mb-2">No hay grupos</span>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

