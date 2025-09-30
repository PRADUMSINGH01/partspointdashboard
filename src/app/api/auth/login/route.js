// app/api/auth/login/route.js  (or wherever your POST handler is)
import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/firebase";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    // Query users collection for a matching email
    const usersRef = adminDb.collection("Users");
    const q = usersRef.where("email", "==", email).limit(1);
    const snapshot = await q.get();

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();
    const storedPassword = user.password || "";
    console.log(storedPassword, "storedPassword");

    let passwordMatches = false;
    if (
      storedPassword.startsWith("$2a$") ||
      storedPassword.startsWith("$2b$") ||
      storedPassword.startsWith("$2y$")
    ) {
      // bcrypt hash
      passwordMatches = await verifyPassword(password, storedPassword);
      console.log(passwordMatches, "passwordMatches--");
    } else {
      // plain-text fallback (not recommended for production)
      passwordMatches = storedPassword === password;
    }

    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create JWT (7 days)
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not set in env!");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    const payload = {
      uid: userDoc.id,
      email: user.email,
      // add any other safe public claims you want
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie (HttpOnly, Secure in production)
    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    // Return cookie + json
    return NextResponse.json(
      { message: "Login successful" },
      {
        status: 200,
        headers: {
          "Set-Cookie": cookie,
        },
      }
    );
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
