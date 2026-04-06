import { createClient } from '@supabase/supabase-js';
const c = createClient('https://bxtsttllyscfvawvhhas.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4dHN0dGxseXNjZnZhd3ZoaGFzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQzNzc1MCwiZXhwIjoyMDkwMDEzNzUwfQ.zitBZWh3kG4BTBT-KYuzg6T7DnAFMnr5NV3LPLORW7c');
const { data, error } = await c.from('comments').select('*').limit(1);
if (error) console.error(error);
else console.log(JSON.stringify(data));
process.exit();
