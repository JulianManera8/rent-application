/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Label } from "../components/ui/label";
import supabase from "../lib/supabase";
import { useEffect, useState } from "react";
import useFetch from '../hooks/use-fetch'
import { getGrupos } from '../database/crudGrupos'



export default function HandleGrupo() {
    const [userLoged_id, setUserLoged_id] = useState(null)
    const [createGrupoInfo, setCreateGrupoInfo] = useState({
        userId: userLoged_id,
        nombreGrupo: ''
    })
    const [getGrupoInfo, setGetGrupoInfo] = useState([])
    const [grupoSelected, setGrupoSelected] = useState(null)

    useEffect(() => {
        async function getUser() {
            const {data, error} = await supabase.auth.getUser()

            if(error) return console.error(error)
            if(data) {
                setUserLoged_id(data.user.id)
                setCreateGrupoInfo({...createGrupoInfo, userId: data.user.id})
            }
        }   
        getUser()
    }, [])

    //FUNCION PARA CAPTAR LOS GRUPOS SI ES Q HAY
    const { loading, data: grupos, error: errorGrupos, fn: fnGetGrupos } = useFetch(getGrupos, {user_id: userLoged_id});

    useEffect(() => {
        if(userLoged_id) {
            fnGetGrupos(userLoged_id)
            if(errorGrupos) return console.error(errorGrupos)
        }
    }, [userLoged_id])

    useEffect(() => {
        if(grupos && grupos.length > 0) {
            // Mapea los grupos y actualiza el estado con todos los grupos
            const mappedGrupos = grupos.map(grupo => ({
                grupo_id: grupo.id,
                grupo_name: grupo.grupo_name, 
                user_id: grupo.user_id
            }));

            setGetGrupoInfo(mappedGrupos);
        }
    }, [grupos, userLoged_id]);


    return (
        <div className="min-w-full space-y-2">
            <Label htmlFor="mesBalance" className="font-bold text-md">Asignar grupo</Label>
            <Select onValueChange={(value) => setGrupoSelected(value)} className="w-full">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Elegir grupo" />
              </SelectTrigger>
              <SelectContent>
                {getGrupoInfo.map((grupo) => (
                  <SelectItem key={grupo.grupo_id} value={grupo.grupo_name}>{grupo.grupo_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>
    )
}