// src/hooks/useIsDesktop.ts
import { useEffect, useState } from "react";

export function useIsDesktop(breakpointPx = 768) {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= breakpointPx : true
  );

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= breakpointPx);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpointPx]);

  return isDesktop;
}
