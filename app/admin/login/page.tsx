import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin Login", robots: { index: false } };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  const { from, error } = await searchParams;
  return (
    <main className="min-h-screen bg-[#F9F8F5] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="text-[10px] tracking-[0.22em] uppercase text-[#1C3A2A] font-semibold mb-3">
            MISKA
          </p>
          <h1 className="font-serif text-[28px] font-light text-[#0A0A0A]">Admin</h1>
        </div>

        <form action={login} className="space-y-5">
          <input type="hidden" name="from" value={from ?? "/admin"} />
          <div>
            <label
              htmlFor="password"
              className="block text-[11px] tracking-[0.14em] uppercase text-[#888] font-semibold mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              required
              className="w-full border-b border-[#E5E2DB] bg-transparent py-3 text-[16px] text-[#0A0A0A] placeholder:text-[#BBB] focus:outline-none focus:border-[#1C3A2A]"
              placeholder="Admin password"
            />
          </div>
          {error && (
            <p className="text-[12px] text-[#B42318]">Incorrect password. Try again.</p>
          )}
          <button
            type="submit"
            className="w-full bg-[#1C3A2A] text-white py-4 text-[11px] tracking-[0.18em] uppercase font-semibold hover:bg-[#152d20]"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}

async function login(formData: FormData) {
  "use server";
  const password = formData.get("password") as string;
  const from = (formData.get("from") as string) || "/admin";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    redirect("/admin/login?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set("miska-admin-session", adminPassword, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  redirect(from);
}
