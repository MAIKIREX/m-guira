import { createClient } from '@/lib/supabase/browser'
import type { Profile } from '@/types/profile'

export const ProfileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    console.log('ProfileService: getProfile starting for', userId)
    try {
      const supabase = createClient()
      
      const query = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      console.log('ProfileService: executing query with internal 5s timeout...')
      
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT_DB_QUERY')), 5000)
      )

      const { data, error, status, statusText } = await Promise.race([
        query,
        timeoutPromise
      ])
      
      console.log('ProfileService: query result received', { data: !!data, error, status, statusText })

      if (error) {
        console.error('ProfileService: getProfile query returned error', error)
        return null
      }
      
      return (data as Profile | null) ?? null
    } catch (e) {
      console.error('ProfileService: getProfile CRITICAL CATCH', e)
      return null 
    }
  },
}
