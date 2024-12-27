/* eslint-disable no-unused-vars */
import supabase from "../lib/supabase";

export async function getAllUser() {
  try {
    const {data, error} = await supabase
    .from("users_profiles")
    .select("*")
    
    if (error) throw new Error(error)
  
    return data
  } catch (error) {
    alert(error.message);
  }
}

// export async function getUserByDni(user_dni) {
//   try {
//     const {data, error} = await supabase
//     .from("users_profiles")
//     .select("*")
    
//     if (error) throw new Error(error)
  
//     return data
//   } catch (error) {
//     alert(error.message);
//   }
// }