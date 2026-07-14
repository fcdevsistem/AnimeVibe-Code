import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050510] text-white">
      <h2 className="text-4xl font-title font-black mb-4 text-pink-500">404 - Não Encontrado</h2>
      <p className="text-slate-400 mb-8 font-body">A página que você procura não existe ou foi removida.</p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-[#111126] border border-white/10 hover:border-pink-500/50 hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-widest"
      >
        Voltar para Home
      </Link>
    </div>
  );
}
