"use client";

import { useEffect, useState, useCallback } from "react";

interface ToastState {
  message: string;
  type: "success" | "error" | "info";
  visible: boolean;
}

let showToastFn: ((message: string, type?: "success" | "error" | "info") => void) | null = null;

export function showToast(message: string, type: "success" | "error" | "info" = "success") {
  showToastFn?.(message, type);
}

const borderColors = {
  success: "border-accent",
  error: "border-status-crit",
  info: "border-status-info",
};

const textColors = {
  success: "text-accent",
  error: "text-status-crit",
  info: "text-status-info",
};

export function ToastProvider() {
  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: "success",
    visible: false,
  });

  const show = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
  }, []);

  useEffect(() => {
    showToastFn = show;
    return () => { showToastFn = null; };
  }, [show]);

  return (
    <div
      className={`fixed bottom-4 right-4 bg-bg-3 border ${borderColors[toast.type]} ${textColors[toast.type]} px-4 py-2 rounded-[5px] text-xs font-medium tracking-[0.01em] z-[9999] transition-all duration-200 ${
        toast.visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-1.5 pointer-events-none"
      }`}
    >
      {toast.message}
    </div>
  );
}
