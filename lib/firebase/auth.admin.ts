'use server'
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import admin from "./admin";
import { db } from "./firebase";
import { IUser } from "@/types/Types";
import { getVendor } from "../actions/vendor.action";
import { deleteSession } from "../session";

export async function deleteUserById(userId:string){
    try {
        const res = await admin.auth().deleteUser(userId);
        console.log(res);
        console.log(`User with UID: ${userId} has been deleted.`);
    } catch (error) {
        console.log(error);
        // enqueueSnackbar('Error occured deleting user', {variant:'error'});
    }
}

export async function deleteUserFromFirestore(userId:string){
    try {
        await admin.firestore().collection("users").doc(userId).delete();
        await deleteDoc(doc(db, 'Users', userId));
        console.log(`User data deleted from Firestore.`);
    } catch (error) {
        console.error("Error deleting user from Firestore:", error);
        // enqueueSnackbar("Error deleting user from Firestore:", {variant:'error'});
    }
};

export async function deleteUserCompletely(userId:string){
    try {
        const docRef = doc(db, 'Users', userId);
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


export async function confirmUserData(userId:string){
    try {
        const docRef = doc(db, 'Users', userId);
        const data = await getDoc(docRef);
        const user = await getVendor(userId);
        // console.log(data.data());
        if(!user || !data.exists()){
            await deleteSession();
        }
    } catch (error) {
        console.log(error);
    }
}