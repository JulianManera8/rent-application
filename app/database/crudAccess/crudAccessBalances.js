/* eslint-disable no-unused-vars */
import supabase from '../../lib/supabase';

export async function getAccessBalances( gruposShared_ids ) {
    let dataBalances;

    if(gruposShared_ids.length > 0) {
        await Promise.all(
            gruposShared_ids.map( async (grupo) => {
                try {               
                    const { data, error: errorBalance } = await supabase
                        .from("balances")
                        .select("*")
                        .eq('grupo_id', grupo.id);
          
                        if (errorBalance) {
                            console.error(errorBalance.message);
                            throw new Error("Error uploading the file");
                        }
                        
                       if(data) {
                        return dataBalances = data;
                       }
          
                  } catch (error) {
                    console.error(error.message);
                  }
                }
            )
        )
    }

  return dataBalances;
}

// export async function getAccessBalances(user_id) {
//   const { data, error } = await supabase
//     .from("balances")
//     .select("*")
//     .contains('shared_with', [user_id]);

//   if (error) {
//     console.error("Error fetching access balances:", error);
//     throw new Error("Failed to load balances");
//   }

//   return data;
// }