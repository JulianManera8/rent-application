/* eslint-disable react/prop-types */
import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Progress } from "../../ui/progress"
import { Building2Icon } from 'lucide-react'
import { Skeleton } from "../../ui/skeleton"
import { getDeptos, getGroups } from "./getGroupData"
import { cn } from "../../../lib/utils"

const calculateDistribution = (groups, departments) => {
  const deptosByGroup = groups.map(group => ({
    group: group.grupo_name,
    departments: departments.filter(dept => dept.grupo_id === group.id).length
  }))

  const totalDepartments = deptosByGroup.reduce((acc, group) => acc + group.departments, 0)

  return deptosByGroup.map(group => ({
    group: group.group,
    departments: group.departments,
    percentage: totalDepartments > 0 
      ? Number(((group.departments / totalDepartments) * 100).toFixed(0))
      : 0
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

function GroupDistributionRow({ group, totalDepartments }) {
  return (
    <div className="flex items-center text-sm gap-x-3 w-full">
      <span className="w-3/5 text-zinc-600 font-normal overflow-hidden whitespace-nowrap text-ellipsis">
        {group.group}
      </span>
      <Progress 
        className="w-4/5 text-blue-400" 
        value={group.percentage}
        colorProgress="#2798f5"
      />
      <span className={cn(
        "w-[36%] font-medium flex-col flex items-center text-xs",
        group.percentage > 0 ? "text-blue-400" : "text-zinc-400"
      )}>
        <p> {group.percentage} % </p>
        <p className="flex gap-x-2 items-center"> {group.departments}/{totalDepartments} Prop. </p>
      </span>
    </div>
  )
}

export default function PropertiesPerGroups({ userId }) {
  const [groupInfo, setGroupInfo] = useState([])
  const [deptosInfo, setDeptosInfo] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (userId) {
        setIsLoading(true)
        try {
          const [groups, departments] = await Promise.all([
            getGroups(userId),
            getDeptos(userId)
          ])
          setGroupInfo(groups || [])
          setDeptosInfo(departments || [])
        } catch (error) {
          console.error("Error fetching data:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchData()
  }, [userId])

  const distribution = useMemo(() => 
    calculateDistribution(groupInfo, deptosInfo),
    [groupInfo, deptosInfo]
  )

  const totalDepartments = useMemo(() => 
    distribution.reduce((acc, group) => acc + group.departments, 0),
    [distribution]
  )

  return (
    <Card className="border-[0.6px] border-t-[1px] shadow-md shadow-black/15 md:w-[400px] w-full min-h-[120px] flex flex-col justify-evenly">
      <CardHeader className="flex flex-row items-center justify-start w-full mt-3 space-y-0 pt-0 h-1/3">
        <CardTitle className="text-md md:text-lg font-medium text-left w-full">
          Distribucion de Propiedades por Grupo
        </CardTitle>
        <Building2Icon className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <LoadingSkeleton />
        ) : distribution.length > 0 ? (
          distribution.map((group, index) => (
            <GroupDistributionRow 
              key={index}
              group={group}
              totalDepartments={totalDepartments}
            />
          ))
        ) : (
          <span className="text-md text-zinc-600 font-normal mb-2">
            No hay grupos creados
          </span>
        )}
      </CardContent>
    </Card>
  )
}
