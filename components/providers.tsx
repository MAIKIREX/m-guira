'use client'

import * as React from 'react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { AuthGuard } from '@/components/shared/auth-guard'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <AuthGuard>
        {children}
      </AuthGuard>
      <Toaster />
    </ThemeProvider>
  )
}
