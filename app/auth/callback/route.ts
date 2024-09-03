import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { type CookieOptions, createServerClient } from '@supabase/ssr'
import { checkAuthorExists } from '@/app/login/actions';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';

    if (code) {
        const cookieStore = cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieStore.set({ name, value, ...options });
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.delete({ name, ...options });
                    },
                },
            }
        );

        const { error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
            console.error('Error exchanging code for session:', error);
            return NextResponse.redirect(`${origin}/login?message=Could not login with provider`);
        }

        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            await checkAuthorExists(user);
            return NextResponse.redirect(`${origin}${next}`);
        } else {
            console.error('User not found after OAuth exchange');
            return NextResponse.redirect(`${origin}/login?message=User not found`);
        }
    }

    console.error('No code found in the request');
    return NextResponse.redirect(`${origin}/login?message=No authorization code found`);
}
