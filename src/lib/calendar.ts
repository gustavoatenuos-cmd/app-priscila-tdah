import { supabase } from "./supabase";

export async function syncTaskToGoogleCalendar(task: { title: string; description?: string }) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.provider_token) return null;

  // Note: provider_token is available if the user logged in with Google via Supabase
  // and it was stored in the session.
  
  const event = {
    'summary': task.title,
    'description': task.description || 'Sincronizado via TDAH Constante',
    'start': {
      'dateTime': new Date().toISOString(),
      'timeZone': 'America/Sao_Paulo',
    },
    'end': {
      'dateTime': new Date(Date.now() + 3600000).toISOString(), // +1h
      'timeZone': 'America/Sao_Paulo',
    },
  };

  try {
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.provider_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (response.ok) {
      console.log('Evento criado no Google Calendar');
      return true;
    }
  } catch (error) {
    console.error('Erro ao sincronizar com Google:', error);
  }
  return false;
}
