import { useEffect } from "react";
import { usePageTitle } from "@/contexts/PageTitleContext";

export function usePageTitleEffect(title: string) {
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);
}


