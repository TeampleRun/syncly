import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/shared/lib/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/workspaces';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const meta = data.user.user_metadata ?? {};
      const realName =
        [meta.full_name, meta.name, meta.user_name].find((n) => n && n !== '-') ??
        data.user.email!.split('@')[0];

      const { error: upsertError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        email: data.user.email!,
        real_name: realName,
        avatar_url: meta.avatar_url ?? null,
      });

      if (upsertError) {
        return NextResponse.redirect(`${origin}/login?error=auth_failed`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
