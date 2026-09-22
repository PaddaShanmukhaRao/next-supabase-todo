import { createClient } from "@/app/lib/supabase/server";
import { signIn, signOut, signUp } from "@/app/auth/actions";

type HomePageProps = {
  searchParams: Promise<{
    type?: string;
    message?: string;
  }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center p-6">
        <section className="rounded-xl border p-6">
          <h1 className="text-2xl font-semibold">Todo application</h1>

          <p className="mt-4">You are signed in as:</p>

          <p className="mt-1 font-medium">
            {user.email ?? "Authenticated user"}
          </p>

          <p className="mt-4 text-sm text-gray-600">
            Email and password authentication is working.
          </p>

          <form action={signOut} className="mt-6">
            <button
              type="submit"
              className="rounded-md bg-black px-4 py-2 text-white hover:bg-neutral-800"
            >
              Sign out
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center p-6">
      <section className="rounded-xl border p-6">
        <h1 className="text-2xl font-semibold">Todo application</h1>

        <p className="mt-2 text-sm text-gray-600">
          Sign in or create an account to manage your todos.
        </p>

        {params.message ? (
          <p
            className={`mt-4 rounded-md p-3 text-sm ${
              params.type === "error"
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {params.message}
          </p>
        ) : null}

        <form className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              minLength={8}
              required
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="submit"
              formAction={signIn}
              className="rounded-md bg-black px-4 py-2 text-white hover:bg-neutral-800"
            >
              Sign in
            </button>

            <button
              type="submit"
              formAction={signUp}
              className="rounded-md border px-4 py-2 hover:bg-neutral-100"
            >
              Create account
            </button>
          </div>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-gray-500">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          type="button"
          disabled
          className="w-full rounded-md border px-4 py-2 text-gray-500"
        >
          Continue with Google
        </button>

        <p className="mt-2 text-center text-xs text-gray-500">
          Google authentication will be connected next.
        </p>
      </section>
    </main>
  );
}