'use client';

import { useState, useRef, useEffect } from 'react';
import { getIcon, getAvailableIconNames } from '@/lib/icon-map';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

const allIcons = getAvailableIconNames().filter(
  name => !['ChevronUp', 'ChevronDown', 'Play', 'X', 'Menu'].includes(name)
);

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = search
    ? allIcons.filter(name => name.toLowerCase().includes(search.toLowerCase()))
    : allIcons;

  const SelectedIcon = getIcon(value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-md border bg-white hover:bg-gray-50 transition-colors w-full text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
          <SelectedIcon className="w-5 h-5 text-gray-700" />
        </div>
        <span className="text-sm text-gray-700 truncate flex-1">{value || 'Selecionar ícone'}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded-xl shadow-xl max-h-[320px] overflow-hidden flex flex-col">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar ícone..."
                className="pl-8 h-9 text-sm"
                autoFocus
              />
            </div>
          </div>
          <div className="overflow-y-auto p-2 grid grid-cols-5 gap-1">
            {filtered.map(name => {
              const Icon = getIcon(name);
              const isSelected = name === value;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => { onChange(name); setOpen(false); setSearch(''); }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                  title={name}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                  <span className={`text-[9px] leading-tight text-center truncate w-full ${isSelected ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                    {name}
                  </span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="col-span-5 text-center text-sm text-gray-400 py-4">Nenhum ícone encontrado</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
