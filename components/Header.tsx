'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Bell, LogOut, Menu, X, User as UserIcon, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function Header() {
  const [session, setSession] = useState<any>(null);
  const [role, setRole] = useState<'admin' | 'member' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchSessionAndRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        if (session?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          setRole(data?.role as 'admin' | 'member');
        }
      } catch (err) {
        console.error('Error fetching auth state:', err);
      }
    };
    
    fetchSessionAndRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        setRole(data?.role as 'admin' | 'member');
      } else {
        setRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Desconectado com sucesso.');
    setMobileMenuOpen(false);
  };

  const handleSearchClick = () => {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.focus();
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.location.href = '/#animevibe-search-bar';
    }
  };

  const username = session?.user?.email 
    ? session.user.email.split('@')[0] 
    : 'Visitante';

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0B0C10]/90 backdrop-blur-md border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Left Side: Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-[#B721FF] to-[#00E5FF] rounded-none flex items-center justify-center font-black text-xl text-white shadow-[0_0_15px_rgba(183,33,255,0.5)] group-hover:shadow-[0_0_20px_rgba(0,229,255,0.7)] transition-all">
            AV
          </div>
          <span className="text-2xl font-black italic tracking-wider uppercase text-white font-title">
            Anime<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B721FF] to-[#00E5FF]">Vibe</span>
          </span>
        </Link>

        {/* Center: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-bold uppercase tracking-wider text-[#8B8C9A]">
          <Link href="/" className="font-title text-[#F8F8F8] hover:text-[#B721FF] transition-colors relative py-1 after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-0.5 after:bg-[#B721FF]">
            Comunidade
          </Link>
          <Link href="/" className="font-title hover:text-[#F8F8F8] transition-colors py-1">
            Temporada
          </Link>
          <Link href="/" className="font-title hover:text-[#F8F8F8] transition-colors py-1">
            Minha Lista
          </Link>
          {role === 'admin' && (
            <Link 
              href="/admin/users" 
              className="font-title text-[#00E5FF] hover:text-white transition-colors flex items-center gap-1.5 py-1 px-2.5 bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded-none"
            >
              <Shield className="w-4 h-4 text-[#00E5FF]" />
              Usuários
            </Link>
          )}
        </nav>

        {/* Right Side: Search, Notifications & User Auth */}
        <div className="hidden sm:flex items-center gap-4">
          <button 
            onClick={handleSearchClick}
            className="p-2.5 rounded-none bg-[#181A20] border border-white/10 text-[#8B8C9A] hover:text-white hover:border-[#B721FF] transition-all" 
            aria-label="Buscar Anime"
            title="Buscar Anime"
          >
            <Search className="w-5 h-5" />
          </button>

          <button 
            className="p-2.5 rounded-none bg-[#181A20] border border-white/10 text-[#8B8C9A] hover:text-white hover:border-[#B721FF] transition-all relative" 
            aria-label="Notificações"
            title="Notificações"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#B721FF] rounded-full shadow-[0_0_8px_#B721FF]"></span>
          </button>
          
          <div className="h-6 w-[1px] bg-white/10 mx-1" />

          {/* User Section */}
          {session ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-[#F8F8F8] font-title max-w-[120px] truncate">
                  {username}
                </span>
                <span className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 border ${
                  role === 'admin' 
                    ? 'text-[#00E5FF] border-[#00E5FF]/40 bg-[#00E5FF]/10' 
                    : 'text-[#B721FF] border-[#B721FF]/40 bg-[#B721FF]/10'
                }`}>
                  {role === 'admin' ? 'ADMIN' : 'MEMBRO'}
                </span>
              </div>

              <div className="w-10 h-10 bg-[#181A20] border border-white/10 flex items-center justify-center relative group">
                <UserIcon className="w-5 h-5 text-[#8B8C9A] group-hover:text-white transition-colors" />
              </div>

              <button 
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#181A20] border border-white/10 text-[#8B8C9A] hover:text-red-400 hover:border-red-500/50 font-title text-xs font-bold tracking-wider uppercase transition-all"
                title="Sair da Conta"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="px-5 py-2.5 bg-gradient-to-r from-[#B721FF] to-[#00E5FF] text-white font-title text-sm font-bold tracking-widest uppercase hover:opacity-90 transition-all shadow-[0_0_15px_rgba(183,33,255,0.4)]"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-none bg-[#181A20] border border-white/10 text-white focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#0B0C10] border-b border-white/10 px-6 py-6 flex flex-col gap-5">
          <nav className="flex flex-col gap-4 text-base font-bold uppercase tracking-wider text-[#8B8C9A]">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-title text-[#F8F8F8] hover:text-[#B721FF] transition-colors"
            >
              Comunidade
            </Link>
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-title hover:text-[#F8F8F8] transition-colors"
            >
              Temporada
            </Link>
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-title hover:text-[#F8F8F8] transition-colors"
            >
              Minha Lista
            </Link>
            {role === 'admin' && (
              <Link 
                href="/admin/users" 
                onClick={() => setMobileMenuOpen(false)}
                className="font-title text-[#00E5FF] hover:text-white transition-colors flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Painel Admin (Usuários)
              </Link>
            )}
          </nav>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            {session ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-[#8B8C9A]" />
                    <span className="text-sm font-bold text-[#F8F8F8] font-title">{username}</span>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border ${
                    role === 'admin' ? 'text-[#00E5FF] border-[#00E5FF]/40 bg-[#00E5FF]/10' : 'text-[#B721FF] border-[#B721FF]/40 bg-[#B721FF]/10'
                  }`}>
                    {role === 'admin' ? 'ADMIN' : 'MEMBRO'}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#181A20] border border-white/10 text-red-400 font-title text-sm font-bold tracking-wider uppercase"
                >
                  <LogOut className="w-4 h-4" />
                  Sair da Conta
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 bg-gradient-to-r from-[#B721FF] to-[#00E5FF] text-white font-title text-sm font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(183,33,255,0.4)]"
              >
                Fazer Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

