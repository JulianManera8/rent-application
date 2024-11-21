/* eslint-disable no-unused-vars */
import supabase from '../../lib/supabase';

export async function getAccessBalances(gruposShared_ids) {
  if (gruposShared_ids.length === 0) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("balances")
      .select("*")
      .in('grupo_id', gruposShared_ids.map(grupo => grupo.id));

    if (error) {
      console.error(error.message);
      throw new Error("Error fetching balances");
    }

    return data || [];
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

