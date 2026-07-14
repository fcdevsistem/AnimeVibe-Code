import React from 'react';
import Navbar from '@/components/Navbar';
import UserManagement from '@/components/UserManagement';

export default function AdminUsersPage() {
  return (
    <main className="min-h-screen relative bg-[#050510] overflow-hidden flex flex-col pb-24">
      {/* Background decorations */}
      <div 
        className="fixed inset-0 z-0 opacity-10 mix-blend-luminosity bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&q=80&w=1920&h=1080')" }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-t from-[#050510] via-[#0a0a1f]/80 to-[#0a0a1f]/30" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-pink-600/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      <Navbar />

      <div className="relative z-10 flex-1">
        <UserManagement />
      </div>
    </main>
  );
}
