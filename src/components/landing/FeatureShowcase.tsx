import { Check, X } from "lucide-react";

const features = [
  { name: "Verbal delivery analysis", free: true, credit: true },
  { name: "Story structure breakdown", free: true, credit: true },
  { name: "Confidence score & grade", free: true, credit: true },
  { name: "Priority coaching tips", free: true, credit: true },
  { name: "Recording time", free: "2 min", credit: "5 min" },
  { name: "Body language analysis", free: false, credit: true },
  { name: "AI-rewritten script", free: false, credit: true },
];

export function FeatureShowcase() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Free vs Credit pitches
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Go deeper with credits.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-xl border">
          <div className="grid grid-cols-3 gap-0 border-b bg-muted/50 px-4 py-3 text-sm font-semibold">
            <span>Feature</span>
            <span className="text-center">Free</span>
            <span className="text-center">Credit</span>
          </div>
          {features.map((f) => (
            <div key={f.name} className="grid grid-cols-3 gap-0 border-b last:border-0 px-4 py-3 text-sm">
              <span>{f.name}</span>
              <span className="flex justify-center">
                {f.free === true ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : f.free === false ? (
                  <X className="h-4 w-4 text-muted-foreground/40" />
                ) : (
                  <span className="text-muted-foreground">{f.free}</span>
                )}
              </span>
              <span className="flex justify-center">
                {f.credit === true ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <span className="text-muted-foreground">{f.credit}</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
