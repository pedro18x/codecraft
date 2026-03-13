import type { Metadata } from 'next'
import { jakarta, jetbrains } from '@/lib/fonts'
import { QueryProvider } from '@/components/providers/query-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ToastProvider } from '@/components/ui/toast-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'CodeCraft',
  description: 'Coding interview preparation platform',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrains.variable}`}>
      <body className="antialiased">
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider>
              <ToastProvider>{children}</ToastProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
