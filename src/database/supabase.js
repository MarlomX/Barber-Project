import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabaseUrl = 'https://kjzzttqijgzlieeioxuy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqenp0dHFpamd6bGllZWlveHV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NzgwODIsImV4cCI6MjA2NTA1NDA4Mn0.-7b7vQjEv6d_F_0cLNhZQssFoSzb7gb05Jz-5gXGBss'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})