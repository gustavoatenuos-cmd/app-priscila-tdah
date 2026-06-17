import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
  const isAuthRoute = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register");

  // Protect dashboard routes
  if (isDashboardRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // TODO: Add 7-day trial check here
  if (isDashboardRoute && user) {
     const { data: profile } = await supabase
       .from('profiles')
       .select('trial_ends_at, subscription_status')
       .eq('id', user.id)
       .single();
       
     if (profile) {
       const now = new Date();
       const trialEndsAt = new Date(profile.trial_ends_at);
       const isTrialExpired = now > trialEndsAt;
       const isSubscribed = profile.subscription_status === 'active';
       
       if (isTrialExpired && !isSubscribed && request.nextUrl.pathname !== '/checkout') {
          const url = request.nextUrl.clone();
          url.pathname = "/checkout";
          return NextResponse.redirect(url);
       }
     }
  }

  return supabaseResponse;
}
