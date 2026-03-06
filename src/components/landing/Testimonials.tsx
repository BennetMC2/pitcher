const testimonials = [
  {
    quote:
      "I used Nailed It 3 days before my YC interview. It caught that I was saying 'um' 23 times in two minutes. Got the interview, got in.",
    author: "Sarah K.",
    role: "Founder, YC W24",
    initials: "SK",
    highlight: "Got into YC",
  },
  {
    quote:
      "The story structure analysis was brutal — I had no 'ask' in my pitch. Fixed it in one session. Closed our seed round 2 weeks later.",
    author: "Marcus T.",
    role: "CEO, raised $1.2M",
    initials: "MT",
    highlight: "Raised $1.2M",
  },
  {
    quote:
      "I never realized I looked down at my notes 40% of the time. The eye contact score was a wake-up call. My next pitch felt completely different.",
    author: "Priya R.",
    role: "Co-founder, Demo Day finalist",
    initials: "PR",
    highlight: "Demo Day finalist",
  },
  {
    quote:
      "Practiced my conference talk opening 4 times. Went from a 62 to an 87. The AI script suggestions were better than my original.",
    author: "Daniel M.",
    role: "CTO, SaaS startup",
    initials: "DM",
    highlight: "62 → 87 score",
  },
  {
    quote:
      "Used the rizz check before a networking event. Turns out I talk way too fast when nervous. The pacing feedback was a game-changer.",
    author: "Aisha L.",
    role: "Product Manager",
    initials: "AL",
    highlight: "Pacing improved",
  },
  {
    quote:
      "The coaching tips nailed exactly what I needed to fix. Three specific, actionable things. Not generic advice — real feedback on my actual pitch.",
    author: "James W.",
    role: "Sales Director",
    initials: "JW",
    highlight: "Actionable tips",
  },
];

const stats = [
  { value: "89%", label: "improved by second pitch" },
  { value: "2,000+", label: "pitches analyzed" },
  { value: "< 60s", label: "average analysis time" },
];

const vcLogos = ["Y Combinator", "Techstars", "500 Global", "Stanford", "MIT"];

export function Testimonials() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-5xl px-6">
        {/* Circular gauge stats */}
        <div className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl bg-card clay-shadow p-6 flex items-center gap-5"
            >
              {/* Circular display */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full clay-inset bg-card/50">
                <span className="text-2xl font-extrabold text-primary">{stat.value}</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                {/* Decorative measurement markings */}
                <div className="flex gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-1.5 w-4 rounded-full bg-primary/20" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">
            The Wall of Proof
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Founders who pitched better
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Real results from real people.
          </p>
        </div>

        {/* Glass testimonial pods */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.author}
              className="group rounded-3xl bg-card/90 backdrop-blur-sm clay-shadow p-6 transition-all duration-300 hover:-translate-y-1"
            >
              {/* VERIFIED badge */}
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider mb-4">
                Verified
              </span>

              <p className="text-sm leading-relaxed text-foreground/80">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="mt-5 flex items-center gap-3 pt-4 border-t border-border/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary clay-shadow-sm text-secondary-foreground text-xs font-bold">
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

        {/* VC logo bar */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-4">Trusted by founders from</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {vcLogos.map((logo) => (
              <span
                key={logo}
                className="text-sm font-bold text-muted-foreground/50 tracking-wide uppercase"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
