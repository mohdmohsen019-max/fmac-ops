export function Card({ className = "", ...props }) {
  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-white shadow-sm ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }) {
  return (
    <div
      className={`flex flex-col space-y-1.5 border-b border-slate-100 px-6 py-4 ${className}`}
      {...props}
    />
  );
}

export function CardTitle({ className = "", ...props }) {
  return (
    <h2
      className={`text-xl font-semibold leading-none tracking-tight ${className}`}
      {...props}
    />
  );
}

export function CardContent({ className = "", ...props }) {
  return (
    <div
      className={`px-6 py-4 ${className}`}
      {...props}
    />
  );
}