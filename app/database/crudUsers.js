/* eslint-disable no-unused-vars */
import supabase from "../lib/supabase";

export async function getAllUser() {
    const { data, error } = await supabase.auth.getAll();
}