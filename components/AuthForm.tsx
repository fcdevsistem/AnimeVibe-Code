'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, LogIn, UserPlus, User } from 'lucide-react';

import { useRouter } from 'next/navigation';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Erro de Validação', { description: 'Preencha todos os campos obrigatórios.' });
      return;
    }

    if (!isLogin) {
      if (!fullName) {
        toast.error('Erro de Validação', { description: 'O campo Nome Completo é obrigatório.' });
        return;
      }
      if (password !== confirmPassword) {
        toast.error('Erro de Validação', { description: 'As senhas não coincidem.' });
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Login bem-sucedido!', { description: 'Bem-vindo de volta à rede AnimeVibe.' });
        router.push('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });
        if (error) throw error;
        toast.success('Cadastro realizado!', { description: 'Verifique seu e-mail para confirmar a conta.' });
        router.push('/');
      }
    } catch (error: any) {
      console.error('Erro na autenticação:', error);
      toast.error('Erro de Autenticação', { description: error.message || 'Ocorreu um erro ao tentar autenticar.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl shadow-pink-500/5">
      <div className="flex flex-col items-center mb-8">
        <h2 className="font-title text-3xl font-black uppercase tracking-wider text-white mb-2">
          {isLogin ? 'Iniciar Sessão' : 'Criar Conta'}
        </h2>
        <p className="text-sm text-slate-400 font-medium text-center">
          {isLogin 
            ? 'Acesse o sistema para transmitir e gerenciar animes.' 
            : 'Junte-se à rede AnimeVibe e gerencie o catálogo.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {!isLogin && (
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Nome Completo</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-11 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all placeholder:text-slate-600"
                placeholder="Seu nome completo"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">E-mail</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-11 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all placeholder:text-slate-600"
              placeholder="seu@email.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Senha</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-11 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all placeholder:text-slate-600"
              placeholder="••••••••"
            />
          </div>
        </div>

        {!isLogin && (
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Confirmar Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-11 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all placeholder:text-slate-600"
                placeholder="••••••••"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 py-4 mt-4 rounded-xl font-title text-sm font-black tracking-widest uppercase text-white shadow-lg shadow-pink-500/20 hover:scale-102 active:scale-95 transition-all outline-none disabled:opacity-50 disabled:pointer-events-none"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isLogin ? (
            <LogIn className="w-5 h-5" />
          ) : (
            <UserPlus className="w-5 h-5" />
          )}
          {isLoading ? 'Processando...' : isLogin ? 'Entrar' : 'Cadastrar'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          {isLogin ? 'Não tem uma conta? ' : 'Já possui uma conta? '}
          <span className="font-bold text-pink-500 hover:text-pink-400">
            {isLogin ? 'Cadastre-se' : 'Faça login'}
          </span>
        </button>
      </div>
    </div>
  );
}
