"use client";

import { useCallback, useEffect, useState } from "react";

/** Same theme behavior as the public site: synced with the pre-paint script
 *  in layout.tsx and persisted to localStorage. */
export function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);

  const toggleDark = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.dataset.theme = next ? "dark" : "";
      try {
        localStorage.setItem("theme", next ? "dark" : "light");
      } catch {}
      return next;
    });
  }, []);

  return { dark, toggleDark };
}
