import { useState, useEffect } from "react";
import type { Company } from "../types/company";
import type { KpiTotals } from "../types/dashboard";
import { computeKpiTotals } from "../types/dashboard";
import { companyService } from "../services/companyService";
import { handleError } from "../utils/format";

type DashboardData = {
  companies: Company[];
  kpiTotals: KpiTotals;
  loading: boolean;
  error: string | null;
};

export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    companies: [],
    kpiTotals: {
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      totalEmployees: 0,
      totalClients: 0,
    },
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const response = await companyService.getAll(1, 100);
        if (cancelled) return;

        const companies = response.items.map((c: Company) => ({
          ...c,
          revenue: Number(c.revenue),
          expenses: Number(c.expenses),
          profit: Number(c.profit),
          employees: Number(c.employees),
          clients: Number(c.clients),
        }));
        const kpiTotals = computeKpiTotals(companies);

        setData({
          companies,
          kpiTotals,
          loading: false,
          error: null,
        });
      } catch (err) {
        if (cancelled) return;
        setData((prev) => ({
          ...prev,
          loading: false,
          error: handleError(err),
        }));
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}
