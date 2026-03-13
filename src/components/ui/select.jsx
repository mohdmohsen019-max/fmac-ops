import React, { useState, useContext, createContext } from "react";

const SelectContext = createContext(null);

export function Select({ value, onValueChange, children }) {
  const [open, setOpen] = useState(false);
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      {children}
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ className = "", children, ...props }) {
  const ctx = useContext(SelectContext);
  if (!ctx) return null;

  const { setOpen } = ctx;

  return (
    <button
      type="button"
      className={`flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${className}`}
      onClick={() => setOpen((x) => !x)}
      {...props}
    >
      {children}
    </button>
  );
}

export function SelectContent({ children }) {
  const ctx = useContext(SelectContext);
  if (!ctx || !ctx.open) return null;

  return (
    <div className="mt-1 border rounded-xl bg-white shadow-sm">
      {children}
    </div>
  );
}

export function SelectItem({ value, children }) {
  const ctx = useContext(SelectContext);
  if (!ctx) return null;

  const { onValueChange, setOpen } = ctx;

  return (
    <div
      className="px-3 py-2 cursor-pointer hover:bg-slate-100 text-sm"
      onClick={() => {
        onValueChange && onValueChange(value);
        setOpen(false);
      }}
    >
      {children}
    </div>
  );
}

export function SelectValue({ placeholder }) {
  const ctx = useContext(SelectContext);
  if (!ctx) return null;

  const { value } = ctx;

  return (
    <span className="text-sm">
      {value || placeholder || "Select"}
    </span>
  );
}

