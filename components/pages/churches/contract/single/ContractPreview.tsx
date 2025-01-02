import { IContract } from "@/lib/database/models/contract.model";
import { Modal } from "@mui/material";
import { Dispatch, SetStateAction, useRef } from "react";
import '../../../../features/customscroll.css';
import Title from "@/components/features/Title";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Subtitle from "@/components/features/Subtitle";
import { FiPrinter } from "react-icons/fi";
import Image from "next/image";
import { handlePrint } from "./fxn";
import { IService } from "@/lib/database/models/service.model";

type ContractPreviewProps = {
    currentContract: IContract;
    previewMode: boolean;
    setPreviewMode: Dispatch<SetStateAction<boolean>>;
    amount:number;
    quantity:string[];
    services:IService[];
};

const ContractPreview = ({
    currentContract,
    previewMode,
    amount,
    services,
    quantity,
    setPreviewMode,
}: ContractPreviewProps) => {

    const printRef = useRef<HTMLDivElement>(null);

    const handleClose = () => {
        setPreviewMode(false);
    };

    

    return (
        <Modal
            open={previewMode}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <div className="flex size-full items-center justify-center">
                <div className="new-modal w-[90%] lg:w-[60%] max-h-[90vh] scrollbar-custom overflow-y-auto bg-white p-8 rounded-lg shadow-xl">
                    {/* Header Buttons */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={handleClose}
                            className="text-red-500 hover:text-red-700 transition"
                            aria-label="Close"
                        >
                            <IoIosCloseCircleOutline size={30} />
                        </button>
                        <button
                            onClick={()=>handlePrint(printRef)}
                            className="text-blue-500 hover:text-blue-700 transition"
                            aria-label="Print"
                        >
                            <FiPrinter size={24} />
                        </button>
                    </div>

                    <div ref={printRef}  className="flex w-full flex-col gap-4">
                        {/* Contract Header */}
                        <div className="text-center flex flex-col gap-2 border-b border-gray-300 pb-4">
                            <div className="flex relative h-20 w-20 self-center">
                                <Image fill src='/logo2.png' alt="Logo" />
                            </div>
                            <Title
                                text="CONTRACT AGREEMENT"
                                className="text-2xl font-extrabold text-gray-800"
                            />
                            <Subtitle
                                text={currentContract?.title?.toUpperCase()}
                                className="text-gray-600 mt-2"
                            />
                        </div>

                        {/* Contract Content */}
                        <div className="mt-4 text-gray-700 text-sm leading-relaxed">
                            <p>
                                This Agreement (the &quot;Agreement&quot;) is entered into as of{" "}
                                <strong>{currentContract?.date?.from}</strong> between{" "}
                                <strong>CRATE Development Team</strong> (the &quot;Provider&quot;) and{" "}
                                <strong>{currentContract?.offeree?.name}</strong> (the &quot;Offeree&quot;).
                            </p>
                            <p className="mt-4">
                                The purpose of this Agreement is to outline the terms for the
                                services provided by CRATE, including but not limited to the
                                onboarding and management of members for{" "}
                                <strong>{currentContract?.church}</strong>.
                            </p>

                            {/* Terms */}
                            <h3 className="mt-8 font-semibold text-lg">Terms of the Agreement</h3>
                            <ul className="list-disc pl-6 mt-4 space-y-2">
                                <li>
                                    <strong>Agreement Duration:</strong> From{" "}
                                    <strong>{currentContract?.date?.from}</strong> to{" "}
                                    <strong>{currentContract?.date?.to}</strong>.
                                </li>
                                <li>
                                    <strong>Amount Payable:</strong> ${amount}.
                                </li>
                                <li> <strong>Contract Description:</strong> {currentContract?.description}</li>
                            </ul>

                            {
                                services?.length > 0 &&
                                <div className="flex flex-col">
                                    <h3 className="mt-8 font-semibold text-lg">{services?.length> 1 ? 'Services':'Service'}</h3>
                                    <ul className="list-disc pl-6 mt-4 space-y-2">
                                        {
                                            services.map((service)=>{
                                                const counts = quantity.filter((item)=>item === service?._id).length;
                                                const amount = counts*service?.cost;
                                                return(
                                                    <li key={service?._id} >
                                                        <strong>{service?.name}:</strong> ${amount}
                                                    </li>
                                                )

                                            })
                                        }
                                    </ul>
                                </div>
                            }

                            {/* Signatures */}
                            <h3 className="mt-8 font-semibold text-lg">Signatures</h3>
                            <div className="flex flex-col gap-6 mt-4">
                                <div>
                                    <p className="font-medium">Provider: CRATE Development Team</p>
                                    <div className="mt-2 border relative rounded-md p-2 w-48 h-24 flex items-center justify-center">
                                        <Image
                                            src={currentContract?.offeree?.sign}
                                            alt="Provider Signature"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <p className="font-medium">
                                        Offeree: {currentContract?.offeree?.name}
                                    </p>
                                    <div className="mt-2 border relative rounded-md p-2 w-48 h-24 flex items-center justify-center">
                                        <Image
                                            src={currentContract?.offeree?.sign}
                                            alt="Offeree Signature"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <p className="font-medium">
                                        Witness: {currentContract?.witness?.name}
                                    </p>
                                    <div className="mt-2 border relative rounded-md p-2 w-48 h-24 flex items-center justify-center">
                                        <Image
                                            src={currentContract?.witness?.sign}
                                            alt="Witness Signature"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </Modal>
    );
};

export default ContractPreview;
