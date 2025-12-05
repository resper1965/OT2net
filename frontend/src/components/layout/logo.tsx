import Image from "next/image";
import NessLogo from "@/components/NessLogo";

export default function Logo() {
  return (
    <div className="flex items-center justify-center">
      <NessLogo className="h-8 w-8 rounded-[5px] transition-all group-data-collapsible:size-7 group-data-[collapsible=icon]:size-8" />
    </div>
  );
}

