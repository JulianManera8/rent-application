/* eslint-disable no-unused-vars */
import supabase from '../lib/supabase';

export async function getDeptos({user_id}) {
    console.log(user_id);
    const { data, error } = await supabase
    .from('departamentos')
    .select('*')
    .eq("user_id", user_id);

    if(error) {
        console.error(error);
        throw new Error('Falla al cargar todos los deptos');
    }

    return data;
}