import type { Company } from "./company";

export type KpiTotals = {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  totalEmployees: number;
  totalClients: number;
};

export function computeKpiTotals(companies: Company[]): KpiTotals {
  return companies.reduce(
    (acc, company) => ({
      totalRevenue: acc.totalRevenue + company.revenue,
      totalExpenses: acc.totalExpenses + company.expenses,
      netProfit: acc.netProfit + company.profit,
      totalEmployees: acc.totalEmployees + company.employees,
      totalClients: acc.totalClients + company.clients,
    }),
    {
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      totalEmployees: 0,
      totalClients: 0,
    }
  );
}
