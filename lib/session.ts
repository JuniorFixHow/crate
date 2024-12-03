'use server'
import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers";
import { signOut } from 'firebase/auth';
import { auth } from './firebase/firebase';
import { redirect } from 'next/navigation';



const key =new TextEncoder().encode(process.env.SECRET);
const duration = 7 * 24*60*60*1000

export type SessionPayload = {
   userId:string,
   email:string,
   name:string,
   photo:string,
   emailVerified:boolean,
   isAdmin:boolean,
   role:'Admin'|'Coordinator'|'Volunteer'
   expires?:Date
}

export async function encrypt(payload:SessionPayload){
    return new SignJWT(JSON.parse(JSON.stringify(payload)))
        .setProtectedHeader({alg:'HS256'})
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(key)
}

export async function decrypt(session: string | undefined = ''){
    try {
        const {payload} = await jwtVerify(session, key, {
            algorithms:['HS256']
        })
        if(payload) return payload
        
    } catch (error) {
        console.log(error)
        console.log('Failed to verify session')
        return null
    }
}

export async function createSession(data:SessionPayload){
    const expires = new Date(Date.now() + duration);
    const session = await encrypt({...data, expires});
    const cookieStore = await cookies();
    cookieStore.set(
        'session',
        session,
        {
            httpOnly:true,
            secure:true,
            expires,
            sameSite:'lax',
            path:'/',
        }
    )
};

export async function updateSession() {
    const session = (await cookies()).get('session')?.value
    const payload = await decrypt(session)
   
    if (!session || !payload) {
      return null
    }
   
    const expires = new Date(Date.now() + duration)
   
    const cookieStore = await cookies()
    cookieStore.set('session', session, {
      httpOnly: true,
      secure: true,
      expires: expires,
      sameSite: 'lax',
      path: '/',
    })
}



export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete('session');
    await signOut(auth)
    redirect('/')
};


