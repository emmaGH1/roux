import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[var(--canvas)] text-[var(--ink)]">
      <div className="max-w-[420px] text-center">
        <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--gray)]">
          NO TABLE HERE
        </span>
        <h1 className="text-[26px] font-semibold tracking-tight mt-3 mb-2">
          That meetup doesn&rsquo;t exist.
        </h1>
        <p className="text-[15px] text-[var(--gray)] leading-[1.6] mb-7">
          The link may be mistyped, or the meetup has expired. Meetups are
          ephemeral — they live only while the night is young.
        </p>
        <Link
          href="/start"
          className="btn-life inline-block h-12 leading-[3rem] px-7 bg-[var(--violet)] hover:bg-[var(--violet-deep)] text-white text-[15px] font-medium rounded-full"
        >
          Start a meetup
        </Link>
      </div>
    </div>
  );
}
