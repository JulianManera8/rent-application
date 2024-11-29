/* eslint-disable no-unused-vars */
import supabase from '../../../lib/supabase';

export async function getGroups(userId) { 
    try {
        const {data, error} = await supabase
        .from('grupos')
        .select('*')
        .eq('user_id', userId)
        
        if(error) throw error

        return data
    } catch (error) {
        console.error(error)
    }
}


export async function getDeptos(userId) {
    //tengo que acceder a los deptos de cada grupo
    try {
        const {data, error} = await supabase
        .from('departamentos')
        .select('*')
        .eq('user_id', userId)

        if(error) throw error
        return data
    } catch (error) {
        console.error(error)
    }
}

