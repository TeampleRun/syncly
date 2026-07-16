import { createClient } from '@/shared/lib/client';

export function useLogout() {
  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } finally {
      window.location.href = '/login';
    }
  };

  return { handleLogout };
}
