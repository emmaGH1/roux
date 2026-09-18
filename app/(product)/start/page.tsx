"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bezel, Eyebrow } from "@/components/ui";

const STEPS = [
  {
    n: "01",
    title: "Create the room",
    body: "You get a five-character code and a link to share.",
  },
  {
    n: "02",
    title: "Drop it in the chat",
    body: "Everyone opens it on their own phone and taps once.",
  },
  {
    n: "03",
    title: "Roux calls the spot",
    body: "One pick, two backups, directions for the whole group.",
  },
];

function GroupGlyph() {
  return (
    <svg viewBox="0 0 320 140" className="h-[140px] w-full" role="img" aria-label="Three friends sharing one fair point.">
      <defs>
        <radialGradient id="halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7c6cf6" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#7c6cf6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="160" cy="76" r="58" fill="url(#halo)" />
      <g stroke="#7c6cf6" strokeWidth="1.4" strokeDasharray="5 6" opacity="0.55">
        <line x1="60" y1="36" x2="160" y2="76" />
        <line x1="64" y1="118" x2="160" y2="76" />
        <line x1="262" y1="62" x2="160" y2="76" />
      </g>
      <circle cx="160" cy="76" r="18" fill="#7c6cf6" opacity="0.14" />
      <circle cx="160" cy="76" r="10" fill="#7c6cf6" stroke="#fff" strokeWidth="3" />
      <circle cx="160" cy="76" r="3.5" fill="#fff" />
      {[
        { x: 60, y: 36 },
        { x: 64, y: 118 },
        { x: 262, y: 62 },
      ].map((p) => (
        <g key={`${p.x}-${p.y}`}>
          <circle cx={p.x} cy={p.y} r="17" fill="#0c0c10" opacity="0.06" />
          <circle cx={p.x} cy={p.y} r="8" fill="#0c0c10" stroke="#fff" strokeWidth="3" />
        </g>
      ))}
    </svg>
  );
}

