
-- User interests/preferences table
CREATE TABLE public.user_interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interests text[] NOT NULL DEFAULT '{}',
  bio text,
  github_url text,
  linkedin_url text,
  experience_level text DEFAULT 'intermediate',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own interests" ON public.user_interests FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own interests" ON public.user_interests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own interests" ON public.user_interests FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_user_interests_updated_at BEFORE UPDATE ON public.user_interests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
