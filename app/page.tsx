import React from 'react';
import Navbar from '@/components/Navbar';
import RatingModal from '@/components/RatingModal';
import AnimeGrid from '@/components/AnimeGrid';
import ExpandableDescription from '@/components/ExpandableDescription';
import { Play, Plus } from 'lucide-react';
import { getAnimes } from '@/lib/animes';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const animes = await getAnimes();

  return (
    <main className="min-h-screen relative overflow-x-hidden bg-[#050510]">
      {/* Hero Section Container */}
      <div className="relative min-h-[90vh] flex flex-col justify-end">
        {/* Background Anime Cover Simulation with fade overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&q=80&w=1920&h=1080')" }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#050510] via-[#0a0a1f]/80 to-transparent" />
        
        {/* Top Navbar */}
        <Navbar />

        {/* Heavy vignette for neon glow pop effect */}
        <div className="absolute inset-0 z-0 pointer-events-none shadow-[inset_0_0_200px_rgba(5,5,16,1)]" />
        
        {/* Background decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 mx-auto px-12 pt-32 pb-16 w-full max-w-[1280px]">
          <div className="flex flex-col gap-6 md:w-2/3">
            
            <div className="flex items-center gap-4 mb-2">
              <span className="border border-cyan-400 px-3 py-1 font-title text-[13px] font-bold tracking-[2px] text-cyan-400 uppercase rounded-lg bg-[#0a0a1f]/50 backdrop-blur-sm">
                LANÇAMENTO
              </span>
              <span className="font-body text-slate-400 text-sm flex gap-2 items-center font-bold">
                2024 <span className="w-1 h-1 bg-slate-400 rounded-full inline-block" /> Sci-Fi <span className="w-1 h-1 bg-slate-400 rounded-full inline-block" /> Ação
              </span>
            </div>

            <h1 className="font-title text-5xl sm:text-6xl md:text-[5rem] font-black leading-tight tracking-tight text-white drop-shadow-2xl">
              Cyber Nexus: 
              <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">The Final Code</span>
            </h1>
            
            <ExpandableDescription 
              summary="A jornada épica de Kai através de uma Neo-Tóquio fragmentada..."
              fullText="A jornada épica de Kai através de uma Neo-Tóquio fragmentada, caçando memórias corrompidas em uma metrópole que nunca dorme. A linha entre o humano e o sintético está desaparecendo rapidamente através da introdução do vírus Nexus.<br /><br />Para salvar o que resta da humanidade, a equipe Delta liderada por Kai precisará invadir o núcleo do sistema central, enfrentando seus próprios traumas corporativos ao longo do caminho. Será que uma alma artificial ainda pode sonhar?"
            />

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <button className="group relative flex items-center justify-center gap-3 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 px-8 py-4 rounded-xl font-title text-[16px] font-black tracking-widest uppercase text-white shadow-lg shadow-pink-500/20 outline-none transition-all transform active:scale-95">
                <Play className="h-5 w-5 fill-current" />
                <span>ASSISTIR AGORA</span>
              </button>
              
              <button className="flex items-center justify-center p-4 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors rounded-xl font-bold border border-white/5 shadow-lg">
                <Plus className="h-6 w-6" />
              </button>

              {/* This is our interactive Rating Button & Modal */}
              <RatingModal />
            </div>

            {/* Dummy Info Sections */}
            <div className="flex gap-12 mt-16 pt-8 border-t border-white/5">
              <div>
                <p className="text-sm font-title uppercase tracking-widest text-slate-400 mb-1 font-bold">Nota da Comunidade</p>
                <p className="text-3xl font-black text-yellow-400">4.8 <span className="text-lg text-slate-500">/ 5</span></p>
              </div>
              <div>
                <p className="text-sm font-title uppercase tracking-widest text-slate-400 mb-1 font-bold">Estúdio</p>
                <p className="text-xl font-bold text-white">VibeAnimation</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <AnimeGrid initialAnimes={animes} />
    </main>
  );
}
