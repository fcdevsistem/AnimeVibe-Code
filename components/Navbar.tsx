'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function Navbar() {
  const [session, setSession] = useState<any>(null);
  const [role, setRole] = useState<'admin' | 'member' | null>(null);

  useEffect(() => {
    const fetchSessionAndRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
        setRole(data?.role as 'admin' | 'member');
      }
    };
    
    fetchSessionAndRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
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
  };

  return (
    <div className="absolute top-0 left-0 w-full p-8 z-50 flex justify-between items-center">
      <Link href="/" className="font-title text-2xl font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
        AnimeVibe
      </Link>
      
      {session ? (
        <div className="flex items-center gap-4">
          {role === 'admin' && (
            <Link 
              href="/admin/users" 
              className="text-slate-300 font-title text-sm font-bold tracking-widest uppercase hover:text-white transition-colors"
            >
              Usuários
            </Link>
          )}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-title text-sm font-bold tracking-widest uppercase hover:bg-white/10 hover:text-white transition-colors shadow-lg"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      ) : (
        <Link href="/login" className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-title text-sm font-bold tracking-widest uppercase hover:bg-white/10 transition-colors shadow-lg">
          Login
        </Link>
      )}
    </div>
  );
}
