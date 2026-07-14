'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, ShieldAlert, UserCog, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Profile {
  id: string;
  full_name: string;
  role: 'admin' | 'member';
  created_at: string;
}

export default function UserManagement() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<'admin' | 'member' | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          router.push('/login');
          return;
        }

        const { data: currentUserData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (currentUserData?.role !== 'admin') {
          setCurrentUserRole('member');
          setIsLoading(false);
          return;
        }

        setCurrentUserRole('admin');

        const { data: profilesData, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProfiles(profilesData as Profile[]);
      } catch (error: any) {
        console.error('Error fetching profiles:', error);
        toast.error('Erro ao buscar usuários', { description: error.message });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'member') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setProfiles((prev) => 
        prev.map((profile) => 
          profile.id === userId ? { ...profile, role: newRole } : profile
        )
      );

      toast.success('Perfil atualizado', { description: `A role do usuário foi alterada para ${newRole}.` });
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error('Erro ao atualizar', { description: error.message });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
      </div>
    );
  }

  if (currentUserRole !== 'admin') {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-6 bg-slate-900/50 rounded-3xl border border-white/10 p-12 text-center max-w-2xl mx-auto mt-24">
        <ShieldAlert className="w-16 h-16 text-red-500" />
        <h2 className="text-3xl font-black font-title tracking-tight text-white">
          Acesso Negado
        </h2>
        <p className="text-slate-400 font-medium">Você precisa de privilégios de administrador para acessar esta página.</p>
        <button onClick={() => router.push('/')} className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-violet-600 text-white font-title text-sm font-bold tracking-widest uppercase hover:scale-105 transition-all shadow-lg">
          Voltar ao Início
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-32 px-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
          <UserCog className="w-6 h-6 text-pink-500" />
        </div>
        <div>
          <h1 className="font-title text-3xl font-black uppercase tracking-wider text-white">Gerenciar Usuários</h1>
          <p className="text-slate-400 text-sm">Altere as permissões de acesso dos membros da rede.</p>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-xs font-bold uppercase tracking-widest text-slate-400">
                <th className="px-6 py-4">Usuário</th>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Data de Cadastro</th>
                <th className="px-6 py-4 text-right">Permissão (Role)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {profiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="font-medium text-white">{profile.full_name || 'Usuário sem nome'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                    {profile.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select
                      value={profile.role}
                      onChange={(e) => handleRoleChange(profile.id, e.target.value as 'admin' | 'member')}
                      className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm font-medium text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all cursor-pointer"
                    >
                      <option value="member">Membro</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </td>
                </tr>
              ))}
              {profiles.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
