/* eslint-disable no-unused-vars */
import supabase from '../lib/supabase';

//FUNCION PARA INSERT ARCHIVO EN TABLA DE BALANCES
export async function insertBalance({balanceInfo}) {

    await Promise.all(
      balanceInfo.files.map(async (file) => {
        const filePath = `balance/user${balanceInfo.userId}/${Date.now()}_${file.name}`;

        try {
          const { data: uploadData, error: uploadError } =
            await supabase.storage.from("balances").upload(filePath, file);

          if (uploadError) {
            console.error(uploadError.message);
            throw new Error("Error uploading the file");
          }

          return uploadData;
        } catch (error) {
          alert(
            "Error en la subida del archivo, intenta nuevamente o con otro archivo",
            error
          );
        }
      })
    );


    const {data, error} = await supabase
    .from('balances')
    .insert([
        {
            user_id: balanceInfo.userId,
            mes_balance: balanceInfo.mesBalance,
            año_balance: balanceInfo.añoBalance,
            url_excel: '',
        }
    ])
}




//FUNCION PARA GUARDAR EL ARCHIVO EN EL BUCKET DE BALANCES
