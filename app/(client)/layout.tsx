import { ClientNavigation } from '@/components/layout/client-navigation'
import { UserMenu } from '@/features/auth/components/user-menu'
import { NotificationBell } from '@/features/notifications/components/notification-bell'

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen max-w-[1600px] md:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden border-r border-border/70 bg-muted/10 md:block">
          <div className="sticky top-0 flex min-h-screen flex-col">
            <div className="border-b border-border/70 px-5 py-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Guira</div>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">Mesa del cliente</h2>
              <p className="mt-2 text-sm text-muted-foreground">Navegacion separada por accion: panel, deposito, envio, proveedores, transacciones y soporte.</p>
            </div>
            <div className="flex-1 p-4">
              <ClientNavigation />
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-20 border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="flex items-center justify-between gap-4 px-6 py-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Portal operativo</div>
                <h1 className="mt-1 text-xl font-semibold tracking-tight">Workspace del cliente</h1>
                <p className="mt-1 text-sm text-muted-foreground">Cada seccion separa una intencion operativa para evitar mezclar seguimiento, alta y configuracion.</p>
              </div>
              <div className="flex items-center gap-4">
                <NotificationBell />
                <UserMenu />
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 md:px-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

