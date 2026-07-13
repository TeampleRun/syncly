import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/shared/lib/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const rawNext = searchParams.get('next') ?? '/workspaces';
  let next = '/workspaces';
  try {
    const parsed = new URL(rawNext, origin);
    if (parsed.origin === origin) next = parsed.pathname + parsed.search;
  } catch {
    // invalid URL, keep default
  }

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      if (!data.user.email) {
        return NextResponse.redirect(`${origin}/login?error=email_missing`);
      }
      const meta = data.user.user_metadata ?? {};
      const realName =
        [meta.full_name, meta.name, meta.user_name].find((n) => n && n !== '-') ??
        data.user.email.split('@')[0];

      const { error: upsertError } = await supabase.from('profiles').upsert(
        {
          id: data.user.id,
          email: data.user.email,
          real_name: realName,
          avatar_url: meta.avatar_url ?? null,
        },
        { onConflict: 'id', ignoreDuplicates: true },
      );

      if (upsertError) {
        return NextResponse.redirect(`${origin}/login?error=auth_failed`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
