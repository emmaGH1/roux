"use client";

import { useState } from "react";

export default function StartPage() {
  const [code, setCode] = useState<string | null>(null);
  const [link, setLink] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/meetups", { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setCode(json.code);
      setLink(`${window.location.origin}/m/${json.code}`);
    } catch {
      setError("Couldn't create the meetup. Try again.");
    } finally {
      setCreating(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (code) {
    return (
      <div className="pt-12">
        <h1 className="text-[28px] font-semibold tracking-tight mb-2">
          Share this link
        </h1>
        <p className="text-[15px] text-[var(--gray)] mb-6">
          Everyone who opens it drops their spot on the map. Code:{" "}
          <span className="font-[family-name:var(--font-mono)] text-[var(--ink)]">{code}</span>
        </p>

        <div
          id="share-link"
          className="flex items-center gap-2 border border-[var(--border)] rounded-2xl p-2 pl-4 bg-[var(--canvas-soft)]"
        >
          <span className="flex-1 text-sm truncate text-[var(--ink)]">{link}</span>
          <button
            onClick={handleCopy}
            className="btn-life shrink-0 bg-[var(--violet)] hover:bg-[var(--violet-deep)] text-white text-sm font-medium px-4 py-2.5 rounded-full cursor-pointer"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <a
          href={`/m/${code}`}
          className="mt-6 block text-center text-sm font-medium text-[var(--violet)] hover:text-[var(--violet-deep)] transition-colors"
        >
          Open this meetup yourself →
        </a>
      </div>
    );
  }

  return (
    <div className="pt-12 text-center">
      <h1 className="text-[32px] font-semibold tracking-tight mb-2">Start a meetup</h1>
      <p className="text-[16px] text-[var(--gray)] mb-8">
        One button. You&rsquo;ll get a link to share.
      </p>

      <button
        id="btn-create"
        onClick={handleCreate}
        disabled={creating}
        className="btn-life w-full h-12 bg-[var(--violet)] hover:bg-[var(--violet-deep)] text-white text-[15px] font-medium rounded-full cursor-pointer disabled:opacity-60"
      >
        {creating ? "Creating…" : "Start a meetup"}
      </button>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
    </div>
  );
}
