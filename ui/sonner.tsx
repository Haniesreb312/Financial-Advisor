"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
  richColors?: boolean;
}

interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

let toasts: ToastMessage[] = [];
let listeners: Array<(toasts: ToastMessage[]) => void> = [];

export const toast = {
  success: (message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    toasts = [...toasts, { id, message, type: "success" }];
    listeners.forEach(listener => listener(toasts));
    setTimeout(() => {
      toasts = toasts.filter(t => t.id !== id);
      listeners.forEach(listener => listener(toasts));
    }, 3000);
  },
  error: (message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    toasts = [...toasts, { id, message, type: "error" }];
    listeners.forEach(listener => listener(toasts));
    setTimeout(() => {
      toasts = toasts.filter(t => t.id !== id);
      listeners.forEach(listener => listener(toasts));
    }, 3000);
  },
  info: (message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    toasts = [...toasts, { id, message, type: "info" }];
    listeners.forEach(listener => listener(toasts));
    setTimeout(() => {
      toasts = toasts.filter(t => t.id !== id);
      listeners.forEach(listener => listener(toasts));
    }, 3000);
  },
};

const Toaster = ({ position = "top-right", richColors = false }: ToastProps) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener = (newToasts: ToastMessage[]) => {
      setMessages(newToasts);
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  };

  const typeStyles = {
    success: richColors
      ? "bg-green-500 text-white border-green-600"
      : "bg-background text-foreground border-green-500",
    error: richColors
      ? "bg-red-500 text-white border-red-600"
      : "bg-background text-foreground border-red-500",
    info: richColors
      ? "bg-blue-500 text-white border-blue-600"
      : "bg-background text-foreground border-blue-500",
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 flex flex-col gap-2 pointer-events-none`}>
      {messages.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto px-4 py-3 rounded-lg border shadow-lg animate-in slide-in-from-top-2 ${typeStyles[toast.type]}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export { Toaster };
