import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Company } from "../../types/company";

type DistributionChartProps = {
  companies: Company[];
};

const COLORS = ["#5a6745", "#7a8a66", "#9aaa88", "#bacaa9"];

type RevenueRange = {
  name: string;
  value: number;
};

export default function DistributionChart({ companies }: DistributionChartProps) {
  const ranges: RevenueRange[] = [
    { name: "0-2M", value: 0 },
    { name: "2M-4M", value: 0 },
    { name: "4M-6M", value: 0 },
    { name: "6M+", value: 0 },
  ];

  companies.forEach((c) => {
    if (c.revenue < 2000000) ranges[0].value++;
    else if (c.revenue < 4000000) ranges[1].value++;
    else if (c.revenue < 6000000) ranges[2].value++;
    else ranges[3].value++;
  });

  return (
    <div className="chart-card">
      <h3 className="chart-title">Distribution by Revenue</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={ranges}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            nameKey="name"
            label={({ name, value }) =>
              `${name ?? ""}: ${value ?? ""}`
            }
            labelLine={false}
          >
            {ranges.map((_entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [String(value), String(name)]}
            contentStyle={{ borderRadius: 8, border: "1px solid rgba(0,0,0,0.1)" }}
          />
          <Legend
            verticalAlign="bottom"
            formatter={(value) => (
              <span style={{ fontSize: 14 }}>{String(value)}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
