"use client";

import { useEffect, useState } from "react";

interface ErrorAlertProps {
  message: string;
  onClose?: () => void;
  duration?: number; // in ms (default 20s)
}

export default function ErrorAlert({
  message,
  onClose,
  duration = 20000,
}: ErrorAlertProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed top-6 right-6 z-50 bg-accent text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
      <span className="font-medium">{message}</span>
      <button
        onClick={() => setVisible(false)}
        className="ml-2 text-white font-bold cursor-pointer"
      >
        ×
      </button>
    </div>
  );
}
