import { Video, Cpu, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Video,
    step: "01",
    title: "Record your pitch",
    description:
      "Hit record. Pitch like it's the real thing. No scripts. No second chances.",
    benefit: "Takes 2 minutes — just like a real elevator pitch",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI analyzes everything",
    description:
      "Our AI rips apart your delivery — filler words, pacing, story gaps, body language. Nothing hides.",
    benefit: "6 dimensions analyzed in under 60 seconds",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Get actionable feedback",
    description:
      "Get your confidence score, a rewritten script, and the 3 things to fix before you walk in that room.",
    benefit: "89% of users improve by their second pitch",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">
            The Process
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            From recording to coaching
            <br />
            <span className="text-muted-foreground">in minutes</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto">
            No scheduling. No waiting. Just pitch, learn, and improve.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.step} className="relative">
              {/* Circuit line connector (horizontal line + teal dot) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 z-10 -translate-y-1/2">
                  <div className="flex items-center gap-0">
                    <div className="h-0.5 w-6 bg-primary/30" />
                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  </div>
                </div>
              )}

              {/* Platform container */}
              <div
                className="platform-light h-full"
                style={{ transform: `translateY(${i * 8}px)` }}
              >
                {/* Card inside platform */}
                <div className="rounded-2xl bg-card clay-shadow p-6 h-full">
                  {/* Illustration placeholder (inset) */}
                  <div className="clay-inset rounded-xl bg-card/50 p-4 mb-5 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <step.icon className="h-7 w-7 text-primary" />
                    </div>
                  </div>

                  {/* Step number */}
                  <span className="text-4xl font-extrabold text-muted-foreground/10">
                    {step.step}
                  </span>

                  {/* Content */}
                  <h3 className="text-xl font-bold mt-2 mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Benefit chip */}
                  <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1.5">
                    <p className="text-xs font-semibold text-primary">
                      {step.benefit}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
