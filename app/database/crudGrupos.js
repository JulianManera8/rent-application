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
    console.error("Error:", error.message);
    return null;
  }
}

export async function getRoleUser( {user_id} ) {
  try {
    const {data, error} = await supabase
    .from('roles_group_shared')
    .select('*')
    .eq("user_id", user_id);


    if(error) throw new Error(error.message)
    return data
  } catch (error){
    alert(error)
  }
}

export async function getRolesPerGroup(gruposId) {
  let rolesPerGroup = [];

  await Promise.all(
    gruposId.map(async (id) => {
      const { data, error } = await supabase
        .from('roles_group_shared')
        .select('*')
        .eq('grupo_id', id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data) {
        rolesPerGroup.push(...data); // Spread to add each item to the array
      }
    })
  );
  
  return rolesPerGroup;
}

export async function setRoleUser( id_NewAccess ) {
  try {
    const {data, error} = await supabase
    .from('roles_group_shared')
    .insert([
      {
        user_id: id_NewAccess.userLoged_id,
        user_id_access: id_NewAccess.selectedUser,
        grupo_id: id_NewAccess.grupoId,
        role: id_NewAccess.roleUser
      }
    ])
    .select()

    if(error) throw new Error(error.message)
    return data
  } catch (error){
    alert(error)
  }
}

export async function editRoleUser( {updateRole} ) {

  try {
    const { data, error } = await supabase
    .from('roles_group_shared')
    .update({ role: updateRole.roleUser })
    .match({
      user_id_access: updateRole.selectedUser,
      grupo_id: updateRole.grupoId,
    })
    .select();

    if (error) {
        console.error("Error en la update:", error.message);
        throw new Error(error.message);
    }

    return data;  

  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

export async function removeRoleUser(grupo_id, user_id_access) {
  try {
    const { error } = await supabase
      .from('roles_group_shared')
      .delete()
      .match({ grupo_id, user_id_access: user_id_access }); // Busca por ambas columnas

    if (error) throw new Error(error.message); // Incluye el mensaje de error

  } catch (error) {
    alert(`Error al eliminar el rol: ${error.message}`);
  }
}