/* eslint-disable no-unused-vars */
import supabase from '../../lib/supabase';

export async function getAccessGrupos(user_id) {
  const { data, error } = await supabase
    .from("grupos")
    .select("*")
    .contains('shared_with', [user_id]);

  if (error) {
    console.error("Error fetching access grupos:", error);
    throw new Error("Failed to load grupos");
  }

  return data;
}
  