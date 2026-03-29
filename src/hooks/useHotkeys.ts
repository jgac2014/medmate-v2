"use client";

import { useEffect } from "react";

type HotkeyMap = Record<string, (e: KeyboardEvent) => void>;

export function useHotkeys(hotkeys: HotkeyMap) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const key = [
        e.ctrlKey || e.metaKey ? "mod" : "",
        e.shiftKey ? "shift" : "",
        e.key.toLowerCase(),
      ]
        .filter(Boolean)
        .join("+");

      const action = hotkeys[key];
      if (action) {
        e.preventDefault();
        action(e);
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [hotkeys]);
}
