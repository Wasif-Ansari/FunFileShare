'use client';

export default function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <div className="text-gray-500 text-sm">{label}</div>
      <div className="font-semibold text-lg">{value}</div>
    </div>
  );
}
