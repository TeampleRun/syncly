import { createClient } from '@/shared/lib/client';

export function useLogout() {
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return { handleLogout };
}
