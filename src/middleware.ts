import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => {
          const cookies = req.cookies.getAll()
          return cookies.map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          }))
        },
        setAll: (cookies: { name: string; value: string }[]) => {
          cookies.forEach((cookie) => {
            res.cookies.set({
              name: cookie.name,
              value: cookie.value,
            })
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Auth routes - redirect to dashboard if already authenticated
  if (req.nextUrl.pathname.startsWith('/(auth)') && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Protected routes - redirect to login if not authenticated
  if (req.nextUrl.pathname.startsWith('/(dashboard)') && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}