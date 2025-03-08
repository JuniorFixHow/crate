'use client'
import { UserRoles } from "@/components/Dummy/UserRoles"
import Subtitle from "@/components/features/Subtitle"
import CustomCheck from "../../group/new/CustomCheck"
import { IVendor } from "@/lib/database/models/vendor.model"
import { useEffect, useState } from "react"
import AddButton from "@/components/features/AddButton"
// import { ErrorProps } from "@/types/Types"
// import { Alert } from "@mui/material"
import { updateVendorRoles } from "@/lib/actions/vendor.action"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/firebase"
import { enqueueSnackbar } from "notistack"

type RolesProps = {
    selection:IVendor[]
}

const Roles = ({selection}:RolesProps) => {
    const [roles, setRoles] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    // const [response, setResponse] = useState<ErrorProps>(null);

    useEffect(()=>{
        if(selection.length === 1){
            const vendor = selection[0];
            setRoles((pre)=>(
                Array.from(new Set(pre.concat(vendor?.roles)))
            ))
        }
    },[selection])

    // console.log(selection, roles)

    const handleSelect = (role:string)=>{
        setRoles((pre)=>{
            const selected = pre.includes(role);
            return selected ?
            pre.filter((item) => item !== role)
            :
            [...pre, role]
        })
    }

    const handleSaveRoles = async()=>{
        try {
            setLoading(true);
            const userIds = selection?.map((item)=>item._id);
            const filtered = roles.filter((item)=>item !== null);
            const res = await updateVendorRoles(userIds, filtered);
            if(res?.code === 201){
                await Promise.all(
                    userIds.map((id)=>(
                        updateDoc(doc(db, "Users", id), {roles:filtered})
                    ))
                )
                // const message = 'Roles removed successfully';
                // const message2 = `${roles.length > 1 ? 'Roles':'Role'} assigned successfully`;
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                // setResponse({message: roles.length>0 ? message2:message, error:false});
            }
        } catch (error) {
            console.log(error);
            // setResponse({message:'Error occured. Please Retry', error:true});
            enqueueSnackbar('An unknown error occured. Please Retry', {variant:'error'});
        }finally{
            setLoading(false);
        }
    }

  return (
    <div className="table-main2" >
        <div className="flex flex-col gap-2">
            <div className="flex justify-between p-4">
                <span className="text-2xl font-semibold" >Assign Roles</span>
                {
                    roles?.length>0 && selection.length > 0 &&
                    <AddButton onClick={handleSaveRoles} disabled={loading} text={loading? "loading...": "Save"} noIcon smallText className="rounded py-1" />
                }
            </div>
            <hr className="w-full border" />
            {/* {
                response?.message &&
                <Alert onClose={()=>setResponse(null)} severity={response.error ? 'error':'success'} >{response.message}</Alert>
            } */}
        </div>
        <div className="flex flex-col gap-10 p-4 md:w-3/4">
            {
                UserRoles?.slice(1).map((role)=>{
                    // const checked = roles.includes(code);
                    const codes = role.codes;
                    return(
                        <div className="flex flex-col gap-3" key={role?.title} >
                                <Subtitle text={role?.title} />
                            <div className="flex flex-wrap gap-12">
                                <div className="flex flex-col gap-2 items-center ">
                                    <span className="italic font-semibold" >Create</span>
                                    <CustomCheck onClick={()=>handleSelect(codes[0])} checked={roles.includes(codes[0])} />
                                </div>
                                <div className="flex flex-col gap-2 items-center ">
                                    <span className="italic font-semibold" >Read</span>
                                    <CustomCheck onClick={()=>handleSelect(codes[1])} checked={roles.includes(codes[1])} />
                                </div>
                                <div className="flex flex-col gap-2 items-center ">
                                    <span className="italic font-semibold" >Update</span>
                                    <CustomCheck onClick={()=>handleSelect(codes[2])} checked={roles.includes(codes[2])} />
                                </div>
                                <div className="flex flex-col gap-2 items-center ">
                                    <span className="italic font-semibold" >Delete</span>
                                    <CustomCheck onClick={()=>handleSelect(codes[3])} checked={roles.includes(codes[3])} />
                                </div>
                                {
                                    codes?.length > 4 &&
                                    <div className="flex flex-col gap-2 items-center ">
                                        <span className="italic font-semibold" >Assign</span>
                                        <CustomCheck onClick={()=>handleSelect(codes[4])} checked={roles.includes(codes[4])} />
                                    </div>
                                }
                            </div>
                        </div>
                    )
                })
            }
        </div>
    </div>
  )
}

export default Roles