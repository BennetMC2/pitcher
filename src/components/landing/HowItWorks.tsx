import { Video, Cpu, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Video,
    step: "01",
    title: "Record your pitch",
    description:
      "Hit record and deliver your 60-second elevator pitch. Our AI watches your delivery and body language in real-time.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI analyzes everything",
    description:
      "Claude AI dissects your verbal delivery, story structure (problem→solution→traction→ask), pacing, filler words, and body language.",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Get actionable feedback",
    description:
      "Receive a confidence score, grade, your top strengths, and prioritized coaching tips to improve before the real thing.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            From recording to coaching in minutes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No scheduling. No waiting. Just pitch, learn, and improve.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.step} className="relative">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <step.icon className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                    Step {step.step}
                  </span>
                  <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
