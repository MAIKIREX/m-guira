import { createClient } from '@/lib/supabase/browser'
import type { Profile } from '@/types/profile'

export const ProfileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    console.log('ProfileService: getProfile starting for', userId)
    try {
      const supabase = createClient()
      
      const queryPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout al cargar el perfil')), 8000)
      )

      console.log('ProfileService: executing query with timeout...')
      const result = await Promise.race([queryPromise, timeoutPromise]) as any
      const { data, error } = result

      console.log('ProfileService: query result received', { data: !!data, error: !!error })

      if (error) {
        console.error('ProfileService: error in query', error)
        throw new Error(error.message || 'No se pudo cargar el perfil.')
      }

      return (data as Profile | null) ?? null
    } catch (e) {
      console.error('ProfileService: getProfile error', e)
      return null 
    }
  },
}
