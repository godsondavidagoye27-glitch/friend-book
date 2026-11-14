import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams?: { code?: string; next?: string; error?: string };
}) {
  const code = searchParams?.code;

  if (code) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }
  }

  if (searchParams?.error) {
    redirect(`/login?error=${encodeURIComponent(searchParams.error)}`);
  }

  redirect(searchParams?.next ?? '/explore');
}
