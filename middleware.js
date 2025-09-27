// middleware.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // If no token and user is trying to access a protected page → redirect to /Login
  if (!token) {
    if (pathname !== "/Login") {
      const url = req.nextUrl.clone();
      url.pathname = "/Login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next(); // allow /Login without token
  }

  try {
    // verify token
    jwt.verify(token, process.env.JWT_SECRET);

    // If token is valid but user is on /Login → redirect to dashboard (or home)
    if (pathname === "/Login") {
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard"; // change if your main page is different
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (err) {
    // invalid or expired token → redirect to /Login
    const url = req.nextUrl.clone();
    url.pathname = "/Login";
    return NextResponse.redirect(url);
  }
}

// Apply middleware only to protected routes
export const config = {
  matcher: ["/djfef"],
};
