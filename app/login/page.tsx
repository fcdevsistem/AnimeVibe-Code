import React from 'react';
import AuthForm from '@/components/AuthForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="min-h-screen relative flex items-center justify-center bg-[#050510] overflow-hidden">
      {/* Background decorations */}
      <div 
        className="absolute inset-0 z-0 opacity-20 mix-blend-luminosity bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&q=80&w=1920&h=1080')" }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#050510] via-[#0a0a1f]/90 to-[#0a0a1f]/50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-600/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full px-4">
        <div className="flex justify-center mb-8">
          <Link href="/" className="font-title text-3xl font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
            AnimeVibe
          </Link>
        </div>
        <AuthForm />
      </div>
    </main>
  );
}
