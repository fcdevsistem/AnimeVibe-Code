-- -------------------------------------------------------------
-- CONFIGURAÇÃO DE USUÁRIOS E PERFIS
-- -------------------------------------------------------------

-- Criar tabela de perfis
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS para perfis
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Função para obter a role atual sem recursão (Security Definer)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Política para leitura de perfis (usuário lê o próprio perfil ou se for admin)
CREATE POLICY "Usuários podem ver seu próprio perfil ou admins veem todos"
ON public.profiles
FOR SELECT
USING (auth.uid() = id OR public.get_my_role() = 'admin');

-- Política para admins atualizarem perfis
CREATE POLICY "Admins podem atualizar perfis"
ON public.profiles
FOR UPDATE
USING (public.get_my_role() = 'admin');

-- Trigger para criar perfil automaticamente no cadastro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    'member'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Associar a trigger ao evento de insert em auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Criação da tabela animes
CREATE TABLE IF NOT EXISTS public.animes (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    rating NUMERIC DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    year TEXT,
    type TEXT,
    image_url TEXT,
    is_new BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    audio TEXT,
    quality TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.animes ENABLE ROW LEVEL SECURITY;

-- Criar política de visualização pública (Leitura)
CREATE POLICY "Permitir leitura pública" 
ON public.animes 
FOR SELECT 
USING (true);

-- Criar política de inserção (Apenas usuários autenticados ou todos para testes)
-- Obs: Para testes abertos, você pode mudar 'authenticated' para 'true', mas não é recomendado em produção.
CREATE POLICY "Permitir inserção pública para testes"
ON public.animes
FOR INSERT
WITH CHECK (true);

-- Criar política de atualização
CREATE POLICY "Permitir atualização pública para testes"
ON public.animes
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Criar política de deleção
CREATE POLICY "Permitir deleção pública para testes"
ON public.animes
FOR DELETE
USING (true);

-- -------------------------------------------------------------
-- CONFIGURAÇÃO DO BUCKET DE STORAGE "capas-animes"
-- -------------------------------------------------------------

-- Criar o bucket caso não exista
INSERT INTO storage.buckets (id, name, public) 
VALUES ('capas-animes', 'capas-animes', true)
ON CONFLICT (id) DO NOTHING;

-- Habilitar leitura pública para imagens
CREATE POLICY "Permitir visualização pública de imagens"
ON storage.objects
FOR SELECT
USING (bucket_id = 'capas-animes');

-- Habilitar upload público (Apenas para testes - Em produção, restrinja para usuários autenticados)
CREATE POLICY "Permitir upload público de imagens para testes"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'capas-animes');

-- Habilitar deleção de arquivos (Para gerenciar imagens via painel se necessário)
CREATE POLICY "Permitir exclusão pública de imagens para testes"
ON storage.objects
FOR DELETE
USING (bucket_id = 'capas-animes');

