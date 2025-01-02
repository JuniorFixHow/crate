import { IService } from "@/lib/database/models/service.model";
import {  RefObject } from "react";

export const handlePrint = (printRef:RefObject<HTMLDivElement|null>) => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const originalContent = document.body.innerHTML;

      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload(); // Reload to restore original React state
    }
};

export const calculateTotalService = (services:IService[], quantity:string[]):number=>{

  const total = services.reduce((sum, service) => {
    const serviceQuantity = quantity?.filter((id) => id === service._id).length;
    return sum + service.cost * serviceQuantity;
}, 0);
  return total || 0;
}