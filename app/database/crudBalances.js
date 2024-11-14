/* eslint-disable no-unused-vars */
import supabase from "../lib/supabase";

//FUNCION PARA INSERT ARCHIVO EN TABLA DE BALANCES
export async function insertBalance({ balanceInfo }) {
  const filePath = `balances/user${balanceInfo.user_id}/${Date.now()}`;
  const url = `https://fxvodakyxhuvnopvgvde.supabase.co/storage/v1/object/public/balances/${filePath}`;

  try {
    
    // Insertar registro en la base de datos
    const { data, error } = await supabase
      .from("balances")
      .insert([
        {
          user_id: balanceInfo.user_id,
          grupo_id: balanceInfo.grupo_id,
          mes_balance: balanceInfo.mes_balance,
          año_balance: balanceInfo.año_balance,
          url_excel: url,
        },
      ])
      .select('*')

    if (error) {
      alert("Error en la inserción:", error.message);
      throw new Error(error.message);
    }

    
    if(data) {
      // Cargar el archivo en el bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("balances")
        .upload(filePath, balanceInfo.file);
  
      if (uploadError) {
        alert("Error al subir archivo:", uploadError.message);
        throw new Error("Error uploading the file");
      }
    }

    return data;

  } catch (error) {
    console.error("Error:", error);
    alert("Error en la subida del archivo o inserción, intenta nuevamente.");
    return null;
  }
}


//FUNCION PARA CAPTAR LOS BALANCES QUE TENGA EL USUARIO
export async function getBalances({userId}) {

  try {
    const {data, error} = await supabase
    .from("balances")
    .select("*")
    .eq("user_id", userId)

    
    if (error) throw new Error(error)

    return data
  } catch (error) {
    alert(error.message);
  }
}

//FUNCION PARA BORRAR UN BALANCE
export async function removeBalance( infoBalance ) {

  try {
    const { error } = await supabase
      .from("balances")
      .delete()
      .eq("id", infoBalance.id);

    if (error) {
      console.error(error);
      return error
    }

    // 2. Eliminar el archivo del bucket de Supabase
    const { error: storageError } = await supabase.storage
      .from("balances")
      .remove([infoBalance.path]); 

    if (storageError) {
      console.error("Error al eliminar el archivo del bucket:", storageError.message);
      throw new Error("Error deleting the file from storage");
    }

    return true;

  } catch (error) {
    console.error(error.message);
  }
  
}




