
-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE,
  email TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create blog_posts table with rich content support
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  thumbnail_url TEXT,
  category TEXT NOT NULL,
  tags TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT,
  country TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- RLS Policies for profiles table
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for blog_posts table
CREATE POLICY "Anyone can read published blog posts" ON public.blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can do everything with blog posts" ON public.blog_posts
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for contact_submissions table
CREATE POLICY "Admins can view all contact submissions" ON public.contact_submissions
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can insert contact submissions" ON public.contact_submissions
  FOR INSERT WITH CHECK (true);

-- Create trigger to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, role)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'username',
    new.email,
    CASE 
      WHEN new.raw_user_meta_data ->> 'username' = 'kuasha48' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN new;
END;
$$;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for blog thumbnails
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-thumbnails', 'blog-thumbnails', true);

-- Storage policies for blog thumbnails
CREATE POLICY "Anyone can view blog thumbnails" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-thumbnails');

CREATE POLICY "Admins can upload blog thumbnails" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'blog-thumbnails' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update blog thumbnails" ON storage.objects
  FOR UPDATE USING (bucket_id = 'blog-thumbnails' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete blog thumbnails" ON storage.objects
  FOR DELETE USING (bucket_id = 'blog-thumbnails' AND public.is_admin(auth.uid()));
