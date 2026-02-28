const SUPABASE_URL = "https://crqxusxrryrvmrwwusqd.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycXh1c3hycnlydm1yd3d1c3FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMDA5MzcsImV4cCI6MjA4Nzg3NjkzN30.J5TVh2uSVU1kK3hJ8BWA-B-CCoUMzHzJNHxGc10Yyv0";

export const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
