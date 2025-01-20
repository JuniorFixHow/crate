import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";

const publicRoutes = ['/', '/reset'];

export default async function middleware(req:NextRequest){
    const path = req.nextUrl.pathname;
    // const isProtectedRoute = protectedRoutes.some((item)=>item.startsWith(path));
    const isProtectedRoute = path.startsWith('/dashboard') || path.startsWith('/selfservice')
    const isPublicRoute = publicRoutes.includes(path);

    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie);

    if(isProtectedRoute && !session?.userId){
        return NextResponse.redirect(new URL('/', req.nextUrl))
    }

    else if(
        isPublicRoute && 
        session?.userId && 
        !session?.isAdmin &&
        !req.nextUrl.pathname.startsWith('/dashboard')
    ){
        return NextResponse.redirect(new URL('/selfservice', req.nextUrl))
    }
    else if(
        isProtectedRoute && 
        session?.userId && 
        session?.isAdmin &&
        req.nextUrl.pathname.startsWith('/selfservice')
    ){
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }
    else if(
        isPublicRoute && 
        session?.userId && 
        session?.isAdmin &&
        !req.nextUrl.pathname.startsWith('/dashboard')
    ){
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
  }