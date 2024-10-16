import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function getSupabaseSession(request) {
    const cookies = request.headers.get("Cookie");
    const { data: { session } } = await supabase.auth.getSessionFromCookie(cookies);
    return session;
}

export default supabase