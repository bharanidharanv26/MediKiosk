import React from 'react';

const colorMap = {
  blue: 'bg-blue-100 text-blue-700 ring-blue-200',
  teal: 'bg-teal-100 text-teal-700 ring-teal-200',
  rose: 'bg-rose-100 text-rose-700 ring-rose-200',
  violet: 'bg-violet-100 text-violet-700 ring-violet-200',
  amber: 'bg-amber-100 text-amber-700 ring-amber-200',
  emerald: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  gray: 'bg-gray-100 text-gray-700 ring-gray-200',
};

const palette = ['blue', 'teal', 'rose', 'violet', 'amber', 'emerald'];

function colorForName(name) {
  if (!name) return 'gray';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return palette[hash % palette.length];
}

function initialsOf(name) {
  if (!name) return '?';
  const cleaned = name.replace(/^Dr\.?\s+/i, '').trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({ name, role = 'patient', color, size = 'md' }) {
  const sizes = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-9 h-9 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-16 h-16 text-lg',
  };
  const tone = colorMap[color || colorForName(name)] || colorMap.gray;
  const shape = role === 'doctor' ? 'rounded-xl' : 'rounded-full';
  const ring = role === 'doctor' ? 'ring-2' : 'ring-1';

  return (
    <div
      className={`${sizes[size]} ${shape} ${tone} ${ring} flex items-center justify-center font-extrabold select-none flex-shrink-0`}
      aria-hidden="true"
    >
      {initialsOf(name)}
    </div>
  );
}
