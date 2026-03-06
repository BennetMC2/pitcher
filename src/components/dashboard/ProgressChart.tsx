"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataPoint {
  date: string;
  score: number;
  label: string;
}

interface ProgressChartProps {
  data: DataPoint[];
}

export function ProgressChart({ data }: ProgressChartProps) {
  if (data.length === 0) return null;

  const showChange = data.length >= 2;
  const scoreChange = showChange ? data[data.length - 1].score - data[0].score : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Score over time</CardTitle>
          {showChange && (
            <span className={`text-sm font-semibold ${scoreChange > 0 ? "text-green-600" : scoreChange < 0 ? "text-red-600" : "text-muted-foreground"}`}>
              {scoreChange > 0 ? "+" : ""}{scoreChange} pts
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload?.length) {
                  return (
                    <div className="rounded-lg border bg-background px-3 py-2 shadow-md text-sm">
                      <p className="font-medium">{payload[0].payload.label}</p>
                      <p className="text-muted-foreground">
                        Score:{" "}
                        <span className="font-semibold text-foreground">
                          {payload[0].value}
                        </span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
