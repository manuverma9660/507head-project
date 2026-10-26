"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { createHash } from "crypto";
import { sendContactEmails } from "@/lib/transactional-email";

type ContactResult = { success: boolean; message: string };

function value(formData: FormData, name: string) {
  const item = formData.get(name);
  return typeof item === "string" ? item.trim() : "";
}

export async function submitContact(formData: FormData): Promise<ContactResult> {
  const name = value(formData, "name");
  const email = value(formData, "email").toLowerCase();
  const topic = value(formData, "topic");
  const message = value(formData, "message");
  const website = value(formData, "website");

  if (website) return { success: true, message: "Thank you." };

  if (name.length < 2 || name.length > 100) {
    return { success: false, message: "कृपया अपना सही नाम लिखें।" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: "कृपया सही ईमेल पता लिखें।" };
  }
  if (message.length < 10 || message.length > 3000) {
    return { success: false, message: "संदेश 10 से 3000 अक्षरों के बीच होना चाहिए।" };
  }

  const supabase = await createClient();
  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const fingerprint = createHash("sha256").update(`${ip}|${requestHeaders.get("user-agent") ?? ""}`).digest("hex");
  const { data: allowed, error: rateLimitError } = await supabase.rpc("allow_contact_submission", { p_fingerprint: fingerprint });
  if (rateLimitError) {
    console.error("Contact rate-limit check failed:", rateLimitError.message);
    return { success: false, message: "Contact inbox ka Supabase setup abhi complete nahi hai. SQL migration run karke phir try karein." };
  }
  if (rateLimitError || !allowed) return { success: false, message: "कृपया कुछ देर बाद फिर प्रयास करें।" };
  const { error } = await supabase.from("contact_submissions").insert({
    name,
    email,
    topic: topic || null,
    message,
  });

  if (!error) {
    try {
      await sendContactEmails({ name, email, topic, message });
    } catch (emailError) {
      // The message is already stored; provider outages must not discard it.
      console.error("Contact email delivery failed:", emailError);
    }
  }

  if (error) {
    console.error("Contact submission failed:", error.message);
    return { success: false, message: "संदेश भेजा नहीं जा सका। कृपया थोड़ी देर बाद कोशिश करें।" };
  }

  return { success: true, message: "धन्यवाद। आपका संदेश संपादकीय टीम तक पहुँच गया है।" };
}