export default function StartPage() {
  const router = useRouter();
  const [code, setCode] = useState<string | null>(null);
  const [link, setLink] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [join, setJoin] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    /* Accept the bare code — or a pasted full link, which we strip. */
    const raw = join.trim().toUpperCase();
    const m = raw.match(/([A-Z2-9]{5})(?!.*[A-Z2-9])/);
    if (!m) {
      setJoinError("That doesn’t look like a meetup code — 5 characters, like 2V78S.");
      return;
    }
    setJoining(true);
    setJoinError(null);
    router.push(`/m/${m[1]}`);
  }

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
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Couldn't reach the clipboard — copy the link manually.");
    }
  }

  async function handleShare() {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({
          title: "Roux — where are we meeting?",
          text: "Tap once and Roux picks the fair middle.",
          url: link,
        });
      } catch {
        /* user dismissed the sheet — nothing to fix */
      }
    } else {
      void handleCopy();
    }
  }

  /* ── After the room exists ── */
  if (code) {
    return (
      <div className="pt-10">
        <Eyebrow>ROOM IS OPEN</Eyebrow>
        <h1 className="mt-6 text-[34px] font-semibold leading-[1.05] tracking-[-0.035em]">
          Share this link
        </h1>
        <p className="mt-3 text-[15px] leading-[1.6] text-[var(--gray)]">
          Everyone who opens it drops their spot. No one needs an account.
        </p>

        <Bezel className="mt-8" coreClassName="p-6">
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--gray)]">
            MEETUP CODE
          </span>
          <p className="mt-2 font-[family-name:var(--font-mono)] text-[40px] leading-none tracking-[0.18em] text-[var(--ink)]">
            {code}
          </p>

          <div
            id="share-link"
            className="mt-6 flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-[var(--canvas-soft)] py-1.5 pl-4 pr-1.5"
          >
            <span className="flex-1 truncate text-[13px] text-[var(--ink)]">{link}</span>
            <button
              onClick={handleCopy}
              className={`btn-life shrink-0 rounded-full px-4 py-2 text-[13px] font-medium text-white transition-colors ${
                copied
                  ? "bg-[var(--green)]"
                  : "bg-[var(--violet)] hover:bg-[var(--violet-deep)]"
              }`}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <button
            onClick={handleShare}
            className="btn-life mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[var(--hairline-strong)] text-[15px] font-medium hover:border-[var(--ink)]/25"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M8 11V2.5M8 2.5L4.8 5.7M8 2.5l3.2 3.2M3 10.5v2A1.5 1.5 0 004.5 14h7a1.5 1.5 0 001.5-1.5v-2"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Share invite
          </button>
        </Bezel>

        <Link
          href={`/m/${code}`}
          className="btn-life mt-5 flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--ink)] text-[15px] font-medium text-white hover:bg-black"
        >
          Open this meetup yourself
          <span aria-hidden>→</span>
        </Link>

        <div className="mt-10">
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--gray)]">
            WHAT HAPPENS NEXT
          </span>
          <ul className="mt-4 border-t border-[var(--hairline)]">
            {STEPS.map((s) => (
              <li key={s.n} className="border-b border-[var(--hairline)] py-4">
                <div className="flex items-baseline gap-4">
                  <span className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--violet)]">
                    {s.n}
                  </span>
                  <div>
                    <p className="text-[15px] font-medium">{s.title}</p>
                    <p className="mt-0.5 text-[13px] leading-[1.55] text-[var(--gray)]">
                      {s.body}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-center font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--gray-light)]">
          Rooms live in server memory · gone on restart
        </p>

        {error && <p className="mt-4 text-center text-[13px] text-red-500">{error}</p>}
      </div>
    );
  }

  /* ── Before the room exists ── */
  return (
    <div className="pt-10">
      <Eyebrow>NEW MEETUP</Eyebrow>
      <h1 className="mt-6 text-[38px] font-semibold leading-[1.03] tracking-[-0.04em]">
        Start a meetup
      </h1>
      <p className="mt-3 text-[16px] leading-[1.6] text-[var(--gray)]">
        One button. You&rsquo;ll get a link to share.
      </p>

      <Bezel className="mt-8" coreClassName="px-6 pt-4 pb-6">
        <GroupGlyph />
        <button
          id="btn-create"
          onClick={handleCreate}
          disabled={creating}
          className="btn-life group flex h-[54px] w-full items-center justify-center gap-3 rounded-full bg-[var(--violet)] text-[16px] font-medium text-white shadow-[var(--shadow-violet)] hover:bg-[var(--violet-deep)] disabled:opacity-60"
        >
          {creating ? "Creating…" : "Start a meetup"}
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M3.5 8h9M8.5 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--gray)]">
          <span>No account</span>
          <span className="h-1 w-1 rounded-full bg-[var(--hairline-strong)]" />
          <span>One tap each</span>
          <span className="h-1 w-1 rounded-full bg-[var(--hairline-strong)]" />
          <span>Free forever for friends</span>
        </div>
      </Bezel>

      {error && <p className="mt-4 text-center text-[13px] text-red-500">{error}</p>}

      {/* Join by code — the invite link carries the URL, but a friend who
         only got the 5 characters needs a door too. */}
      <form onSubmit={handleJoin} className="mt-9">
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--gray)]">
          HAVE A CODE?
        </span>
        <div
          id="join-code"
          className="mt-3 flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-[var(--canvas-soft)] py-1.5 pl-5 pr-1.5 focus-within:border-[var(--violet)]"
        >
          <input
            value={join}
            onChange={(e) => setJoin(e.target.value)}
            placeholder="A5C2K"
            aria-label="Meetup code"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            maxLength={40}
            className="h-10 min-w-0 flex-1 bg-transparent font-[family-name:var(--font-mono)] text-[16px] uppercase tracking-[0.22em] text-[var(--ink)] placeholder:text-[var(--gray-light)] focus:outline-none"
          />
          <button
            type="submit"
            disabled={joining || join.trim().length === 0}
            className="btn-life shrink-0 rounded-full bg-[var(--ink)] px-5 py-2.5 text-[13px] font-medium text-white hover:bg-black disabled:opacity-35"
          >
            {joining ? "Joining…" : "Join"}
          </button>
        </div>
        {joinError && <p className="mt-2 pl-5 text-[13px] text-red-500">{joinError}</p>}
      </form>

      <div className="mt-10">
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--gray)]">
          WHAT HAPPENS NEXT
        </span>
        <ul className="mt-4 border-t border-[var(--hairline)]">
          {STEPS.map((s) => (
            <li key={s.n} className="border-b border-[var(--hairline)] py-4">
              <div className="flex items-baseline gap-4">
                <span className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--violet)]">
                  {s.n}
                </span>
                <div>
                  <p className="text-[15px] font-medium">{s.title}</p>
                  <p className="mt-0.5 text-[13px] leading-[1.55] text-[var(--gray)]">
                    {s.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex items-start gap-3 rounded-[18px] border border-[var(--hairline)] bg-[var(--canvas-soft)] p-4">
        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-[var(--violet)] shadow-[var(--shadow-xs)]">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M8 5.5v3.2M8 11h.01"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <circle cx="8" cy="8" r="6.4" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </span>
        <p className="text-[13px] leading-[1.6] text-[var(--gray)]">
          Rooms expire after 24 hours. Nothing is stored about you after the
          pick.
        </p>
      </div>
    </div>
  );
}
