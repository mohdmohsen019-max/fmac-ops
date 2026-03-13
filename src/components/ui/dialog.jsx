import React, { createContext, useContext, useState } from "react";

const DialogContext = createContext(null);

export function Dialog({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ asChild, children }) {
  const ctx = useContext(DialogContext);
  if (!ctx) return children || null;

  const { setOpen } = ctx;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (...args) => {
        if (children.props.onClick) {
          children.props.onClick(...args);
        }
        setOpen(true);
      },
    });
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
    >
      {children}
    </button>
  );
}

export function DialogContent({ className = "", children }) {
  const ctx = useContext(DialogContext);
  if (!ctx || !ctx.open) return null;

  const { setOpen } = ctx;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={`relative bg-white p-6 rounded-2xl shadow-lg max-w-xl w-full ${className}`}
      >
        <button
          type="button"
          className="absolute right-4 top-4 text-slate-500 hover:text-slate-800"
          onClick={() => setOpen(false)}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ className = "", ...props }) {
  return (
    <div
      className={`flex flex-col space-y-1.5 border-b border-slate-100 pb-4 ${className}`}
      {...props}
    />
  );
}

export function DialogTitle({ className = "", ...props }) {
  return (
    <h2
      className={`text-lg font-semibold leading-none tracking-tight ${className}`}
      {...props}
    />
  );
}

