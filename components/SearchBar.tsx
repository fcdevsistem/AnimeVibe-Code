'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Buscar anime por nome, gênero ou ano..." }: SearchBarProps) {
  return (
    <div id="animevibe-search-bar" className="w-full max-w-2xl mx-auto mb-10 group relative z-30">
      {/* Background Neon Glow Effect (active when focused/typed) */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-pink-500 via-violet-600 to-cyan-500 rounded-2xl opacity-15 blur-lg transition-all duration-300 group-hover:opacity-30 ${
          value ? 'opacity-40 scale-102' : ''
        }`} 
      />

      <div className="relative flex items-center bg-[#111126]/80 backdrop-blur-md rounded-2xl border border-white/5 group-hover:border-pink-500/30 transition-all duration-300 focus-within:border-pink-500/60 focus-within:shadow-[0_0_20px_rgba(236,72,153,0.15)]">
        {/* Left Side Search Icon */}
        <div className="pl-5 pr-3 flex items-center pointer-events-none">
          <Search 
            className={`w-5 h-5 transition-colors duration-300 ${
              value ? 'text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]' : 'text-slate-400'
            }`} 
          />
        </div>

        {/* Input */}
        <input
          id="search-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full py-4.5 pr-12 text-white bg-transparent outline-none placeholder:text-slate-500 font-medium text-base font-body tracking-wide"
        />

        {/* Right Side Clear Button */}
        {value && (
          <button
            id="clear-search-btn"
            type="button"
            onClick={() => onChange('')}
            className="absolute right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-200"
            title="Limpar busca"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Decorative tiny tech line in margin */}
      <div className="absolute -bottom-2 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-pink-500/20 to-transparent scale-x-50 group-focus-within:scale-x-100 transition-transform duration-500" />
    </div>
  );
}
