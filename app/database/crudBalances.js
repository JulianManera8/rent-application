/* eslint-disable no-unused-vars */
import supabase from '../lib/supabase';

//FUNCION PARA INSERT ARCHIVO EN TABLA DE BALANCES
export async function insertBalance({balance_info}) {

    await Promise.all(
        balance_info.files.map(async (file) => {
          const filePath = `balance/user${balance_info.userId}/${Date.now()}_${file.name}`;
  
          try {
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from("balances")
              .upload(filePath, file);
  
            if (uploadError) {
              console.error(uploadError.message);
              throw new Error("Error uploading the file");
            }
  
          } catch (error) {
            alert("Error en la subida del archivo, intenta nuevamente o con otro archivo", error);
          }
        })
    );


    const {data, error} = await supabase
    .from('balances')
    .insert([
        {
            user_id: balance_info.userId,
            mes_balance: balance_info.mesBalance,
            año_balance: balance_info.añoBalance,
            url_excel: '',
        }
    ])
}




//FUNCION PARA GUARDAR EL ARCHIVO EN EL BUCKET DE BALANCES
