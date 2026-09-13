DROP POLICY "Teachers manage their classrooms" ON public.classrooms;
CREATE POLICY "Teachers manage their classrooms" ON public.classrooms FOR ALL TO authenticated USING (auth.uid() = teacher_user_id) WITH CHECK (auth.uid() = teacher_user_id);
REVOKE ALL ON FUNCTION public.join_classroom(text, text) FROM PUBLIC, anon, authenticated;
DROP FUNCTION public.join_classroom(text, text);
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
DROP FUNCTION public.has_role(uuid, public.app_role);