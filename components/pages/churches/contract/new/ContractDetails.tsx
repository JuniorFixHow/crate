'use client'
import DeleteDialog from "@/components/DeleteDialog";
import { IContract } from "@/lib/database/models/contract.model";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from "react"
import SignaturePad from "./SignaturePad";
import { ErrorProps, SignatureProps } from "@/types/Types";
import { saveSignatureToFile } from "@/lib/actions/misc";
import AddButton from "@/components/features/AddButton";
import { Alert } from "@mui/material";
import { today } from "@/functions/dates";
import { createContract, deleteContract, updateContract } from "@/lib/actions/contract.action";
import ContractPreview from "../single/ContractPreview";
import { IService } from "@/lib/database/models/service.model";
import { useFetchServices } from "@/hooks/fetch/useService";

type ContractDetailsProps = {
    currentContract?:IContract
}

type OfferProp = {name:string, sign:string}

const ContractDetails = ({currentContract}:ContractDetailsProps) => {
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [previewMode, setPreviewMode] = useState<boolean>(false);
    const [data, setData] = useState<Partial<IContract>>({});
    const [dat, setDat] = useState<{from:string, to:string}>({from:'', to:''});
    const [offer, setOffer] = useState<OfferProp>({name:'', sign:''});
    const [wit, setWit] = useState<OfferProp>({name:'', sign:''});
    const [response, setResponse] = useState<ErrorProps>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const [saveResponse, setSaveResponse] = useState<ErrorProps>(null);
    const [servs, setServs] = useState<IService[]>([]);
    const formRef = useRef<HTMLFormElement>(null);
    const [amount, setAmount] = useState<number>(0);

    const {services} = useFetchServices();
    const cservs = currentContract?.services as IService[]

    useEffect(()=>{
        if(cservs){
            setServs(cservs);
        }
    },[cservs])

    useEffect(()=>{
        if(servs.length){
            const total = servs?.reduce((sum, service)=>service?.cost + sum, 0)
            setAmount(total);
        }
    },[servs])

    const handleChange =(e:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
        const {name, value} = e.target;
        setData((prev)=>({
            ...prev,
            [name]:value
        }))
    }

    const handleChangeDate =(e:ChangeEvent<HTMLInputElement>)=>{
        const {name, value} = e.target;
        setDat((prev)=>({
            ...prev,
            [name]:value
        }))
    }

    const handleChangeOfferee =(e:ChangeEvent<HTMLInputElement>)=>{
        const {name, value} = e.target;
        setOffer((prev)=>({
            ...prev,
            [name]:value
        }))
    }
    const handleChangeWitness =(e:ChangeEvent<HTMLInputElement>)=>{
        const {name, value} = e.target;
        setWit((prev)=>({
            ...prev,
            [name]:value
        }))
    }

    const handleSaveOffereeSignature = (dataUrl: string) => {
        setOffer((pre)=>({
            ...pre,
            sign:dataUrl
        }));
        // console.log("Saved signature:", dataUrl);
        // You can send `dataUrl` to your server here
    };
    const handleSaveWitnessSignature = (dataUrl: string) => {
        setWit((pre)=>({
            ...pre,
            sign:dataUrl
        }));
        // console.log("Saved signature:", dataUrl);
        // You can send `dataUrl` to your server here
    };

    // console.log(serviceIds)

    const handleClearOfferee =()=>{
        setOffer((pre)=>({
            ...pre, sign:''
        }))
    }
    const handleClearWitness =()=>{
        setWit((pre)=>({
            ...pre, sign:''
        }))
    }

    const handleSaveToFile = async(
        data:SignatureProps,
        setSign:Dispatch<SetStateAction<SignatureProps>>
    )=>{
        try {
            const res = await saveSignatureToFile(data);
            setSaveResponse(res);
            setSign({...data, sign:''});
            // console.log(res);
        } catch (error) {
            console.log(error);
            setSaveResponse({message:'Error occured saving signature to file', error:true});
        }
    }

    const handleDeleteContract = async()=>{
        setResponse(null);
        try {
            setDeleteLoading(true);
            const res = await deleteContract(currentContract!._id);
            setResponse(res);
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured deleting the contract', error:true});
        }finally{
            setDeleteLoading(false);
        }
    }


    const handleSubmit =async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setResponse(null);
        try {
            setLoading(true);
            if((offer.sign === '') || (wit.sign === '')){
                setResponse({message:'Both offeree and withness have to sign.', error:true});
            }else{
                const sers = servs.map((item)=>item._id);
                const body:Partial<IContract> = {
                    ...data,
                    date:dat,
                    offeree:offer,
                    witness:wit,
                    services:sers
                }
                const res = await createContract(body);
                setResponse(res);
                handleClearOfferee();
                handleClearWitness();
                formRef.current?.reset();
            }
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured submitting the contract.', error:true});
        }finally{
            setLoading(false);
        }
    }

    const handleUpdateContract = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setResponse(null);
        try {
            setLoading(true);
            const sers = servs?.map((item)=>item._id);
            const date = {
                from:dat.from || currentContract!.date.from,
                to:dat.to || currentContract!.date.to
            };
            const witness = {
                name:wit.name || currentContract!.witness.name,
                sign:wit.sign || currentContract!.witness.sign
            };
            const offeree = {
                name:offer.name || currentContract!.offeree.name,
                sign:offer.sign || currentContract!.offeree.sign
            };
            const body:Partial<IContract> = {
                _id:currentContract?._id,
                title:data.title || currentContract?.title,
                church:data.church || currentContract?.church,
                description:data.description || currentContract?.description,
                date,
                offeree, witness,
                services:sers
            };

            const res = await updateContract(body);
            setResponse(res);
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured updating the contract', error:true});
        }finally{
            setLoading(false);
        }
    }


    const handleCheckService = (serv: IService) => {
        setServs((prev) => {
            const exists = prev.find((item) => item._id === serv._id);
            return exists 
                ? prev.filter((item) => item._id !== serv._id) 
                : [...prev, serv];
        });
    };
    


    const message = `Deleting a contract will leave the associated church unlicensed. Proceed?`;


  return (
    <form ref={formRef} onSubmit={ currentContract? handleUpdateContract : handleSubmit}  className='px-8 py-4 flex-col dark:bg-[#0F1214] dark:border flex md:flex-row md:items-stretch gap-6 md:gap-12 items-start bg-white' >
        <div className="flex flex-col gap-5 flex-1">
            <div className="flex flex-col gap-1">
                <span className='text-slate-400 font-semibold text-[0.8rem]' >Title</span>
                <input required={!currentContract} onChange={handleChange} defaultValue={currentContract?.title} placeholder='type here...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="text" name="title"  />
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-10">
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Commencement</span>
                    <input min={!currentContract ? today():''} required={!currentContract} onChange={handleChangeDate} defaultValue={currentContract?.date?.from} placeholder='type here...' className='border-b p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="date" name="from"  />
                </div>
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Expiration</span>
                    <input min={!currentContract ? today():''} required={!currentContract} onChange={handleChangeDate} defaultValue={currentContract?.date?.to} placeholder='type here...' className='border-b p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="date" name="to"  />
                </div>
            </div>
            
            <div className="flex flex-col gap-1">
                <span className='text-slate-400 font-semibold text-[0.8rem]' >Church</span>
                <input required={!currentContract} onChange={handleChange} defaultValue={currentContract?.church} placeholder='type here...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="text" name="church"  />
            </div>

            <div className="flex flex-col gap-1">
                <span className='text-slate-400 font-semibold text-[0.8rem]' >Description</span>
                <textarea placeholder="say something about the contract"  defaultValue={currentContract?.description} onChange={handleChange} className='border rounded resize-none p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]'  name="description"  />
            </div>

            {
                services?.length > 0 &&
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Services</span>
                    {
                        services.map((service) => {
                            const isChecked = servs.some((item) => item._id === service._id);
                        
                            return (
                                <div key={service?._id} className="flex gap-2 items-center">
                                    <input
                                        type="checkbox"
                                        onChange={() => handleCheckService(service)}
                                        checked={isChecked}
                                        value={service._id}
                                        className="cursor-pointer bg-transparent"
                                    />
                                    <span className='text-slate-400 font-semibold text-[0.8rem]' >{service?.name} - ${service?.cost}</span>
                                </div>
                            );
                        })
                        
                    }
                    
                </div>
            }

            <span className='text-slate-400 font-semibold text-[0.8rem]' >Total benefit - ${amount}</span>
        </div>

    <ContractPreview amount={amount} services={servs} previewMode={previewMode} setPreviewMode={setPreviewMode} currentContract={currentContract!} />
    <DeleteDialog value={deleteMode} setValue={setDeleteMode} title={`Delete ${currentContract?.title}`} message={message} onTap={handleDeleteContract} />
        {/* RIGHT SIDE */}

    <div className="flex flex-1 flex-col gap-5">   
        
        {
            saveResponse?.message &&
            <Alert onClose={()=>setSaveResponse(null)} severity={saveResponse.error ? 'error':'success'} >{saveResponse.message}</Alert>
        }
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
                <span className='text-slate-400 font-semibold text-[0.8rem]' >Offeree Name</span>
                <input required={!currentContract} onChange={handleChangeOfferee} defaultValue={currentContract?.offeree?.name} placeholder='type here...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="text" name="name"  />
            </div>
            <div className="flex flex-col gap-1">
                <span className='text-slate-400 font-semibold text-[0.8rem]' >Signature</span>
                <SignaturePad onSaveToFile={()=>handleSaveToFile(offer, setOffer)} showSave={offer.sign !== ''} onClear={handleClearOfferee} onSave={handleSaveOffereeSignature} />
                {/* <textarea required={!currentContract} defaultValue={currentContract?.witness?.sign} onChange={handleChangeOfferee} className='border rounded resize-none p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]'  name="sign"  /> */}
            </div>
        </div>

        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
                <span className='text-slate-400 font-semibold text-[0.8rem]' >Witness Name</span>
                <input required={!currentContract} onChange={handleChangeWitness} defaultValue={currentContract?.witness?.name} placeholder='type here...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="text" name="name"  />
            </div>
            <div className="flex flex-col gap-1">
                <span className='text-slate-400 font-semibold text-[0.8rem]' >Signature</span>
                <SignaturePad onSaveToFile={()=>handleSaveToFile(wit, setWit)} onClear={handleClearWitness} showSave={wit.sign !== ''} onSave={handleSaveWitnessSignature} />
            </div>
        </div>

        {
            response?.message &&
            <Alert onClose={()=>setResponse(null)} severity={response.error ? 'error':'success'} >{response.message}</Alert>
        }
        
        <div className="flex flex-col gap-3 md:flex-row">
            <AddButton disabled={loading} text={loading ? "loading" : currentContract ? "Save Changes" :"Submit"} noIcon smallText className="rounded" />
            {
                currentContract &&
                <>
                <AddButton type="button" text="Preview" onClick={()=>setPreviewMode(true)} noIcon isCancel smallText className="rounded" />
                <AddButton onClick={()=>setDeleteMode(true)} type="button" text={deleteLoading? "loading..." : "Delete"} noIcon isDanger smallText className="rounded" />
                </>
            }
        </div>
    </div>
    </form>
  )
}

export default ContractDetails