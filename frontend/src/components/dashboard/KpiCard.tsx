import type { Icon } from "react-bootstrap-icons";

type KpiCardProps = {
  label: string;
  value: string;
  icon: Icon;
  iconBgOpacity?: number;
  testId: string;
};

export default function KpiCard({
  label,
  value,
  icon: IconComponent,
  iconBgOpacity = 0.13,
  testId,
}: KpiCardProps) {
  return (
    <div className="kpi-card" data-testid={testId}>
      <div className="kpi-card-content">
        <div
          className="kpi-card-icon"
          style={{
            backgroundColor: `rgba(90, 103, 69, ${iconBgOpacity})`,
          }}
        >
          <IconComponent size={24} color="var(--color-primary)" />
        </div>
        <div className="kpi-card-info">
          <p className="kpi-card-label">{label}</p>
          <p className="kpi-card-value">{value}</p>
        </div>
      </div>
    </div>
  );
}
