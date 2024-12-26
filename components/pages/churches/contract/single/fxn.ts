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