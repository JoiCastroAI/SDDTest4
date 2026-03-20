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

type ExpensesVsRevenueChartProps = {
  companies: Company[];
};

export default function ExpensesVsRevenueChart({
  companies,
}: ExpensesVsRevenueChartProps) {
  const data = companies
    .slice()
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 6)
    .map((c) => ({
      name: c.name.split(" ")[0],
      profitMargin: Math.round((c.profit / c.revenue) * 100),
    }));

  return (
    <div className="chart-card">
      <h3 className="chart-title">Profit Margin (%)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis
            type="number"
            tick={{ fontSize: 12, fill: "#666" }}
            axisLine={{ stroke: "rgba(0,0,0,0.1)" }}
            tickLine={{ stroke: "rgba(0,0,0,0.1)" }}
          />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fontSize: 12, fill: "#666" }}
            axisLine={{ stroke: "rgba(0,0,0,0.1)" }}
            tickLine={{ stroke: "rgba(0,0,0,0.1)" }}
            width={90}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, "Profit Margin"]}
            contentStyle={{ borderRadius: 8, border: "1px solid rgba(0,0,0,0.1)" }}
          />
          <Bar dataKey="profitMargin" fill="#5a6745" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
