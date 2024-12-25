"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";
import { Bar, BarChart, Line, LineChart, XAxis, YAxis } from "recharts";

interface GrapProps {
  data: {
    date: string;
    amount: number;
  }[];
}

const chartConfig = {
  amount: {
    label: "Amount",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export default function LineGraph({ data }: GrapProps) {
  return (
    <ChartContainer
      config={{
        amount: {
          label: "Amount",
          color: "hsl(var(--primary))",
        },
      }}
    >
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="var(--color-amount)"
          strokeWidth={2}
        />
      </LineChart>
    </ChartContainer>
  );
}

export function BarGrap({ data }: GrapProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="amount" fill="var(--color-amount)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
