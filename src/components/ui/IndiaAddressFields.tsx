"use client";
import { useState, useRef, useEffect } from "react";

interface AutocompleteInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
}

function AutocompleteInput({ label, value, onChange, options, placeholder, required }: AutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    onChange(val);
    if (val.length >= 2) {
      const filtered = options.filter((o) => o.toLowerCase().includes(val.toLowerCase())).slice(0, 8);
      setSuggestions(filtered);
      setOpen(filtered.length > 0);
    } else {
      setOpen(false);
    }
  }

  function handleSelect(item: string) {
    onChange(item);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        className="input"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
      />
      {open && (
        <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
          {suggestions.map((s) => (
            <li
              key={s}
              onMouseDown={() => handleSelect(s)}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-sky-50 hover:text-sky-700"
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface IndiaAddressFieldsProps {
  state: string;
  city: string;
  address: string;
  onStateChange: (val: string) => void;
  onCityChange: (val: string) => void;
  onAddressChange: (val: string) => void;
}

import { INDIA_STATES, INDIA_CITIES } from "@/lib/indiaData";

export default function IndiaAddressFields({
  state, city, address, onStateChange, onCityChange, onAddressChange,
}: IndiaAddressFieldsProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <input
          className="input"
          placeholder="Street / House No."
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
        />
      </div>
      <AutocompleteInput
        label="State"
        value={state}
        onChange={onStateChange}
        options={INDIA_STATES}
        placeholder="Type state name..."
      />
      <AutocompleteInput
        label="City"
        value={city}
        onChange={onCityChange}
        options={INDIA_CITIES}
        placeholder="Type city name..."
      />
    </>
  );
}
