// middleware.js
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

/**
 * Protect routes by verifying the 'token' cookie.
 * If invalid / missing -> redirect to /login.
 */
export function middleware(req) {
  // in Next 13+ middleware, cookies are accessible via req.cookies.get()
  const token = req.cookies.get('token')?.value

  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = '/Login'
    return NextResponse.redirect(url)
  }

  try {
    // throws if invalid/expired
    jwt.verify(token, process.env.JWT_SECRET)
    return NextResponse.next()
  } catch (err) {
    // invalid or expired token
    const url = req.nextUrl.clone()
    url.pathname = '/Login'
    return NextResponse.redirect(url)
  }
}

// Apply middleware only to the paths you want to protect
export const config = {
  matcher: [
    "/",
    '/dashboard/:path*',
    '/account/:path*',
    '/protected/:path*'
    // modify these to match your protected routes
  ]
}
