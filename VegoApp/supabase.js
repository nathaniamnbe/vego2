// supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gfqsttzrjphlivtcepdw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmcXN0dHpyanBobGl2dGNlcGR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzOTE5NzEsImV4cCI6MjA2NDk2Nzk3MX0.7fJh3W6YDEL-tct2KnT9REGp2EgOVb0PHZSP4V7r8X8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
