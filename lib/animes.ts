'use server';

import { revalidatePath } from 'next/cache';
import { Anime } from '@/components/AnimeGrid';
import { supabaseAdmin } from './supabase';

export async function getAnimes(): Promise<Anime[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('animes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching animes from Supabase:', error);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      rating: row.rating,
      ratingCount: row.rating_count,
      year: row.year,
      type: row.type,
      imageUrl: row.image_url,
      isNew: row.is_new,
      isFeatured: row.is_featured,
      audio: row.audio,
      quality: row.quality,
    })) as Anime[];
  } catch (error) {
    console.error('Error reading animes from Supabase:', error);
    return [];
  }
}

export async function addAnime(novoAnime: Anime) {
  try {
    const { data: existing } = await supabaseAdmin
      .from('animes')
      .select('id')
      .eq('id', novoAnime.id)
      .maybeSingle();

    if (existing) {
      return { success: false, error: 'Anime já existe' };
    }

    const row = {
      id: novoAnime.id,
      slug: novoAnime.slug,
      title: novoAnime.title,
      rating: novoAnime.rating,
      rating_count: novoAnime.ratingCount,
      year: novoAnime.year,
      type: novoAnime.type,
      image_url: novoAnime.imageUrl,
      is_new: novoAnime.isNew,
      is_featured: novoAnime.isFeatured,
      audio: novoAnime.audio,
      quality: novoAnime.quality,
    };

    const { error } = await supabaseAdmin.from('animes').insert([row]);

    if (error) {
      console.error('Error inserting anime in Supabase:', error);
      return { success: false, error: error.message };
    }

    // Revalidate paths so the UI updates natively on next load
    revalidatePath('/');
    revalidatePath('/anime/[slug]', 'page');

    return { success: true, anime: novoAnime };
  } catch (error: any) {
    console.error('Error writing anime to Supabase:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteAnime(id: string) {
  try {
    const { error } = await supabaseAdmin.from('animes').delete().eq('id', id);

    if (error) {
      console.error('Error deleting anime in Supabase:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/anime/[slug]', 'page');

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting anime from Supabase:', error);
    return { success: false, error: error.message };
  }
}

export async function updateAnime(id: string, updatedAnime: Partial<Anime>) {
  try {
    const row = {
      ...(updatedAnime.slug !== undefined && { slug: updatedAnime.slug }),
      ...(updatedAnime.title !== undefined && { title: updatedAnime.title }),
      ...(updatedAnime.rating !== undefined && { rating: updatedAnime.rating }),
      ...(updatedAnime.ratingCount !== undefined && { rating_count: updatedAnime.ratingCount }),
      ...(updatedAnime.year !== undefined && { year: updatedAnime.year }),
      ...(updatedAnime.type !== undefined && { type: updatedAnime.type }),
      ...(updatedAnime.imageUrl !== undefined && { image_url: updatedAnime.imageUrl }),
      ...(updatedAnime.isNew !== undefined && { is_new: updatedAnime.isNew }),
      ...(updatedAnime.isFeatured !== undefined && { is_featured: updatedAnime.isFeatured }),
      ...(updatedAnime.audio !== undefined && { audio: updatedAnime.audio }),
      ...(updatedAnime.quality !== undefined && { quality: updatedAnime.quality }),
    };

    const { error } = await supabaseAdmin.from('animes').update(row).eq('id', id);

    if (error) {
      console.error('Error updating anime in Supabase:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/anime/[slug]', 'page');

    return { success: true };
  } catch (error: any) {
    console.error('Error updating anime in Supabase:', error);
    return { success: false, error: error.message };
  }
}
