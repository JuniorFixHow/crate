import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth, db } from "./firebase";
import {  IUser } from "@/types/Types";
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { handleResponse } from "../misc";
import { enqueueSnackbar } from "notistack";
import admin from "./admin";
import { updateVendor } from "../actions/vendor.action";
import { IVendor } from "../database/models/vendor.model";

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
        
        await setDoc(doc(collection(db, 'Users'), id), {...data, uid:user.uid});
        const body: Partial<IVendor>={
            uid:user?.uid
        }
        await updateVendor(id, body);
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
                uid:user.uid,
                churchId:data.churchId!,
                emailVerified:user.emailVerified,
                isAdmin:data.isAdmin,
                name:user.displayName!,
                role:data.role,
                roles:data.roles,
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

export async function deleteUserById(userId:string){
    try {
        const res = await admin.auth().deleteUser(userId);
        console.log(res);
        console.log(`User with UID: ${userId} has been deleted.`);
    } catch (error) {
        console.log(error);
        enqueueSnackbar('Error occured deleting user', {variant:'error'});
    }
}

export async function deleteUserFromFirestore(userId:string){
    try {
        await admin.firestore().collection("users").doc(userId).delete();
        console.log(`User data deleted from Firestore.`);
    } catch (error) {
        console.error("Error deleting user from Firestore:", error);
        enqueueSnackbar("Error deleting user from Firestore:", {variant:'error'});
    }
};

export async function deleteUserCompletely(userId:string){
    try {
        const docRef = doc(db, 'users', userId);
        const data = await getDoc(docRef);
        if(data.exists()){
            const user = data.data() as IUser;

            await deleteUserById(user?.uid);
            await deleteUserFromFirestore(userId);
        }
    } catch (error) {
        console.log(error);
    }
};