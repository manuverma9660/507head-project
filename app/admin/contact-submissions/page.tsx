import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

export default async function ContactSubmissionsPage() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await supabase
    .from("staff_profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin" || profile.is_active !== true)
    redirect("/admin/login");
  const { data: messages } = await supabase
    .from("contact_submissions")
    .select("id, name, email, topic, message, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  return (
    <main className="min-h-screen bg-[#f7f3ed] p-6 text-[#29231e] md:p-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin"
          className="mb-6 inline-block text-sm font-semibold text-[#8a4b1f] hover:underline"
        >
          ← Back to Admin Dashboard
        </Link>
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a4b1f]">
            507 HEAD · Inbox
          </p>
          <h1 className="mt-2 text-3xl font-bold">Contact messages</h1>
        </header>
        <div className="space-y-4">
          {(messages ?? []).map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-[#e8dac9] bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap justify-between gap-2">
                <h2 className="font-bold">{item.name}</h2>
                <time className="text-xs text-gray-500">
                  {new Date(item.created_at).toLocaleString("en-IN")}
                </time>
              </div>
              <a
                href={`mailto:${item.email}`}
                className="mt-1 inline-block text-sm text-[#8a4b1f] hover:underline"
              >
                {item.email}
              </a>
              {item.topic && (
                <p className="mt-3 text-sm font-semibold">{item.topic}</p>
              )}
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                {item.message}
              </p>
            </article>
          ))}
          {(!messages || messages.length === 0) && (
            <p className="rounded-2xl bg-white p-8 text-center text-gray-500">
              No contact messages yet.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
