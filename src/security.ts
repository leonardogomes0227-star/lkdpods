import { supabase } from './supabase';

export async function logSecurityEvent(action: string, details: string) {
  try {
    await supabase.from('audit_logs').insert([
      {
        action,
        details,
        timestamp: Date.now(),
      },
    ]);
  } catch (err) {
    console.error('Erro ao registrar log de segurança:', err);
  }
}

// Higieniza textos contra caracteres maliciosos ou scripts
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>?/gm, '')
    .trim();
}
