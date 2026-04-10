"use client";

interface BadgeMockupProps {
  status: string;
  label?: string;
  clickable?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function BadgeMockup({ status, label, clickable = true, size = "md" }: BadgeMockupProps) {
  const statusColors: Record<string, string> = {
    active: "bg-green-500 text-white border-green-600",
    inactive: "bg-gray-400 text-white border-gray-500",
    pending: "bg-yellow-500 text-white border-yellow-600",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <div className="flex items-center justify-center py-10 px-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 min-h-[140px]">
      <span
        className={`inline-block rounded-full border-2 font-semibold shadow-sm transition-all ${
          statusColors[status.toLowerCase()] || statusColors.active
        } ${sizes[size]} ${clickable ? "cursor-pointer hover:scale-105 hover:shadow-md" : "opacity-80"}`}
      >
        {label || status}
      </span>
    </div>
  );
}
