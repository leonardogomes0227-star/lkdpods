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
