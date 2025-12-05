import Image from "next/image";
import NessLogo from "@/components/NessLogo";

export default function Logo() {
  return (
    <NessLogo className="h-8 w-8 rounded-[5px] transition-all group-data-collapsible:size-7 group-data-[collapsible=icon]:size-8" />
  );
}

