'use client';

import React, { useState, useRef } from 'react';
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  currentImageUrl?: string;
}

export default function ImageUpload({ onUploadSuccess, currentImageUrl }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Arquivo inválido', { description: 'Por favor, selecione uma imagem.' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Arquivo muito grande', { description: 'A imagem deve ter no máximo 5MB.' });
      return;
    }

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('capas-animes')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('capas-animes')
        .getPublicUrl(filePath);

      onUploadSuccess(publicUrl);
      toast.success('Upload concluído', { description: 'A imagem foi carregada com sucesso.' });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error('Erro no upload', { description: error.message || 'Não foi possível enviar a imagem.' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Capa do Anime (Upload)</label>
      
      <div className="flex items-center gap-4">
        {currentImageUrl ? (
          <div className="relative w-20 h-28 rounded-lg overflow-hidden border border-white/10 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={currentImageUrl} alt="Capa atual" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-20 h-28 rounded-lg border border-dashed border-white/20 bg-white/5 flex items-center justify-center shrink-0">
            <ImageIcon className="w-6 h-6 text-slate-500" />
          </div>
        )}
        
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 py-3 px-4 rounded-xl font-title text-sm font-black tracking-widest uppercase text-white shadow-lg shadow-pink-500/20 hover:scale-102 active:scale-95 transition-all outline-none disabled:opacity-50 disabled:pointer-events-none"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {isUploading ? 'Enviando...' : 'Selecionar Imagem'}
          </button>
          <p className="text-[10px] text-slate-500 mt-2 text-center">JPG, PNG ou WEBP (Max. 5MB)</p>
        </div>
      </div>
    </div>
  );
}
