import { Spinner } from "react-bootstrap";
import {
  CurrencyEuro,
  GraphDownArrow,
  GraphUpArrow,
  People,
  PersonPlus,
} from "react-bootstrap-icons";
import KpiCard from "../components/dashboard/KpiCard";
import RevenueChart from "../components/dashboard/RevenueChart";
import ProfitEvolutionChart from "../components/dashboard/ProfitEvolutionChart";
import ExpensesVsRevenueChart from "../components/dashboard/ExpensesVsRevenueChart";
import DistributionChart from "../components/dashboard/DistributionChart";
import RankingTable from "../components/dashboard/RankingTable";
import { useDashboardData } from "../hooks/useDashboardData";
import { formatCurrency, formatInteger } from "../utils/format";

export default function DashboardPage() {
  const { companies, kpiTotals, loading, error } =
    useDashboardData();

  if (loading) {
    return (
      <div className="dashboard-loading" data-testid="dashboard-page">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error" data-testid="dashboard-page">
        <p>{error}</p>
      </div>
    );
  }

  const isEmpty = companies.length === 0;

  return (
    <div className="dashboard" data-testid="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">
          General analysis of companies and key metrics
        </p>
      </div>

      <div className="kpi-grid">
        <KpiCard
          label="Total Revenue"
          value={isEmpty ? "—" : formatCurrency(kpiTotals.totalRevenue)}
          icon={CurrencyEuro}
          iconBgOpacity={0.13}
          testId="kpi-total-revenue"
        />
        <KpiCard
          label="Total Expenses"
          value={isEmpty ? "—" : formatCurrency(kpiTotals.totalExpenses)}
          icon={GraphDownArrow}
          iconBgOpacity={0.13}
          testId="kpi-total-expenses"
        />
        <KpiCard
          label="Net Profit"
          value={isEmpty ? "—" : formatCurrency(kpiTotals.netProfit)}
          icon={GraphUpArrow}
          iconBgOpacity={0.13}
          testId="kpi-net-profit"
        />
        <KpiCard
          label="Total Employees"
          value={isEmpty ? "—" : formatInteger(kpiTotals.totalEmployees)}
          icon={People}
          iconBgOpacity={0.13}
          testId="kpi-total-employees"
        />
        <KpiCard
          label="Total Clients"
          value={isEmpty ? "—" : formatInteger(kpiTotals.totalClients)}
          icon={PersonPlus}
          iconBgOpacity={0.13}
          testId="kpi-total-clients"
        />
      </div>

      {isEmpty ? (
        <div className="dashboard-empty-state">
          <p>
            No companies registered yet. Add your first company to see dashboard
            metrics.
          </p>
        </div>
      ) : (
        <>
          <div className="charts-grid">
            <RevenueChart companies={companies} />
            <DistributionChart companies={companies} />
            <ProfitEvolutionChart companies={companies} />
            <ExpensesVsRevenueChart companies={companies} />
          </div>

          <RankingTable companies={companies} />
        </>
      )}
    </div>
  );
}
