'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/browser'
import { useAuthStore } from '@/stores/auth-store'
import { useProfileStore } from '@/stores/profile-store'
import { ProfileService } from '@/services/profile.service'
import type { Profile } from '@/types/profile'
import type { Session, AuthChangeEvent } from '@supabase/supabase-js'

const PUBLIC_PATHS = ['/login', '/registro', '/recuperar']
const CLIENT_PATHS = ['/panel', '/depositar', '/enviar', '/proveedores', '/transacciones', '/configuracion', '/pagos', '/actividad', '/soporte', '/onboarding']
const STAFF_PATHS = ['/admin', '/auditoria']
const PROFILE_RETRY_DELAYS_MS = [0, 400, 1200, 2400]

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const bootstrappedRef = useRef(false)

  const { setSession, setUser } = useAuthStore()
  const { profile: storedProfile, setProfile } = useProfileStore()
  const supabase = useMemo(() => createClient(), [])
  const publicPath = isPublicPath(pathname)

  // Usamos refs para evitar loops en los efectos
  const storedProfileRef = useRef(storedProfile)
  useEffect(() => { storedProfileRef.current = storedProfile }, [storedProfile])

  // 1. Efecto para inicializar Auth (solo al montar o si cambia el pathname radicalmente)
  useEffect(() => {
    let mounted = true

    async function checkAuth() {
      // No reseteamos loading si ya estamos en una ruta privada y tenemos perfil
      // Solo mostramos cargando si es el bootstrap inicial o si no tenemos sesión
      if (!bootstrappedRef.current) {
        setLoading(true)
      }

      try {
        console.log('AuthGuard: checking auth for', pathname)
        const { data: { session } } = await supabase.auth.getSession()

        if (!mounted) return

        if (!session) {
          setSession(null)
          setUser(null)
          setProfile(null)
          if (!publicPath) {
            router.push('/login')
          }
          setLoading(false)
          bootstrappedRef.current = true
          return
        }

        setSession(session)
        setUser(session.user)

        // Si ya tenemos el perfil en store y coincide con el usuario, evitamos fetch
        if (storedProfileRef.current && storedProfileRef.current.id === session.user.id) {
          await handleRedirect(storedProfileRef.current)
        } else {
          const profile = await getProfileWithRetry(session.user.id)
          if (mounted) {
            if (profile) {
              setProfile(profile)
              await handleRedirect(profile)
            } else {
              // Si no hay perfil, forzamos logout
              await supabase.auth.signOut()
              router.push('/login')
            }
          }
        }
      } catch (error) {
        console.error('AuthGuard: init error', error)
      } finally {
        if (mounted) {
          setLoading(false)
          bootstrappedRef.current = true
        }
      }
    }

    async function handleRedirect(profile: Profile) {
      const dest = await resolveRedirect({
        pathname,
        profile,
        onArchived: async () => {
          await supabase.auth.signOut()
          setSession(null)
          setUser(null)
          setProfile(null)
        }
      })
      if (dest && dest !== pathname) {
        router.push(dest)
      }
    }

    checkAuth()

    return () => { mounted = false }
  }, [pathname, publicPath, supabase, router, setProfile, setSession, setUser])

  // 2. Efecto para escuchar cambios de auth (solo una vez al montar)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      console.log('AuthGuard: onAuthStateChange', event)
      if (event === 'SIGNED_OUT') {
        setSession(null)
        setUser(null)
        setProfile(null)
        router.push('/login')
      } else if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        setSession(session)
        setUser(session.user)
        // El efecto de path se encargará de cargar el perfil si es necesario
      }
    })
    return () => subscription.unsubscribe()
  }, [supabase, router, setProfile, setSession, setUser])

  if (loading && !publicPath) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <div className="size-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-sm font-medium animate-pulse">Cargando aplicación...</p>
      </div>
    )
  }

  return <>{children}</>
}

async function getProfileWithRetry(userId: string) {
  let lastError: unknown = null

  for (let i = 0; i < PROFILE_RETRY_DELAYS_MS.length; i++) {
    const delayMs = PROFILE_RETRY_DELAYS_MS[i]
    if (delayMs > 0) {
      console.log(`AuthGuard: retry ${i} in ${delayMs}ms`)
      await sleep(delayMs)
    }

    try {
      console.log(`AuthGuard: getProfile attempt ${i}`)
      const profile = await ProfileService.getProfile(userId)
      if (profile) {
        console.log('AuthGuard: profile found on attempt', i)
        return profile
      }
      console.log(`AuthGuard: profile not found on attempt ${i}`)
    } catch (error) {
      console.error(`AuthGuard: error on attempt ${i}`, error)
      lastError = error
    }
  }

  if (lastError) {
    throw lastError
  }

  return null
}

function isPublicPath(pathname: string) {
  if (pathname === '/') return true
  return PUBLIC_PATHS.some((publicPath) => pathname === publicPath || pathname.startsWith(`${publicPath}/`))
}

function isClientPath(pathname: string) {
  return CLIENT_PATHS.some((clientPath) => pathname === clientPath || pathname.startsWith(`${clientPath}/`))
}

function isStaffPath(pathname: string) {
  return STAFF_PATHS.some((staffPath) => pathname === staffPath || pathname.startsWith(`${staffPath}/`))
}

async function resolveRedirect({
  pathname,
  profile,
  onArchived,
}: {
  pathname: string
  profile: Profile
  onArchived: () => Promise<void>
}) {
  if (profile.is_archived) {
    await onArchived()
    return '/login?archived=true'
  }

  const isStaffAdmin = profile.role === 'staff' || profile.role === 'admin'
  const isClient = profile.role === 'client'
  const isVerifiedClient = isClient && profile.onboarding_status === 'verified'

  if (isPublicPath(pathname)) {
    if (isStaffAdmin) return '/admin'
    if (isVerifiedClient) return '/panel'
    if (isClient && pathname !== '/') return '/onboarding'
  }

  if (pathname === '/onboarding') {
    if (isStaffAdmin) return '/admin'
    if (isVerifiedClient) return '/panel'
    return null
  }

  if (isStaffPath(pathname)) {
    return isStaffAdmin ? null : isVerifiedClient ? '/panel' : '/onboarding'
  }

  if (isClientPath(pathname)) {
    if (!isClient) return '/admin'
    if (!isVerifiedClient) return '/onboarding'
  }

  return null
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
