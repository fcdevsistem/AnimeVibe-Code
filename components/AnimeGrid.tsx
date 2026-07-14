'use client';
import React, { useState, useEffect, useTransition } from 'react';
import { Play, Star, Search, Trash, Plus, X, Loader2, Pencil } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

import SearchBar from './SearchBar';
import ImageUpload from './ImageUpload';
import { addAnime, deleteAnime, updateAnime } from '@/lib/animes';

import { supabase } from '@/lib/supabase';

export interface Anime {
  id: string;
  slug?: string;
  title: string;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  year: string;
  type: string;
  audio: 'Dublado' | 'Legendado' | string;
  quality: '4K' | 'HD' | 'SD' | string;
  isNew?: boolean;
  isFeatured?: boolean;
}

const presetImages = [
  { name: 'Neon Samurai', url: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&q=80&w=300&h=450' },
  { name: 'Mecha Core', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=300&h=450' },
  { name: 'Retro Skyline', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=300&h=450' },
  { name: 'Oracle Girl', url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=300&h=450' },
];

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      {/* Card Image Skeleton */}
      <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-slate-800 border border-white/5">
         <div className="absolute inset-0 bg-slate-700/50" />
      </div>

      {/* Info Skeleton */}
      <div className="flex flex-col gap-2 mt-1">
        <div className="h-5 bg-slate-700/50 rounded-md w-3/4" />
        <div className="flex items-center gap-2">
          <div className="h-3 bg-slate-700/50 rounded-md w-10" />
          <div className="w-1 h-1 bg-slate-700/50 rounded-full" />
          <div className="h-3 bg-slate-700/50 rounded-md w-16" />
        </div>
      </div>
    </div>
  );
}

export default function AnimeGrid({ initialAnimes = [] }: { initialAnimes?: Anime[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Auth state
  const [userRole, setUserRole] = useState<'admin' | 'member' | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Dynamic anime list using initial data from server
  const [animes, setAnimes] = useState<Anime[]>(initialAnimes);
  
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
        setUserRole(data?.role as 'admin' | 'member');
      } else {
        setUserRole(null);
      }
      setIsAuthLoading(false);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
        setUserRole(data?.role as 'admin' | 'member');
      } else {
        setUserRole(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Synchronize when initialAnimes prop changes (e.g. Server Action revalidates page)
  useEffect(() => {
    if (initialAnimes.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnimes(initialAnimes);
      if (typeof window !== 'undefined') {
        localStorage.setItem('animevibe_custom_list', JSON.stringify(initialAnimes));
      }
    }
  }, [initialAnimes]);
  
  // Form states for creating a new anime
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newTitle, setNewTitle] = useState('');
  const [newYear, setNewYear] = useState('2024');
  const [newType, setNewType] = useState('Ação');
  const [newAudio, setNewAudio] = useState<'Dublado' | 'Legendado' | string>('Dublado');
  const [newQuality, setNewQuality] = useState<'4K' | 'HD' | 'SD' | string>('4K');
  const [newRating, setNewRating] = useState('4.8');
  const [newIsNew, setNewIsNew] = useState(true);
  const [newIsFeatured, setNewIsFeatured] = useState(false);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [customImageUrl, setCustomImageUrl] = useState('');

  const openCreateModal = () => {
    setIsEditMode(false);
    setEditingId(null);
    setNewTitle('');
    setNewYear('2024');
    setNewType('Ação');
    setNewAudio('Dublado');
    setNewQuality('4K');
    setNewRating('4.8');
    setNewIsNew(true);
    setNewIsFeatured(false);
    setSelectedImgIndex(0);
    setCustomImageUrl('');
    setIsCreateOpen(true);
  };

  const openEditModal = (anime: Anime) => {
    setIsEditMode(true);
    setEditingId(anime.id);
    setNewTitle(anime.title);
    setNewYear(anime.year);
    setNewType(anime.type);
    setNewAudio(anime.audio);
    setNewQuality(anime.quality);
    setNewRating(anime.rating.toString());
    setNewIsNew(anime.isNew || false);
    setNewIsFeatured(anime.isFeatured || false);
    
    // Find preset image index or default to -1 if custom
    const imgIndex = presetImages.findIndex(img => img.url === anime.imageUrl);
    setSelectedImgIndex(imgIndex !== -1 ? imgIndex : -1);
    setCustomImageUrl(imgIndex === -1 ? anime.imageUrl : '');
    
    setIsCreateOpen(true);
  };

  // Logical functions for CRUD supporting live database persistence
  const handleCrieAnime = async (novoAnime: Anime) => {
    let updatedList: Anime[] = [];
    
    // Optimistic local UI and localStorage update
    setAnimes((prev) => {
      updatedList = [novoAnime, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('animevibe_custom_list', JSON.stringify(updatedList));
      }
      return updatedList;
    });

    toast.success('Anime Adicionado', {
      description: `"${novoAnime.title}" foi adicionado com sucesso à Neo-Tokyo!`,
    });

    startTransition(async () => {
      const res = await addAnime(novoAnime);
      if (!res.success) {
        console.error('Falha ao sincronizar novo anime no banco:', res.error);
        toast.error('Erro de sincronização', {
          description: 'Não foi possível salvar o clone no servidor remoto, mas salvamos localmente.',
        });
      }
    });
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [animeToDelete, setAnimeToDelete] = useState<Anime | null>(null);

  const confirmDelete = (anime: Anime) => {
    setAnimeToDelete(anime);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!animeToDelete) return;
    
    const id = animeToDelete.id;
    const animeTitle = animeToDelete.title;
    
    setIsDeleteModalOpen(false);
    setAnimeToDelete(null);

    let updatedList: Anime[] = [];

    // Optimistic local UI and localStorage update
    setAnimes((prev) => {
      updatedList = prev.filter((anime) => anime.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('animevibe_custom_list', JSON.stringify(updatedList));
      }
      return updatedList;
    });

    toast.success('Anime Removido', {
      description: `"${animeTitle}" foi deletado da lista.`,
    });

    startTransition(async () => {
      const res = await deleteAnime(id);
      if (!res.success) {
        console.error('Falha ao deletar anime da base de dados:', res.error);
        toast.error('Erro de sincronização', {
          description: 'Não foi possível persistir a exclusão no servidor remoto, mas removemos localmente.',
        });
      }
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('Erro de Validação', { description: 'Por favor, insira o título do anime.' });
      return;
    }

    const generatedSlug = newTitle
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const animeData: Partial<Anime> = {
      slug: generatedSlug || 'anime-customizado',
      title: newTitle.trim(),
      imageUrl: customImageUrl || presetImages[selectedImgIndex]?.url || '',
      rating: parseFloat(newRating) || 4.5,
      year: newYear,
      type: newType,
      audio: newAudio,
      quality: newQuality,
      isNew: newIsNew,
      isFeatured: newIsFeatured,
    };

    if (isEditMode && editingId) {
      // Edit mode
      let updatedList: Anime[] = [];
      setAnimes((prev) => {
        updatedList = prev.map((anime) => 
          anime.id === editingId ? { ...anime, ...animeData } : anime
        );
        if (typeof window !== 'undefined') {
          localStorage.setItem('animevibe_custom_list', JSON.stringify(updatedList));
        }
        return updatedList;
      });

      toast.success('Anime Atualizado', {
        description: `"${newTitle}" foi atualizado com sucesso!`,
      });

      startTransition(async () => {
        const res = await updateAnime(editingId, animeData);
        if (!res.success) {
          console.error('Falha ao atualizar anime no banco:', res.error);
          toast.error('Erro de sincronização', {
            description: 'Não foi possível atualizar no servidor remoto, mas salvamos localmente.',
          });
        }
      });
    } else {
      // Create mode
      const novoAnime: Anime = {
        id: Date.now().toString(),
        ratingCount: Math.floor(Math.random() * 50) + 1,
        ...animeData,
      } as Anime;
      handleCrieAnime(novoAnime);
    }

    // Close Modal
    setIsCreateOpen(false);
  };

  // Filter animes array based on search term (uses dynamic animes state)
  const filteredAnimes = animes.filter((anime) => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return true;
    return (
      anime.title.toLowerCase().includes(term) ||
      anime.type.toLowerCase().includes(term) ||
      anime.year.toLowerCase().includes(term) ||
      anime.audio.toLowerCase().includes(term)
    );
  });

  if (isAuthLoading) {
    return (
      <section id="animevibe-grid-section" className="relative z-20 mx-auto px-6 md:px-12 py-24 max-w-[1280px]">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
        </div>
      </section>
    );
  }

  if (!userRole) {
    return (
      <section id="animevibe-grid-section" className="relative z-20 mx-auto px-6 md:px-12 py-24 max-w-[1280px]">
        <div className="flex flex-col justify-center items-center h-64 gap-6 bg-slate-900/50 rounded-3xl border border-white/10 p-12 text-center">
          <h2 className="text-3xl font-black font-title tracking-tight text-white">
            Acesso Restrito
          </h2>
          <p className="text-slate-400 font-medium">Faça login para visualizar e explorar o catálogo de animes.</p>
          <a href="/login" className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-violet-600 text-white font-title text-sm font-bold tracking-widest uppercase hover:scale-105 transition-all shadow-lg">
            Ir para Login
          </a>
        </div>
      </section>
    );
  }

  return (
    <section id="animevibe-grid-section" className="relative z-20 mx-auto px-6 md:px-12 py-24 max-w-[1280px]">
      {/* Search Bar Component */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black font-title tracking-tight text-white mb-2">
            Alta em <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">Neo-Tokyo</span>
          </h2>
          <p className="text-slate-400 font-medium">Os títulos mais quentes da temporada atual.</p>
        </div>
        
        {/* Adicionar Anime button to open Modal */}
        {userRole === 'admin' && (
          <button 
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white font-title font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:scale-105 active:scale-95 duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Adicionar Anime
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
          ))
        ) : filteredAnimes.length > 0 ? (
          filteredAnimes.map((anime) => (
            <div key={anime.id} className="group relative flex flex-col gap-3">
              <Link href={`/anime/${anime.slug || anime.id}`} className="block">
                {/* Card Image Container */}
                <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-slate-800 border border-white/5 transition-all duration-300 group-hover:border-pink-500/50 group-hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] group-hover:-translate-y-2">
                  <Image 
                    src={anime.imageUrl} 
                    alt={anime.title} 
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent opacity-80" />
                  <div className="absolute inset-0 bg-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay" />
                  
                  {/* Top Left Badges: Novo / Destaque */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10">
                    {anime.isNew && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-pink-500 text-white shadow-[0_0_10px_rgba(236,72,153,0.5)]">
                        Novo
                      </span>
                    )}
                    {anime.isFeatured && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                        Destaque
                      </span>
                    )}
                  </div>

                  {/* Bottom right rating */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 z-20 group/rating cursor-help">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold text-white leading-none">{anime.rating}</span>

                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 right-0 px-2 py-1.5 bg-[#111126] border border-white/10 text-[10px] text-slate-300 font-body font-bold normal-case tracking-normal rounded-md opacity-0 pointer-events-none group-hover/rating:opacity-100 transition-all duration-300 whitespace-nowrap shadow-xl">
                      {anime.ratingCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} avaliações
                      {/* Tooltip Arrow */}
                      <div className="absolute -bottom-1 right-3 w-2 h-2 bg-[#111126] border-b border-r border-white/10 rotate-45"></div>
                    </div>
                  </div>

                  {/* Bottom Left Badges: Dublado/Legendado + Quality */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 z-10">
                    <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-slate-300 uppercase">
                      {anime.audio}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase">
                      {anime.quality}
                    </span>
                  </div>

                  {/* Hover action button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <div className="w-12 h-12 bg-white text-pink-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] transform scale-50 group-hover:scale-100 transition-transform duration-300">
                      <Play className="w-5 h-5 fill-current ml-1" />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Actions container */}
              {userRole === 'admin' && (
                <div className="absolute top-3 right-3 flex flex-col gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {/* Edit button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openEditModal(anime);
                    }}
                    className="p-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all shadow-xl cursor-pointer"
                    title="Editar Anime"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      confirmDelete(anime);
                    }}
                    className="p-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-slate-400 hover:text-red-500 hover:bg-red-500/20 hover:border-red-500/50 transition-all shadow-xl cursor-pointer"
                    title="Excluir Anime"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Info */}
              <div className="flex flex-col gap-1">
                <h3 className="font-title font-bold text-white text-lg leading-tight truncate group-hover:text-pink-400 transition-colors">
                  {anime.title}
                </h3>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <span>{anime.year}</span>
                  <span className="w-1 h-1 bg-slate-500 rounded-full" />
                  <span>{anime.type}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center flex flex-col items-center justify-center bg-[#111126]/40 backdrop-blur-md rounded-3xl border border-white/5 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center mb-5 shadow-[0_0_15px_rgba(236,72,153,0.1)]">
              <Search className="w-7 h-7 text-pink-500" />
            </div>
            <h3 className="text-xl font-black font-title text-white mb-2">Nenhum anime encontrado</h3>
            <p className="text-slate-400 mb-8 max-w-md text-sm leading-relaxed px-6">
              Não encontramos resultados correspondentes a &ldquo;<span className="text-cyan-400 font-bold">{searchQuery}</span>&rdquo;. Refine seu termo de busca por título, ano ou formato.
            </p>
            <button 
              onClick={() => setSearchQuery('')}
              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 rounded-xl font-title text-xs font-black tracking-widest uppercase text-white shadow-lg shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              Limpar Filtro
            </button>
          </div>
        )}
      </div>
      
      {/* Mobile view all */}
      <button className="sm:hidden mt-8 w-full py-4 text-sm font-bold text-pink-500 uppercase tracking-widest border border-pink-500/20 rounded-xl hover:bg-pink-500/10 transition-colors">
        Ver todos
      </button>

      {/* Creation Modal */}
      {isCreateOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsCreateOpen(false)}
            className="fixed inset-0 z-40 bg-[#050510]/80 backdrop-blur-md transition-opacity"
          />

          {/* Modal Container */}
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 p-4 max-h-[90vh] overflow-y-auto">
            <div className="relative bg-[#111126] p-8 md:p-10 rounded-3xl anime-card-glow border border-white/5">
              
              <button
                onClick={() => setIsCreateOpen(false)}
                className="absolute right-6 top-6 text-slate-500 transition-colors hover:text-pink-500"
              >
                <X className="h-6 w-6" />
              </button>

              <h2 className="mb-2 font-title text-2xl md:text-3xl font-black uppercase tracking-wider text-white">
                {isEditMode ? 'Editar Obra' : 'Adicionar Nova Obra'}
              </h2>
              <p className="mb-6 text-sm text-slate-400 font-medium">
                {isEditMode ? 'Edite as informações desta obra na rede AnimeVibe.' : 'Insira as informações técnicas para transmitir um novo título na rede AnimeVibe.'}
              </p>

              <form onSubmit={handleFormSubmit} className="space-y-5">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Título do Anime</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ghost in the Shell 2050"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-[#0a0a1f] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-slate-700 outline-none focus:border-pink-500/40 transition-colors text-sm font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Genre / Type */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Gênero / Tipo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Cyberpunk, Ação"
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      className="w-full bg-[#0a0a1f] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-slate-700 outline-none focus:border-pink-500/40 transition-colors text-sm font-semibold"
                    />
                  </div>

                  {/* Year */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Ano de Lançamento</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 2024"
                      value={newYear}
                      onChange={(e) => setNewYear(e.target.value)}
                      className="w-full bg-[#0a0a1f] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-slate-700 outline-none focus:border-pink-500/40 transition-colors text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* Audio */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Áudio</label>
                    <select
                      value={newAudio}
                      onChange={(e) => setNewAudio(e.target.value as 'Dublado' | 'Legendado')}
                      className="w-full bg-[#0a0a1f] border border-white/5 rounded-xl px-3 py-3 text-white outline-none focus:border-pink-500/40 transition-colors text-sm font-semibold"
                    >
                      <option value="Dublado" className="bg-[#111126]">Dublado</option>
                      <option value="Legendado" className="bg-[#111126]">Legendado</option>
                    </select>
                  </div>

                  {/* Quality */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Qualidade</label>
                    <select
                      value={newQuality}
                      onChange={(e) => setNewQuality(e.target.value as '4K' | 'HD' | 'SD')}
                      className="w-full bg-[#0a0a1f] border border-white/5 rounded-xl px-3 py-3 text-white outline-none focus:border-pink-500/40 transition-colors text-sm font-semibold"
                    >
                      <option value="4K" className="bg-[#111126]">4K Ultra</option>
                      <option value="HD" className="bg-[#111126]">Full HD</option>
                      <option value="SD" className="bg-[#111126]">Padrão SD</option>
                    </select>
                  </div>

                  {/* Rating */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Nota Coral (1-5)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      required
                      value={newRating}
                      onChange={(e) => setNewRating(e.target.value)}
                      className="w-full bg-[#0a0a1f] border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-pink-500/40 transition-colors text-sm font-semibold"
                    />
                  </div>
                </div>

                {/* Sub-tags */}
                <div className="flex items-center gap-6 py-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox"
                      checked={newIsNew}
                      onChange={(e) => setNewIsNew(e.target.checked)}
                      className="rounded border-white/15 bg-[#0a0a1f] text-pink-500 focus:ring-0 w-4 h-4 accent-pink-500 cursor-pointer"
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors">Marcar como Novo</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox"
                      checked={newIsFeatured}
                      onChange={(e) => setNewIsFeatured(e.target.checked)}
                      className="rounded border-white/15 bg-[#0a0a1f] text-cyan-400 focus:ring-0 w-4 h-4 accent-cyan-400 cursor-pointer"
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors">Marcar como Destaque</span>
                  </label>
                </div>

                {/* Visual Art Presets & Upload */}
                <div className="space-y-4">
                  <ImageUpload 
                    currentImageUrl={customImageUrl} 
                    onUploadSuccess={(url) => {
                      setCustomImageUrl(url);
                      setSelectedImgIndex(-1);
                    }} 
                  />

                  <div className="space-y-2.5 mt-4">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Ou escolha uma Arte de Capa (Preset)</label>
                    <div className="grid grid-cols-4 gap-3">
                      {presetImages.map((img, index) => (
                        <button
                          key={img.name}
                          type="button"
                          onClick={() => {
                            setSelectedImgIndex(index);
                            setCustomImageUrl('');
                          }}
                          className={`group relative aspect-[2/3] w-full rounded-xl overflow-hidden border transition-all duration-300 ${
                            selectedImgIndex === index 
                              ? 'border-pink-500 scale-102 ring-2 ring-pink-500/30' 
                              : 'border-white/5 opacity-50 hover:opacity-100 hover:border-white/20'
                          }`}
                        >
                        <Image
                          src={img.url}
                          alt={img.name}
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-center font-bold text-[8px] uppercase tracking-wide text-white truncate px-1">
                          {img.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                </div>

                {/* Submit Container */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 py-4.5 rounded-xl font-title text-sm font-black tracking-widest uppercase text-white shadow-lg shadow-pink-500/20 hover:scale-102 active:scale-95 transition-all outline-none"
                >
                  {isEditMode ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isEditMode ? 'Salvar Alterações' : 'Transmitir Obra'}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] animate-in fade-in duration-200" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="fixed left-[50%] top-[50%] z-[100] grid w-full max-w-sm translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-red-500/10 rounded-2xl animate-in zoom-in-95 fade-in duration-200">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <Trash className="w-6 h-6 text-red-500" />
              </div>
              <h2 className="font-title text-xl font-bold text-white">Excluir Anime?</h2>
              <p className="text-sm text-slate-400">
                Tem certeza que deseja excluir <span className="font-bold text-white">{animeToDelete?.title}</span> da sua lista? Esta ação não pode ser desfeita.
              </p>
            </div>
            
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white font-medium text-sm hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={executeDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-sm transition-colors shadow-lg shadow-red-600/20"
              >
                Excluir
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
