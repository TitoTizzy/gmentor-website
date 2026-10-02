import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const schema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.email().trim().max(160),
  phone: z.string().trim().min(6).max(40),
  country: z.string().trim().min(2).max(100),
  city: z.string().trim().min(2).max(100),
  projectType: z.string().trim().min(2).max(80),
  description: z.string().trim().max(2500).optional().default(''),
  locale: z.enum(['en', 'fr', 'kr']),
  usesWhatsapp: z.boolean(),
  privacyAccepted: z.literal(true),
  turnstileToken: z.string().optional()
});

async function verifyTurnstile(token: string | undefined, ip: string | undefined) {
  const secret = import.meta.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const result = await response.json() as { success?: boolean };
  return result.success === true;
}

export const POST: APIRoute = async ({ request, clientAddress, redirect }) => {
  const form = await request.formData();
  const parsed = schema.safeParse({
    fullName: form.get('fullName'),
    email: form.get('email'),
    phone: form.get('phone'),
    country: form.get('country'),
    city: form.get('city'),
    projectType: form.get('projectType'),
    description: form.get('description') || '',
    locale: form.get('locale'),
    usesWhatsapp: form.get('usesWhatsapp') === 'true',
    privacyAccepted: form.get('privacyAccepted') === 'true',
    turnstileToken: form.get('cf-turnstile-response') || undefined
  });

  if (!parsed.success) return new Response('Invalid form data', { status: 400 });
  if (!(await verifyTurnstile(parsed.data.turnstileToken, clientAddress))) return new Response('Antispam verification failed', { status: 400 });

  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const serviceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supabaseUrl && serviceKey) {
    const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
    const { error } = await supabase.from('contact_requests').insert({
      full_name: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      country: parsed.data.country,
      city: parsed.data.city,
      project_type: parsed.data.projectType,
      description: parsed.data.description || null,
      market_code: null,
      locale: parsed.data.locale,
      uses_whatsapp: parsed.data.usesWhatsapp,
      privacy_accepted_at: new Date().toISOString(),
      status: 'new'
    });
    if (error) return new Response('Unable to save request', { status: 500 });
  }

  const resendKey = import.meta.env.RESEND_API_KEY;
  const recipient = import.meta.env.CONTACT_EMAIL || import.meta.env.CONTACT_EMAIL_US || import.meta.env.CONTACT_EMAIL_HT;
  if (resendKey && recipient) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Marie Gaëlle Mentor <contact@gaellementor.com>',
        to: [recipient],
        reply_to: parsed.data.email,
        subject: `Nouvelle demande — ${parsed.data.fullName}`,
        text: `${parsed.data.fullName}\n${parsed.data.email}\n${parsed.data.phone}\n${parsed.data.city}, ${parsed.data.country}\n${parsed.data.projectType}\n\n${parsed.data.description}`
      })
    });
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Marie Gaëlle Mentor <contact@gaellementor.com>',
        to: [parsed.data.email],
        subject: parsed.data.locale === 'en' ? 'We received your project inquiry' : 'Nous avons reçu votre demande',
        text: parsed.data.locale === 'en' ? 'Thank you. Your inquiry has been received.' : 'Merci. Votre demande a bien été reçue.'
      })
    });
  }

  return redirect('/contact/success', 303);
};
