"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";

function getRequiredString(formData: FormData, field: string) {
  const value = formData.get(field);

  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  return value.trim();
}

function redirectWithMessage(
  type: "error" | "success",
  message: string,
): never {
  const params = new URLSearchParams({
    type,
    message,
  });

  redirect(`/?${params.toString()}`);
}

export async function signUp(formData: FormData) {
  const email = getRequiredString(formData, "email");
  const password = getRequiredString(formData, "password");

  if (!email || !password) {
    redirectWithMessage(
      "error",
      "Email and password are required.",
    );
  }

  if (password.length < 8) {
    redirectWithMessage(
      "error",
      "Password must contain at least 8 characters.",
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    throw new Error("Missing NEXT_PUBLIC_SITE_URL");
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    redirectWithMessage("error", error.message);
  }

  revalidatePath("/", "layout");

  if (data.session) {
    redirect("/");
  }

  redirectWithMessage(
    "success",
    "Account created. Check your email to confirm your account.",
  );
}

export async function signIn(formData: FormData) {
  const email = getRequiredString(formData, "email");
  const password = getRequiredString(formData, "password");

  if (!email || !password) {
    redirectWithMessage(
      "error",
      "Email and password are required.",
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirectWithMessage("error", error.message);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut({
    scope: "local",
  });

  if (error) {
    redirectWithMessage("error", error.message);
  }

  revalidatePath("/", "layout");
  redirect("/");
}