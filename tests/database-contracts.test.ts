import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve(
    "supabase/migrations/20261022000000_create_editorial_base_schema.sql",
  ),
  "utf8",
);
const revisions = readFileSync(
  resolve(
    "supabase/migrations/20261023003000_create_article_revisions_and_audit_logs.sql",
  ),
  "utf8",
);
const redirects = readFileSync(
  resolve("supabase/migrations/20261023004000_create_redirects.sql"),
  "utf8",
);
const media = readFileSync(
  resolve(
    "supabase/migrations/20261024020000_create_cloudinary_media_assets.sql",
  ),
  "utf8",
);

describe("database release contracts", () => {
  it("enables RLS and role-scoped policies for editorial articles", () => {
    expect(migration).toContain(
      "alter table public.articles enable row level security",
    );
    expect(migration).toContain("Staff can read permitted editorial articles");
    expect(migration).toContain("Staff can create permitted articles");
    expect(migration).toContain("status = 'draft'");
  });

  it("protects revision previews and audit records for active staff", () => {
    expect(revisions).toContain(
      "alter table public.article_revisions enable row level security",
    );
    expect(revisions).toContain("Active staff can read article revisions");
    expect(revisions).toContain("Active staff can read audit logs");
  });

  it("restricts redirect and media administration", () => {
    expect(redirects).toContain("Administrators manage redirects");
    expect(media).toContain("Admins manage Cloudinary media");
  });
});
