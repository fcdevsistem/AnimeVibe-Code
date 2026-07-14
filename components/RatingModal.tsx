'use client';

import React, { useState } from 'react';
import { Star, MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function RatingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || isSubmitting) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success('Avaliação Registrada', {
        description: 'Obrigado por fortalecer a comunidade AnimeVibe!',
      });
      setTimeout(() => {
        // Reset and close after showing success
        setIsOpen(false);
        setTimeout(() => {
          setRating(0);
          setHoverRating(0);
          setComment('');
          setIsSubmitted(false);
        }, 300); // Wait for modal close
      }, 2000);
    }, 1500);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative flex items-center gap-3 bg-slate-800/50 px-6 py-4 font-title text-[16px] font-bold tracking-widest text-slate-400 transition-all duration-300 border border-white/5 hover:border-pink-500/50 hover:text-white outline-none rounded-xl hover:shadow-lg hover:shadow-pink-500/10"
      >
        <Star className="w-5 h-5 transition-colors group-hover:text-pink-500" />
        <span>AVALIAR</span>

        {/* Tooltip */}
        <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-2 bg-[#111126] border border-white/10 text-xs text-slate-300 font-body normal-case tracking-normal rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-xl z-50">
          Como foi sua experiência com este anime?
          {/* Tooltip Arrow */}
          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#111126] border-b border-r border-white/10 rotate-45"></span>
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => !isSubmitted && setIsOpen(false)}
            className="fixed inset-0 z-40 bg-[#050510]/80 backdrop-blur-sm transition-opacity"
          />

          {/* Modal */}
          <div
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-4"
          >
            <div className="relative bg-[#111126] p-10 rounded-3xl anime-card-glow neon-border-box">

              {isSubmitted ? (
                <div 
                  className="flex flex-col items-center justify-center py-12 text-center transition-all"
                >
                  <div className="mb-6 rounded-full bg-pink-500/10 p-4 neon-glow">
                    <Star className="h-12 w-12 text-pink-500 fill-pink-500" />
                  </div>
                  <h2 className="font-title text-3xl font-black uppercase tracking-widest text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                    Avaliação Registrada
                  </h2>
                  <p className="mt-2 text-slate-400 font-medium font-body">
                    Obrigado por fortalecer a comunidade AnimeVibe!
                  </p>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute right-6 top-6 text-slate-500 transition-colors hover:text-pink-500"
                  >
                    <X className="h-6 w-6" />
                  </button>

                  <h2 className="mb-2 font-title text-3xl font-black uppercase tracking-wider text-white">
                    Sua Avaliação
                  </h2>
                  <p className="mb-8 text-sm text-slate-400 font-medium">
                    O que você achou dessa obra? Deixe sua nota e comentários abaixo.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    {/* Star Rating Selection */}
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="group relative p-2 outline-none"
                          >
                            <Star
                              className={`h-10 w-10 transition-all duration-300 ${
                                (hoverRating || rating) >= star
                                  ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.5)] scale-110'
                                  : 'text-slate-700 group-hover:text-yellow-400/50'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <div className="font-title text-lg tracking-widest text-cyan-400 h-6 uppercase font-black">
                        {rating === 1 && "Terrível"}
                        {rating === 2 && "Ruim"}
                        {rating === 3 && "Mediano"}
                        {rating === 4 && "Muito Bom"}
                        {rating === 5 && "Obra de Arte"}
                      </div>
                    </div>

                    {/* Comment Area */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="flex items-center gap-2 font-title font-bold tracking-wider text-slate-300 uppercase text-sm">
                          <MessageSquare className="h-4 w-4" /> Comentários
                        </label>
                        <span className="text-xs text-slate-500 font-medium">Opcional</span>
                      </div>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="O que você achou dessa vibe?"
                        className="min-h-[120px] w-full resize-none bg-[#0a0a1f] border border-white/5 rounded-xl p-4 text-slate-300 placeholder:text-slate-700 outline-none transition-colors focus:border-pink-500/50 font-medium"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={rating === 0 || isSubmitting}
                      className="group relative flex w-full items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 py-4 rounded-xl font-title text-sm font-black tracking-widest uppercase text-white shadow-lg shadow-pink-500/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Enviando...</span>
                        </>
                      ) : (
                        <>
                          {rating > 0 && <Send className="h-4 w-4 mr-1" />}
                          <span>Publicar Avaliação</span>
                          {!rating && <span className="absolute right-4 text-xs normal-case tracking-normal text-white/50">(Selecione a nota)</span>}
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
