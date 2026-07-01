import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ugmihyhbrwnzaibzxmag.supabase.co';
const SUPABASE_KEY = 'sb_publishable_FWeR2ggJUzE9uhpxp0XT_Q_SKgIe29S';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);