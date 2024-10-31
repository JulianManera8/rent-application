/* eslint-disable no-unused-vars */
import supabase from '../lib/supabase';

//FUNCION PARA CAPTAR LOS DEPTOS DE CADA USUARIO
export async function getGrupos({ user_id }) {
  const { data, error } = await supabase
    .from("grupos")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    console.error(error);
    throw new Error("Falla al cargar todos los grupos");
  }

  return data;
}

//FUNCION PARA CREAR GRUPOS POR USUARIO
export async function insertGrupo({ createGrupoInfo }) {
    try {
        const { data, error } = await supabase
            .from("grupos")
            .insert([
                {
                    user_id: createGrupoInfo.userId,
                    grupo_name: createGrupoInfo.nombreGrupo,
                },
            ])
            .select();

        if (error) {
            console.error("Error en la inserción:", error.message);
            throw new Error(error.message);
        }

        console.log("Grupo creado:", data);
        return data;  // Asegúrate de que `data` sea retornado correctamente

    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

//FUNCION PARA BORRAR GRUPO DE CADA USUARIO
export async function removeDepto({ grupoId }) {
    const { error } = await supabase
    .from("grupos")
    .delete()
    .eq("id", grupoId);
  
    if (error) {
      console.error(error);
      throw new Error("Unable to delete grupo");
    }
}