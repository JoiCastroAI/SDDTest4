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

type RevenueChartProps = {
  companies: Company[];
};

export default function RevenueChart({ companies }: RevenueChartProps) {
  const data = companies
    .slice()
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map((c) => ({
      name: c.name.split(" ")[0],
      revenue: c.revenue,
    }));

  return (
    <div className="chart-card">
      <h3 className="chart-title">Top 5 Companies by Revenue</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#666" }}
            axisLine={{ stroke: "rgba(0,0,0,0.1)" }}
            tickLine={{ stroke: "rgba(0,0,0,0.1)" }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#666" }}
            axisLine={{ stroke: "rgba(0,0,0,0.1)" }}
            tickLine={{ stroke: "rgba(0,0,0,0.1)" }}
            tickFormatter={(v: number) => `€${(v / 1000000).toFixed(1)}M`}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
            contentStyle={{ borderRadius: 8, border: "1px solid rgba(0,0,0,0.1)" }}
          />
          <Bar dataKey="revenue" fill="#5a6745" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
