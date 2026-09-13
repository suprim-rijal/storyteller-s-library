CREATE TYPE public.app_role AS ENUM ('parent', 'teacher', 'learner');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  display_name text NOT NULL DEFAULT 'Family',
  account_type public.app_role NOT NULL DEFAULT 'parent',
  parent_email text,
  learner_avatar text NOT NULL DEFAULT 'yaju',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profiles_display_name_length CHECK (char_length(display_name) BETWEEN 1 AND 80),
  CONSTRAINT profiles_parent_email_length CHECK (parent_email IS NULL OR char_length(parent_email) <= 255)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Families manage their own profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

CREATE TABLE public.parent_controls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  pin_hash text NOT NULL,
  recovery_email text NOT NULL,
  reset_requested_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT parent_controls_email_length CHECK (char_length(recovery_email) BETWEEN 3 AND 255)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.parent_controls TO authenticated;
GRANT ALL ON public.parent_controls TO service_role;
ALTER TABLE public.parent_controls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents manage their own controls" ON public.parent_controls FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.learner_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  learner_name text NOT NULL DEFAULT 'Learner',
  ui_language text NOT NULL DEFAULT 'en',
  avatar_id text NOT NULL DEFAULT 'yaju',
  completed_lessons jsonb NOT NULL DEFAULT '[]'::jsonb,
  mastered_modules jsonb NOT NULL DEFAULT '[]'::jsonb,
  badges jsonb NOT NULL DEFAULT '[]'::jsonb,
  review_due jsonb NOT NULL DEFAULT '[]'::jsonb,
  performance jsonb NOT NULL DEFAULT '{}'::jsonb,
  activity_history jsonb NOT NULL DEFAULT '[]'::jsonb,
  active_module_id text,
  xp integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT learner_progress_ui_language CHECK (ui_language IN ('en', 'ne', 'hi')),
  CONSTRAINT learner_progress_xp_nonnegative CHECK (xp >= 0)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learner_progress TO authenticated;
GRANT ALL ON public.learner_progress TO service_role;
ALTER TABLE public.learner_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Families manage their own learner progress" ON public.learner_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.classrooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_user_id uuid NOT NULL,
  name text NOT NULL,
  join_code text NOT NULL UNIQUE,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT classrooms_name_length CHECK (char_length(name) BETWEEN 1 AND 100),
  CONSTRAINT classrooms_join_code_format CHECK (join_code ~ '^[A-Z0-9]{6}$')
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classrooms TO authenticated;
GRANT ALL ON public.classrooms TO service_role;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers manage their classrooms" ON public.classrooms FOR ALL TO authenticated USING (auth.uid() = teacher_user_id AND public.has_role(auth.uid(), 'teacher')) WITH CHECK (auth.uid() = teacher_user_id AND public.has_role(auth.uid(), 'teacher'));

CREATE TABLE public.classroom_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  learner_user_id uuid NOT NULL,
  parent_email text,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (classroom_id, learner_user_id)
);
GRANT SELECT, INSERT, DELETE ON public.classroom_memberships TO authenticated;
GRANT ALL ON public.classroom_memberships TO service_role;
ALTER TABLE public.classroom_memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Families read their classroom links" ON public.classroom_memberships FOR SELECT TO authenticated USING (auth.uid() = learner_user_id);
CREATE POLICY "Teachers read classroom members" ON public.classroom_memberships FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.classrooms c WHERE c.id = classroom_id AND c.teacher_user_id = auth.uid()));
CREATE POLICY "Families leave classrooms" ON public.classroom_memberships FOR DELETE TO authenticated USING (auth.uid() = learner_user_id);

CREATE OR REPLACE FUNCTION public.join_classroom(_join_code text, _parent_email text DEFAULT NULL)
RETURNS TABLE(classroom_id uuid, classroom_name text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target public.classrooms;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF _join_code !~ '^[A-Z0-9]{6}$' THEN RAISE EXCEPTION 'Invalid classroom code'; END IF;
  SELECT * INTO target FROM public.classrooms WHERE join_code = _join_code AND active = true;
  IF target.id IS NULL THEN RAISE EXCEPTION 'Classroom not found'; END IF;
  INSERT INTO public.classroom_memberships (classroom_id, learner_user_id, parent_email)
  VALUES (target.id, auth.uid(), NULLIF(trim(_parent_email), ''))
  ON CONFLICT (classroom_id, learner_user_id) DO UPDATE SET parent_email = EXCLUDED.parent_email;
  RETURN QUERY SELECT target.id, target.name;
END;
$$;
GRANT EXECUTE ON FUNCTION public.join_classroom(text, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER parent_controls_updated_at BEFORE UPDATE ON public.parent_controls FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER learner_progress_updated_at BEFORE UPDATE ON public.learner_progress FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER classrooms_updated_at BEFORE UPDATE ON public.classrooms FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();