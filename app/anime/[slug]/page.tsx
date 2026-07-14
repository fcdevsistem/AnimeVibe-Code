import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Play, Star, Plus, Share2, Clock } from 'lucide-react';
import { notFound } from 'next/navigation';
import ExpandableDescription from '@/components/ExpandableDescription';
import { getAnimes } from '@/lib/animes';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const mockSynopsis = "A jornada épica de um herói improvável em um mundo onde o impossível é a realidade. Testemunhe batalhas incriveis...";
const fullSynopsis = "A jornada épica de um herói improvável em um mundo onde o impossível é a realidade. Testemunhe batalhas incriveis, amizades forjadas no calor do combate e um mistério que pode mudar o destino de toda a humanidade.<br/><br/>Em meio ao caos de um sistema fragmentado, novos poderes surgem para desafiar a ordem estabelecida. Os protagonistas devem não apenas superar forças inimagináveis, mas também confrontar os demônios dentro de si mesmos.";

export default async function AnimeDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const animesList = await getAnimes();
  const anime = animesList.find((a) => String(a.slug) === slug);

  if (!anime) {
    notFound();
  }

  return (
    <main className="relative min-h-screen bg-[#050510] pb-24">
      {/* Background Hero Map */}
      <div className="absolute top-0 left-0 w-full h-[60vh] overflow-hidden opacity-30">
        <Image 
          src={anime.imageUrl}
          alt="Background"
          fill
          className="object-cover blur-3xl scale-125"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050510]/80 to-[#050510]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-12 pt-12 md:pt-24">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-pink-500 font-bold tracking-widest uppercase mb-8 md:mb-12 hover:text-cyan-400 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </Link>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          {/* Main Cover Art */}
          <div className="w-full md:w-1/3 max-w-[350px] mx-auto md:mx-0 shrink-0">
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden neon-border-box group">
              <Image 
                src={anime.imageUrl}
                alt={anime.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050510]/80 via-transparent" />
              <div className="absolute bottom-4 left-0 w-full flex justify-center gap-3">
                 <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded border border-white/10 flex items-center gap-1.5 shadow-xl">
                   <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                   <span className="font-title font-bold text-white leading-none">{anime.rating}</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 mt-4 md:mt-0 w-full">
            <div className="flex flex-wrap items-center gap-3 mb-4">
               {anime.isNew && (
                  <span className="px-3 py-1 rounded text-xs font-black uppercase tracking-widest bg-pink-500 text-white shadow-[0_0_10px_rgba(236,72,153,0.5)]">
                    Novo
                  </span>
                )}
                {anime.isFeatured && (
                  <span className="px-3 py-1 rounded text-xs font-black uppercase tracking-widest bg-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                    Destaque
                  </span>
                )}
                <span className="px-3 py-1 rounded bg-[#111126] border border-white/10 text-xs font-bold text-slate-300 uppercase">
                  {anime.audio}
                </span>
                <span className="px-3 py-1 rounded bg-[#111126] border border-white/10 text-xs font-bold text-white uppercase">
                  {anime.quality}
                </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black font-title tracking-tight text-white mb-4 leading-tight drop-shadow-md">
              {anime.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-400 uppercase tracking-wider mb-8">
               <span className="flex items-center gap-1">
                 <Clock className="w-4 h-4" /> {anime.year}
               </span>
               <span className="w-1.5 h-1.5 bg-slate-600 rounded-full" />
               <span>{anime.type}</span>
               <span className="w-1.5 h-1.5 bg-slate-600 rounded-full" />
               <span>{anime.ratingCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} Avaliações</span>
            </div>

            <div className="bg-[#111126]/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
              <h3 className="text-cyan-400 font-bold uppercase tracking-widest mb-2 text-sm">Sinopse</h3>
              <ExpandableDescription summary={mockSynopsis} fullText={fullSynopsis} />
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-8 md:mt-12">
              <button className="group relative w-full sm:w-auto flex flex-1 sm:flex-none items-center justify-center gap-3 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 px-8 py-4 rounded-xl font-title text-[16px] font-black tracking-widest uppercase text-white shadow-[0_0_20px_rgba(236,72,153,0.3)] outline-none transition-all transform active:scale-95 border border-pink-500/50">
                <Play className="w-5 h-5 fill-current" />
                <span>Assistir</span>
              </button>
              
              <button className="w-full sm:w-auto flex flex-1 sm:flex-none items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#111126] border border-white/10 font-bold uppercase tracking-widest text-slate-300 hover:bg-white/5 hover:text-white transition-all">
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Minha</span> Lista
              </button>

              <button className="p-4 rounded-xl bg-[#111126] border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white transition-all ml-auto sm:ml-0 shadow-lg">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </main>
  );
}
