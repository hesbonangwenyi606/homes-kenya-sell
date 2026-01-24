import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://ssqngdbkofolshzkudbr.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjJlMTExYzY1LWVmNmItNDU4MS04ZjE1LTA0YzY3YjJiNTc5MCJ9.eyJwcm9qZWN0SWQiOiJzc3FuZ2Ria29mb2xzaHprdWRiciIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY4NTcyMjA3LCJleHAiOjIwODM5MzIyMDcsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.mcfOlPqTaXRi0aLXZpuXMVB5sqcE76CvLw--kEIWMuo';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };