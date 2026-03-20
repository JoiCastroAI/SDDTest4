import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Company } from "../../types/company";
import { formatCurrency } from "../../utils/format";

type ProfitEvolutionChartProps = {
  companies: Company[];
};

export default function ProfitEvolutionChart({ companies }: ProfitEvolutionChartProps) {
  const top10 = [...companies]
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 10)
    .map((c) => ({ name: c.name, profit: c.profit }));

  return (
    <div className="chart-card">
      <h3 className="chart-title">Top Companies by Profit</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={top10}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: "#666" }}
            axisLine={{ stroke: "rgba(0,0,0,0.1)" }}
            tickLine={{ stroke: "rgba(0,0,0,0.1)" }}
            interval={0}
            angle={-25}
            textAnchor="end"
            height={80}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#666" }}
            axisLine={{ stroke: "rgba(0,0,0,0.1)" }}
            tickLine={{ stroke: "rgba(0,0,0,0.1)" }}
            tickFormatter={(v: number) => `€${(v / 1000000).toFixed(1)}M`}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(Number(value)), "Profit"]}
            contentStyle={{ borderRadius: 8, border: "1px solid rgba(0,0,0,0.1)" }}
          />
          <Bar dataKey="profit" fill="#5a6745" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
