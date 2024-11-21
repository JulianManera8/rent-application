/* eslint-disable no-unused-vars */
import supabase from '../../lib/supabase';

export async function getAccessDeptos(user_id) {
  const { data, error } = await supabase
    .from("departamentos")
    .select("*")
    .contains('shared_with', [user_id]);

  if (error) {
    console.error("Error fetching access deptos:", error);
    throw new Error("Failed to load deptos");
  }

  return data;
}