import AddButton from "@/components/features/AddButton";
import { useRef, useState } from "react";
import SignatureCanvas from 'react-signature-canvas'

interface SignaturePadProps {
    onSave: (dataUrl: string) => void;
    onSaveToFile: () => Promise<void>;
    showSave:boolean;
    // showClear:boolean;
    onClear?: () => void;
  }

const SignaturePad = ({onSave, showSave, onSaveToFile, onClear}:SignaturePadProps) => {
    const sigPadRef = useRef<SignatureCanvas | null>(null);
    const [padEmpty, setPadEmpty] = useState<boolean>(true);

    const handleDraw = () => {
      if (sigPadRef.current) {
        setPadEmpty(sigPadRef.current.isEmpty());
      }
    };

    const handleClear = () => {
      sigPadRef.current?.clear();
      setPadEmpty(true);
      if (onClear) onClear();
    };
  
    const handleSave = () => {
      if (sigPadRef.current?.isEmpty()) {
        alert("Please provide a signature.");
        return;
      }
      const dataUrl = sigPadRef.current?.toDataURL();
      if (dataUrl) onSave(dataUrl);
    };
  return (
    <div className="flex flex-col items-center gap-4 w-fit">
      <SignatureCanvas
        ref={sigPadRef}
        penColor='black'
        canvasProps={{
        //   width: 500,
          height: 100,
          className: "border border-gray-300 dark:bg-slate-100 rounded-md w-full ",
        }}
        onEnd={handleDraw}
      />
      
      {
        !padEmpty &&
        <div className="flex gap-4 w-full justify-end">
          <AddButton smallText className="rounded" noIcon text="Clear" isDanger type="button" onClick={handleClear} />
          {
              showSave ?
              <AddButton smallText className="rounded" noIcon text="Save"  type="button" onClick={onSaveToFile} />
              :
              <AddButton smallText className="rounded" noIcon text="Use"  type="button" onClick={handleSave} />

          }
        </div>
      }
    </div>
  )
}

export default SignaturePad