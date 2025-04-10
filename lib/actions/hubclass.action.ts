'use server'

import Event from "../database/models/event.model";
import Hubclass, { IHubclass } from "../database/models/hubclass.model";
import { connectDB } from "../database/mongoose";
import { handleResponse } from "../misc";
import '../database/models/member.model';
import Registration, { IRegistration } from "../database/models/registration.model";
import { IMember } from "../database/models/member.model";
import Relationship, { IRelationship } from "../database/models/relationship.model";

export async function createHubclass(hub:Partial<IHubclass>){
    try {
        await connectDB();
        await Hubclass.create(hub);
        return handleResponse('Class created successfully', false, {}, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured creating the class', true, {}, 500);
    }
}


export async function updateHubclass(hub:Partial<IHubclass>){
    try {
        await connectDB();
        const {_id} = hub;
        await Hubclass.findByIdAndUpdate(_id, hub, {new:true});
        return handleResponse('Class updated successfully', false, {}, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured upating the class', true, {}, 500);
    }
}

export async function getHubclass(id:string){
    try {
        await connectDB();
        const hub = await Hubclass.findById(id)
        .populate({
            path:'children',
            populate:{
                path:'church',
                model:'Church'
            }
        })
        .populate('leaders')
        .populate('eventId')
        .lean();
        return JSON.parse(JSON.stringify(hub));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching the class', true, {}, 500);
    }
}

export async function addMemberToHubclass(id:string, children:string[]){
    try {
        await connectDB();
        const hub = await Hubclass.findByIdAndUpdate(id,{
            $push:{children:{$each:children}}
        })
        const members  = children.length > 1 ? 'Members' : 'Member'
        return handleResponse(`${members} added to class successfully`, false, hub, 201);
    } catch (error) {
        console.log(error);
        return handleResponse(`Error occured adding members the class`, true, {}, 500);
    }
}


export async function addLeaderToHubclass(id:string, leaders:string[]){
    try {
        await connectDB();
        const hub = await Hubclass.findByIdAndUpdate(id,{
            $push:{leaders:{$each:leaders}}
        })
        const leadersText  = leaders.length > 1 ? 'Members' : 'Member'
        return handleResponse(`${leadersText} added to class successfully`, false, hub, 201);
    } catch (error) {
        console.log(error);
        return handleResponse(`Error occured adding leaders the class`, true, {}, 500);
    }
}

export async function removeLeaderFromHubclass(id:string, children:string[]){
    try {
        await connectDB();
        const hub = await Hubclass.findByIdAndUpdate(id,{
            $pull:{children:{$in:children}}
        })
        const leadersText  = children.length > 1 ? 'Members' : 'Member'
        return handleResponse(`${leadersText} removed from class successfully`, false, hub, 201);
    } catch (error) {
        console.log(error);
        return handleResponse(`Error occured demoting leaders`, true, {}, 500);
    }
}

export async function removeMemberFromHubclass(id:string, children:string[]){
    try {
        await connectDB();
        const hub = await Hubclass.findByIdAndUpdate(id,{
            $pull:{children:{$in:children}}
        })
        const members  = children.length > 1 ? 'Members' : 'Member'
        return handleResponse(`${members} removed from class successfully`, false, hub, 201);
    } catch (error) {
        console.log(error);
        return handleResponse(`Error occured removing members from class`, true, {}, 500);
    }
}

export async function getHubclasses(eventId:string){
    try {
        await connectDB();
        const hubs = await Hubclass.find({eventId})
        .populate({
            path:'children',
            populate:[
                {
                    path:'memberId',
                    model:'Member',
                    populate:{
                        path:'church',
                        model:'Church'
                    }
                },
                {
                    path:'groupId',
                    model:'Group'
                }
            ]
        })
        .populate('leaders')
        .populate('eventId')
        .lean();
        return JSON.parse(JSON.stringify(hubs));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching classes', true, {}, 500);
    }
}


export async function getChurchHubclasses(churchId:string, eventId:string){
    try {
        await connectDB();
        const hubs = await Hubclass.find({churchId, eventId})
        .populate({
            path:'children',
            populate:[
                {
                    path:'memberId',
                    model:'Member',
                    populate:{
                        path:'church',
                        model:'Church'
                    }
                },
                {
                    path:'groupId',
                    model:'Group'
                }
            ]
        })
        .populate('leaders')
        .populate('eventId')
        .lean();
        return JSON.parse(JSON.stringify(hubs));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching classes', true, {}, 500);
    }
}


export async function getPublicHubclasses(eventId:string){
    try {
        await connectDB();
        const hubs = await Hubclass.find({eventId})
        .populate({
            path:'children',
            populate:[
                {
                    path:'memberId',
                    model:'Member',
                    populate:{
                        path:'church',
                        model:'Church'
                    }
                },
                {
                    path:'groupId',
                    model:'Group'
                }
            ]
        })
        .populate('eventId')
        .populate('leaders')
        .lean();
        return JSON.parse(JSON.stringify(hubs));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching classes', true, {}, 500);
    }
}

export async function getPublicHubclassesV2(){
    try {
        await connectDB();
        const events = await Event.find({forAll:true}).select('_id');
        const eventIds = events.map((item)=>item._id);
        const hubs = await Hubclass.find({eventId:{$in: eventIds}})
        .populate({
            path:'children',
            populate:[
                {
                    path:'memberId',
                    model:'Member',
                    populate:{
                        path:'church',
                        model:'Church'
                    }
                },
                {
                    path:'groupId',
                    model:'Group'
                }
            ]
        })
        .populate('eventId')
        .populate('leaders')
        .lean();
        return JSON.parse(JSON.stringify(hubs));
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured fetching classes', true, {}, 500);
    }
}

export async function deleteHubclass(id:string){
    try {
        await connectDB();
        await Hubclass.deleteOne({_id:id})
        return handleResponse('Class deleted successfully', false, {}, 201);
    } catch (error) {
        console.log(error);
        return handleResponse('Error occured deleting the class', true, {}, 500);
    }
}



export async function getMembersForChildrenClass(eventId: string) {
    try {
      await connectDB();
  
      const childAgeRanges = ["0-5", "6-10"];
  
      // Get all registered members for the event
      const registrations = await Registration.find({ eventId })
        .populate({
          path: "memberId",
          populate: { path: "church", model: "Church" }
        })
        .populate("groupId")
        .lean();

        // console.log('Regs: ', registrations);
  
      // Get all children already in a Hubclass for this event
      const hubClasses = await Hubclass.find({ eventId })
        .select("children")
        .populate("children", "_id")
        .lean();
  
      // Get all child member IDs already in Hubclasses
      const hubChildrenIds = new Set(
        hubClasses.flatMap(h => h.children).map(child => child._id.toString())
      );
  
      // Filter registrations for eligible children
      const filtered = registrations.filter(reg => {
        const member = reg.memberId as IMember;
        const isInRange = childAgeRanges.includes(member?.ageRange);
        const isInHubClass = hubChildrenIds.has(member._id.toString());
        return isInRange && !isInHubClass;
      });
  
      return JSON.parse(JSON.stringify(filtered));
    } catch (error) {
      console.error("Error in getMembersForChildrenClass:", error);
      return handleResponse("Error occurred fetching members", true, {}, 500);
    }
  }
  

 

  export async function getMembersForChildrenClassWithRels(eventId: string) {
    try {
      await connectDB();
  
      const childAgeRanges = ["0-5", "6-10"];
  
      // Step 1: Get all registrations for this event with member and group/church populated
      const registrations = await Registration.find({ eventId })
          .populate({
              path: "memberId",
              populate: { path: "church", model: "Church" }
          })
          .populate("groupId")
          .lean() as unknown as IRegistration[];
  
      // Step 2: Get all child member IDs already in a Hubclass
      const hubClasses = await Hubclass.find({ eventId })
        .select("children")
        .populate("children","_id")
        .lean();
  
        // console.log('Children: ',hubClasses[0].children[0]);
      const hubChildrenIds = new Set(
        hubClasses.flatMap(h => h.children).map(child => child._id.toString())
      );
    //   console.log(hubChildrenIds)
  
      // Step 3: Filter eligible children (right age and not in any hub class)
      const filtered = registrations.filter(reg => {
        const member = reg.memberId as IMember;
        const isInRange = childAgeRanges.includes(member?.ageRange);
        const isInHubClass = hubChildrenIds.has(reg._id.toString());
        return isInRange && !isInHubClass;
      });
  
      // Step 4: Get relationships for these members
      const memberIds = filtered.map(reg => (reg.memberId as IMember)._id);
  
      const relationships = await Relationship.find({
          members: { $in: memberIds }
      })
          .populate({
              path: "members",
              model: "Member",
              //   populate: { path: "church", model: "Church" }
          })
          .lean() as unknown as IRelationship[];
  
      // Step 5: Map memberId -> their relationships
      const memberToRelationships = new Map<string, IRelationship[]>();
      for (const rel of relationships) {
        for (const mem of rel.members as IMember[]) {
          const memId = mem._id.toString();
          if (!memberToRelationships.has(memId)) {
            memberToRelationships.set(memId, []);
          }
          memberToRelationships.get(memId)!.push(rel);
        }
      }
  
      // Step 6: Add relationship data to each registration
      const enriched = filtered.map(reg => {
        const member = reg.memberId as IMember;
        const relationships = memberToRelationships.get(member._id.toString()) || [];
        return {
          ...reg,
          relationships
        };
      });
  
      return JSON.parse(JSON.stringify(enriched));
    } catch (error) {
      console.error("Error in getMembersForChildrenClass:", error);
      return handleResponse("Error occurred fetching members", true, {}, 500);
    }
  }

  
  export async function getMembersForClassV2(classId: string) {
    try {
      await connectDB();
  
    //   const childAgeRanges = ["0-5", "6-10"];
  
      // Step 1: Get all registrations for this event with member and group/church populated
      const hub = await Hubclass.findById(classId)
          .populate({
              path: 'children',
              populate: {
                  path: "memberId",
                  model:'Member',
                  populate: { path: "church", model: "Church" }
              }
          }).lean() as unknown as IHubclass;

      const registrations = hub?.children as IRegistration[];
  
  
     
  
      // Step 4: Get relationships for these members
      const memberIds = registrations.map(reg => (reg.memberId as IMember)._id);
  
      const relationships = await Relationship.find({
          members: { $in: memberIds }
      })
          .populate({
              path: "members",
              model: "Member",
              //   populate: { path: "church", model: "Church" }
          })
          .lean() as unknown as IRelationship[];
  
      // Step 5: Map memberId -> their relationships
      const memberToRelationships = new Map<string, IRelationship[]>();
      for (const rel of relationships) {
        for (const mem of rel.members as IMember[]) {
          const memId = mem._id.toString();
          if (!memberToRelationships.has(memId)) {
            memberToRelationships.set(memId, []);
          }
          memberToRelationships.get(memId)!.push(rel);
        }
      }
  
      // Step 6: Add relationship data to each registration
      const enriched = registrations.map(reg => {
        const member = reg.memberId as IMember;
        const relationships = memberToRelationships.get(member._id.toString()) || [];
        return {
          ...reg,
          relationships
        };
      });
  
      return JSON.parse(JSON.stringify(enriched));
    } catch (error) {
      console.error("Error in getMembersForChildrenClass:", error);
      return handleResponse("Error occurred fetching members", true, {}, 500);
    }
  }
  