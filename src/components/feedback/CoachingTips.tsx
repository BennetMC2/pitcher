import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PriorityImprovement } from "@/types/feedback.types";
import { Zap, TrendingUp, CheckCircle2, Target } from "lucide-react";

const categoryConfig = {
  verbal: { label: "Verbal", color: "bg-blue-100 text-blue-700" },
  structure: { label: "Structure", color: "bg-purple-100 text-purple-700" },
  body_language: { label: "Body Language", color: "bg-green-100 text-green-700" },
  overall: { label: "Overall", color: "bg-orange-100 text-orange-700" },
} as const;

const impactConfig = {
  high: { icon: Zap, label: "High impact", color: "text-red-500" },
  medium: { icon: TrendingUp, label: "Medium impact", color: "text-yellow-500" },
  low: { icon: Target, label: "Low impact", color: "text-muted-foreground" },
} as const;

interface CoachingTipsProps {
  strengths: string[];
  improvements: PriorityImprovement[];
}

export function CoachingTips({ strengths, improvements }: CoachingTipsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Strengths */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-green-800">What you did well</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {strengths.map((s, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
              <p className="text-sm">{s}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Priority improvements */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Priority improvements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {improvements.map((imp, i) => {
            const catKey = imp.category?.toLowerCase() as keyof typeof categoryConfig;
            const impKey = imp.impact?.toLowerCase() as keyof typeof impactConfig;
            const cat = categoryConfig[catKey] ?? categoryConfig.overall;
            const impact = impactConfig[impKey] ?? impactConfig.medium;
            const ImpactIcon = impact.icon;
            return (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <ImpactIcon className={`h-3.5 w-3.5 shrink-0 ${impact.color}`} />
                  <Badge variant="secondary" className={`text-xs ${cat.color}`}>
                    {cat.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{impact.label}</span>
                </div>
                <p className="text-sm pl-5">{imp.tip}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
