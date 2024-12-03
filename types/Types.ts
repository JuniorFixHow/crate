import { FieldValue } from "firebase/firestore"
import mongoose from "mongoose"
import { Dispatch, ReactNode, SetStateAction } from "react"

export type NavigationProps = {
   title:string,
   isAdmin:boolean,
   children?:{
      text:string,
      image:ReactNode,
      path:string,
   }[],
   link?:string,
   icon:ReactNode,
}

export type MemberProps = {
   id:string,
   photo:string,
   email:string,
   name:string,
   ageRange:string,
   church:string,
   registerType:'Individual'|'Group'|'Family',
   registeredBy:string,
   dateOfReg:string,
   gender:'Male'|'Female',
   country:string,
   groupId?:string,
   status:'Member'|'Non-member',
}
// add phone, dietary info, regis. note, marital status, voice
// objects
// =church
// =registeredBy

export type BooleanStateProp = {
   value:boolean,
   setValue: Dispatch<SetStateAction<boolean>>
}

export type StringStateProp = {
   text:string,
   setText: Dispatch<SetStateAction<string>>
}

export type DateStateProp = {
   date:Date,
   setDate: Dispatch<SetStateAction<Date>>
}

export type GroupProps = {
   id:string,
   name:string,
   groupNumber:string,
   type:'Family'|'Group'|'Couple',
   eventId:string /* this will be ab object later*/
   members:string[],
   checkInStatus:string, /* This is going to be a fraction of the total members. For instance, 2/5 Ahecked in, All checked in */
   room:string, /* This is going to be an object of a room */
}

export type ErrorProps = {
   message:string,
   error:boolean,
   payload?:object,
   code?:number
} | null

export type EventProps = {
   id:string,
   name:string,
   location:string,
   from: string,
   to:string,
   type:'Camp Meeting'|'Convension'|'CYP',
   description:string,
   adultPrice:number,
   childPrice:number,
   createdBy:string,
   sessions:number
}
//Created by will be a user object from Mongoose Database

export type EventRegProps = {
   id:string,
   memberId:string, /*this will be an object later*/
   regType: 'Individual'|'Group'|'Family'|'Couple',
   status:'Pending'|'Checked-in',
   badgeIssued:'Yes'|'No',
   groupId?:string /*this will be an object later*/
   roomId?:string /*this will be an object later*/
   eventId?:string /*this will be an object later*/
}

export type RoomProps = {
   id:string,
   venue:string,
   floor:number,
   number:number,
   nob:number, /* Number of beds */
   roomType:'Standard'|'Deluxe'|'Junior Suite',
   bedType: 'King size'|'Queen size'|'Standard',
   features?:string,
   eventId:string
}

export type QRProps = {
   member:MemberProps,
   event?:EventProps,
   group?:GroupProps
   room?:RoomProps
}

export type SessionProps = {
   id:string,
   name:string,
   venue:string,
   from:string,
   to:string,
   startTime:string,
   endTime:string,
   time:'Morning'|'Afternoon'|'Evening'|'Dawn',
   status:'Upcoming'|'Ongoing'|'Completed',
   eventId:string, /*This will take event object later*/
   createdBy:string, /*This will take user object later*/
}

export type AttendanceProps = {
   id:string,
   member:string, /* the member name will later take member object from the db. For now let's just use the member name*/
   late:'Yes'|'No',
   time:string, /*the time the attendance was take*/
   sessionId:string/* this will also take session object later. Now we're using the Id */
}

export type ZoneProps = {
   id:string,
   name:string,
   country:string,
   state:string,
   registrants:number,
   groups:number
   churches:number,
   coordinators:number,
   volunteers:number,
}

export type ChurchProps = {
   id:string,
   name:string,
   country:string,
   state:string,
   pastor:string,
   registrants:number,
   youth:number,
   groups:number
   zone:string, /**This will later be an object of zone */
   coordinators:number,
   volunteers:number,
}

export type VendorProps={
   id:string,
   name:string,
   image:string, /*photo urls */
   email:string,
   country?:string, /*add this later*/
   phone:string,
   church:string,
   role:'Admin'|'Coordinator'|'Volunteer',
   gender:'Male'|'Female',
   registrants:number /* Number of members they've registered so far */
}


export interface IUser {
   id:string,
   email:string,
   name:string,
   photo:string,
   emailVerified:boolean,
   isAdmin:boolean,
   role:'Admin'|'Coordinator'|'Volunteer'
   createdAt?:FieldValue
}


export type MaybePopulated<T, K extends keyof T> = Omit<T, K> & {
   [P in K]: T[P] | (T[P] extends mongoose.Types.ObjectId ? any : never);
 };