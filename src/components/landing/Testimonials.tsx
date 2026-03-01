const testimonials = [
  {
    quote:
      "I used Nailed It 3 days before my YC interview. It caught that I was saying 'um' 23 times in two minutes. Got the interview, got in.",
    author: "Sarah K.",
    role: "Founder, Batch W24",
    initials: "SK",
  },
  {
    quote:
      "The story structure analysis was brutal — I had no 'ask' in my pitch. Fixed it in one session. Closed our seed round 2 weeks later.",
    author: "Marcus T.",
    role: "CEO, SeedRound raised $1.2M",
    initials: "MT",
  },
  {
    quote:
      "I never realized I looked down at my notes 40% of the time. The eye contact score was a wake-up call. My next pitch felt completely different.",
    author: "Priya R.",
    role: "Co-founder, Demo Day finalist",
    initials: "PR",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Founders who pitched better
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Real results from real founders.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.author} className="rounded-2xl border bg-background p-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
