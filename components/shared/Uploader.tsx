'use client'
import { CldUploadWidget,    CloudinaryUploadWidgetResults, } from 'next-cloudinary';

type UploaderProps = {
    onSuccess:(result:CloudinaryUploadWidgetResults)=>Promise<void>
}



const Uploader = ({onSuccess}:UploaderProps) => {

    
  return (
    <CldUploadWidget onError={(e)=>console.log(e)} onSuccess={onSuccess} uploadPreset="crate_eministry">
    {({ open }) => {
        return (
            <button onClick={()=>open()}   className="bg-slate-300 text-[0.8rem] dark:text-white rounded-full py-2 px-5 dark:bg-black dark:border hover:bg-slate-200 dark:hover:border-b dark:bg-transparentlue-600" >Upload Image</button>
        );
    }}
    </CldUploadWidget>
  )
}

export default Uploader