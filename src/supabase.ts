import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://igkdfgdfgdfgdfgdf.supabase.co';
const supabaseKey = 'sb_publishable_Irta09gMznifr9RgaQcFwQ_NV_IHUdH';

export const supabase = createClient(supabaseUrl, supabaseKey);
