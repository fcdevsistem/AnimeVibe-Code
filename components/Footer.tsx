import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full mt-auto p-8 border-t border-white/5 bg-[#0a0a1f] text-center">
      <div className="max-w-[1280px] mx-auto flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2 opacity-50">
          <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-violet-600 rounded flex items-center justify-center font-black text-[10px] text-white">
            AV
          </div>
          <span className="text-sm font-black italic tracking-tighter uppercase text-white font-title">
            AnimeVibe
          </span>
        </div>
        <p className="text-slate-600 text-[10px] uppercase tracking-[0.3em] font-bold">
          Conectando a alma otaku através de cores e código &bull; AnimeVibe 2026
        </p>
      </div>
    </footer>
  );
}
