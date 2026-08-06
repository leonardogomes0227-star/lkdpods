import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://svwflvetptzgxriboyjp.supabase.co'; // <--- A URL real que você copiou ali
const supabaseKey = 'sb_publishable_Irta09gMznifr9RgaQcFwQ_NV_IHUdH';

export const supabase = createClient(supabaseUrl, supabaseKey);
