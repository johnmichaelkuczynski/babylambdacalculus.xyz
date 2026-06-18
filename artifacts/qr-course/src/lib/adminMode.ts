import { useEffect, useState } from "react";

const KEY = "ethics-admin-mode";
const EVENT = "admin-mode-change";

export function isAdminMode(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function setAdminMode(on: boolean): void {
  try {
    localStorage.setItem(KEY, on ? "1" : "0");
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function useAdminMode(): [boolean, (on: boolean) => void] {
  const [on, setOn] = useState<boolean>(isAdminMode);
  useEffect(() => {
    const handler = () => setOn(isAdminMode());
    window.addEventListener(EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return [on, setAdminMode];
}
