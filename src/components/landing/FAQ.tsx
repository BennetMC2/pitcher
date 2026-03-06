const faqs = [
  {
    q: "How does Nailed It work?",
    a: "Record your pitch on camera, and our AI analyzes your verbal delivery, story structure, and body language. You get a confidence score, coaching tips, and an AI-rewritten script — all in under 60 seconds.",
  },
  {
    q: "Do I need to create an account?",
    a: "No! You can record your first pitch without signing up. Create a free account when you're ready to see your results and track progress over time.",
  },
  {
    q: "What's the difference between free and credit pitches?",
    a: "Free pitches include verbal delivery and story structure analysis, a confidence score, and coaching tips. Credit pitches add body language analysis, an AI-rewritten script, and 5-minute max recording time.",
  },
  {
    q: "Do credits expire?",
    a: "Never. Buy credits when you need them, use them whenever you're ready. No subscriptions, no recurring charges.",
  },
  {
    q: "Is my video stored securely?",
    a: "Yes. Videos are encrypted and stored securely in the cloud. Only you can access your recordings and feedback.",
  },
  {
    q: "What pitch types are supported?",
    a: "Startup pitches, sales pitches, job interviews, conference talks, and more. The AI adapts its feedback to your specific pitch type.",
  },
  {
    q: "Can I compare my pitches over time?",
    a: "Yes! The dashboard tracks your scores over time and lets you compare any two pitches side by side to see exactly what improved.",
  },
  {
    q: "How accurate is the AI feedback?",
    a: "We use Claude (Anthropic's most capable AI) and Whisper (OpenAI's speech recognition) for industry-leading accuracy. 89% of users improve their score by their second pitch.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about Nailed It.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-xl border bg-background px-5 py-4 transition-colors hover:bg-muted/30"
            >
              <summary className="cursor-pointer font-medium text-sm list-none flex items-center justify-between gap-4">
                <span>{faq.q}</span>
                <span className="text-muted-foreground group-open:rotate-180 transition-transform shrink-0">
                  ▾
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
