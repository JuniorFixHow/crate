import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth, db } from "./firebase";
import {  IUser } from "@/types/Types";
import { collection, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { handleResponse } from "../misc";

export async function signupUser(email:string, password:string, data:IUser ){
    try {
        const {name, id} = data;
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await updateProfile(user, {
            displayName:name,
            photoURL:'https://cdn-icons-png.flaticon.com/512/9187/9187604.png'
        });
        await sendEmailVerification(user);
        
        await setDoc(doc(collection(db, 'Users'), id), data);
    } catch (error) {
        console.log(error);
    }
}

export async function signinUser(email:string, password:string){
    try {
        // console.log('Result: ', {email, password})
        const res = await signInWithEmailAndPassword(auth, email, password);
        const user = res.user;
        if(!user.emailVerified){
            await signOut(auth);
            return handleResponse('Your email is not verified yet. Please check your mail.', true, {}, 403);
        }else{
            const q = query(collection(db, "Users"), where("email", "==", email));

            const querySnapshot = await getDocs(q);
            

            const data = querySnapshot.docs[0].data()
            const id = querySnapshot.docs[0].id;
            const userData:IUser = {
                id,
                photo:data.photo!,
                email:user.email!,
                country:data.country!,
                churchId:data.churchId!,
                emailVerified:user.emailVerified,
                isAdmin:data.isAdmin,
                name:user.displayName!,
                role:data.role
            }
            if(!data.emailVerified){
                await updateDoc(doc(db, "Users", id), {emailVerified:true})
            }
            // console.log("Data: ", data)
            return handleResponse('Logged in successfully', false, userData, 201)
        }
    } catch (error) {
        console.log('New Error: ',error);
        return handleResponse('Invalid credentials', true)
    }
}