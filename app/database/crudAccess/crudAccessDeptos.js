/* eslint-disable no-unused-vars */
import supabase from '../../lib/supabase';


export async function getAccessDeptos(gruposShared_ids) {
  if (gruposShared_ids.length === 0) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("departamentos")
      .select("*")
      .in('grupo_id', gruposShared_ids.map(grupo => grupo.id));

    if (error) {
      console.error(error.message);
      throw new Error("Error fetching departamentos");
    }

    return data || [];
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}
