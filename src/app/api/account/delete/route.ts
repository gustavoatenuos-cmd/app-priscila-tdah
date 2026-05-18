import { NextResponse } from "next/server";

/**
 * POST /api/account/delete
 *
 * Registers an account deletion request (LGPD art. 18, VI). The actual hard
 * delete must run server-side using SUPABASE_SERVICE_ROLE_KEY (admin SDK)
 * because RLS prevents a user from deleting auth.users from the client.
 *
 * For now this endpoint:
 *   1. Validates the body
 *   2. Logs the request
 *   3. Returns 202 Accepted so the frontend can sign the user out
 *
 * TODO: implement the cron job / scheduled function that:
 *   - sends a confirmation e-mail via Resend
 *   - waits 7 days (cool-off)
 *   - deletes from public.* tables (cascades from auth.users)
 *   - calls supabaseAdmin.auth.admin.deleteUser(user_id)
 *   - keeps fiscal records as required by Brazilian law
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, email } = body ?? {};

    if (!user_id || !email) {
      return NextResponse.json(
        { error: "user_id e email são obrigatórios." },
        { status: 400 }
      );
    }

    // TODO: persist into a `deletion_requests` table once the migration ships
    console.log("[deletion-request]", { user_id, email, ts: new Date().toISOString() });

    return NextResponse.json(
      {
        ok: true,
        message:
          "Pedido de exclusão registrado. Você receberá um e-mail de confirmação em breve.",
      },
      { status: 202 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Erro desconhecido" },
      { status: 500 }
    );
  }
}
