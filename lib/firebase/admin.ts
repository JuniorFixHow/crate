import admin, { ServiceAccount } from 'firebase-admin';

if(!admin.apps.length){
    const serviceAccount = JSON.parse(process.env.NEXT_PUBLIC_GOOGLE_ADMIN_CREDENTIALS as string) as ServiceAccount
    admin.initializeApp({
        credential:admin.credential.cert(serviceAccount)
    })
}

export default admin;