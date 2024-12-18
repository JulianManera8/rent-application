/* eslint-disable no-unused-vars */
import supabase from '../lib/supabase';

//FUNCION PARA CAPTAR LOS DEPTOS DE CADA USUARIO
export async function getGrupos({ user_id }) {
  const { data, error } = await supabase
    .from("grupos")
    .select("*")
    .eq("user_id", user_id);

  if (error) {

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
                  shared_with: createGrupoInfo.shared_with,
                },
            ])
            .select();

        if (error) {
            console.error("Error en la inserción:", error.message);
            throw new Error(error.message);
        }

        return data;  // Asegúrate de que `data` sea retornado correctamente

    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

//FUNCION PARA BORRAR GRUPO DE CADA USUARIO
export async function removeGrupo( grupoId ) {
    const { error } = await supabase
    .from("grupos")
    .delete()
    .eq("id", grupoId);
  
    if (error) {
      console.error(error);
      return error
    }

}


//FUNCION PARA UPDATE GRUPO NAME
export async function editGroupName({ id_NewName }) {
  try {
    const { data, error } = await supabase
      .from('grupos')
      .update({ grupo_name: id_NewName.newGroupName })
      .eq('id', id_NewName?.idGrupo)
      .select()

    if (error) {
        console.error("Error en la update:", error.message);
        throw new Error(error.message);
    }

    return data;  // Asegúrate de que `data` sea retornado correctamente

  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function editAccess( id_NewAccess ) {
  try {
    const { data, error } = await supabase
      .from('grupos')
      .update({ shared_with: id_NewAccess.arrayUsersId })
      .eq('id', id_NewAccess.grupoId)
      .select()

    if (error) {
        console.error("Error en la update:", error.message);
        throw new Error(error.message);
    }

    return data;  

  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function setRoleUser( id_NewAccess ) {
  try {
    const {data, error} = await supabase
    .from('roles-group-shared')
    .insert([
      {
        user_id: id_NewAccess.selectedUser,
        grupo_id: id_NewAccess.grupoId,
        role: id_NewAccess.roleUser
      }
    ])
    .select('*')

    if(data) console.log(data)

    if(error) throw new Error(error)
  } catch (error){
    console.alert(error)
  }
}