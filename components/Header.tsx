import React from 'react';
import { Search, Bell } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-5 bg-[#0a0a1f]/80 backdrop-blur-md border-b border-white/5 transition-all">
      <div className="flex items-center gap-12">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-violet-600 rounded-lg flex items-center justify-center font-black text-xl text-white shadow-lg shadow-pink-500/20 group-hover:shadow-pink-500/40 transition-shadow">
            AV
          </div>
          <span className="text-2xl font-black italic tracking-tighter uppercase text-white font-title">
            AnimeVibe
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-widest text-slate-400">
          <a href="#" className="font-title text-pink-500 hover:text-pink-400 transition-colors relative after:content-[''] after:absolute after:-bottom-6 after:left-0 after:w-full after:h-1 after:bg-pink-500 after:rounded-t-full">
            Comunidade
          </a>
          <a href="#" className="font-title hover:text-white transition-colors relative">
            Temporada
          </a>
          <a href="#" className="font-title hover:text-white transition-colors relative">
            Minha Lista
          </a>
        </nav>
      </div>

      {/* Profile & Actions */}
      <div className="flex items-center gap-6">
        <button className="text-slate-400 hover:text-white transition-colors" aria-label="Search">
          <Search className="w-5 h-5" />
        </button>
        <button className="text-slate-400 hover:text-white transition-colors relative" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_8px_rgba(236,72,153,0.8)]"></span>
        </button>
        
        {/* User Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-white/10 cursor-pointer group">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-white group-hover:text-pink-500 transition-colors font-title">Kai_Nexus</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-pink-500">Premium</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-800 border-2 border-slate-700 overflow-hidden group-hover:border-pink-500 transition-colors relative">
            <Image 
              src="https://picsum.photos/seed/avatar5/150/150" 
              alt="Avatar"
              width={40}
              height={40}
              className="w-full h-full object-cover" 
            />
            {/* Inner glow simulation */}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl"></div>
          </div>
        </div>
      </div>
    </header>
  );
}
