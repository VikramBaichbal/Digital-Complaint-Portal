const SUPABASE_URL = 'https://izogslmudacovwxqavlc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ugyz_JqfLjWorhD-PbGszQ_OR5z07eF'; // your publishable key

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.supabaseClient = supabaseClient;