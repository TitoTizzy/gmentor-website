import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServerClient } from './lib/supabase/server';

export const onRequest = defineMiddleware(async (context, next) => {
  const path = context.url.pathname;
  if (!path.startsWith('/admin') || path === '/admin/login' || path === '/admin/mfa') return next();

  const supabase = createSupabaseServerClient(context.request, context.cookies);
  if (!supabase) {
    context.locals.demoMode = true;
    return next();
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return context.redirect('/admin/login');

  const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (assurance?.nextLevel === 'aal2' && assurance.currentLevel !== 'aal2') return context.redirect('/admin/mfa');
  context.locals.user = user;
  return next();
});
