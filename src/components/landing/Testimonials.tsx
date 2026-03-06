const testimonials = [
  {
    quote:
      "I used Nailed It 3 days before my YC interview. It caught that I was saying 'um' 23 times in two minutes. Got the interview, got in.",
    author: "Sarah K.",
    role: "Founder, YC W24",
    initials: "SK",
  },
  {
    quote:
      "The story structure analysis was brutal — I had no 'ask' in my pitch. Fixed it in one session. Closed our seed round 2 weeks later.",
    author: "Marcus T.",
    role: "CEO, raised $1.2M",
    initials: "MT",
  },
  {
    quote:
      "I never realized I looked down at my notes 40% of the time. The eye contact score was a wake-up call. My next pitch felt completely different.",
    author: "Priya R.",
    role: "Co-founder, Demo Day finalist",
    initials: "PR",
  },
  {
    quote:
      "Practiced my conference talk opening 4 times. Went from a 62 to an 87. The AI script suggestions were better than my original.",
    author: "Daniel M.",
    role: "CTO, SaaS startup",
    initials: "DM",
  },
  {
    quote:
      "Used the rizz check before a networking event. Turns out I talk way too fast when nervous. The pacing feedback was a game-changer.",
    author: "Aisha L.",
    role: "Product Manager",
    initials: "AL",
  },
  {
    quote:
      "The coaching tips nailed exactly what I needed to fix. Three specific, actionable things. Not generic advice — real feedback on my actual pitch.",
    author: "James W.",
    role: "Sales Director",
    initials: "JW",
  },
];

const stats = [
  { value: "89%", label: "improved by second pitch" },
  { value: "2,000+", label: "pitches analyzed" },
  { value: "< 60s", label: "average analysis time" },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="mx-auto max-w-5xl px-6">
        {/* Stat blocks */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="inline-flex items-center gap-2 rounded-full border bg-background px-5 py-2 shadow-sm"
            >
              <span className="text-xl font-bold text-primary">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Founders who pitched better
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Real results from real people.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
