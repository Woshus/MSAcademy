import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'


const SUPABASE_URL = "https://sgkebcoecnqprhhmbnxa.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNna2ViY29lY25xcHJoaG1ibnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MzcxMDYsImV4cCI6MjA3MjQxMzEwNn0.PR2fBvWahEJ7p2Vc-SC6qbCBo-M8oKcmWB0vqwtQH4g";
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);




