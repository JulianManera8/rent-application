import {Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Boxes } from 'lucide-react'
import { getGroups } from "./getGroupData"
import { useEffect, useState } from "react"

export default function GroupQuantity(userLoged_id) {
    const [groupInfo, setGroupInfo] = useState([])
    const [lastCreated, setLastCreated] = useState(null)

    useEffect(() => {
        async function getData() {
            if(userLoged_id.userId) {
                const data = await getGroups(userLoged_id.userId);
                data && setGroupInfo(data)
                data && setLastCreated( new Date( data[data.length - 1]?.created_at).toLocaleDateString() )
            }
        }
        getData();
    }, [userLoged_id])


    return (
        <Card className="border-1 shadow-md shadow-black/15 border-[0.6px] border-t-[1px] min-h-[100px] h-full flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-start w-full space-y-0 py-2">
                <CardTitle className="text-lg font-medium text-left w-full">Grupos Creados </CardTitle>
                <Boxes className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col justify-between">
                {groupInfo.length === 0 
                    ? <span className="text-lg text-zinc-600 font-normal mb-2"> No hay grupos </span> 
                    : <span className="text-2xl text-zinc-600 font-semibold mb-2"> {groupInfo.length} </span>}
                
                {lastCreated ? <span className="text-sm text-zinc-400"> Ultimo creado el: {lastCreated } </span> : ''}
            </CardContent>
        </Card>
    )
}