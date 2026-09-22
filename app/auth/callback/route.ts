import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (!code) {
    const errorUrl = new URL("/", requestUrl.origin);

    errorUrl.searchParams.set("type", "error");
    errorUrl.searchParams.set(
      "message",
      "Authentication code is missing.",
    );

    return NextResponse.redirect(errorUrl);
  }

  const supabase = await createClient();

  const { error } =
    await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const errorUrl = new URL("/", requestUrl.origin);

    errorUrl.searchParams.set("type", "error");
    errorUrl.searchParams.set(
      "message",
      "Unable to complete authentication.",
    );

    return NextResponse.redirect(errorUrl);
  }

  const redirectUrl = new URL(next, requestUrl.origin);

  return NextResponse.redirect(redirectUrl);
}