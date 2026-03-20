import { Table } from "react-bootstrap";
import type { Company } from "../../types/company";
import { formatCurrency, formatInteger } from "../../utils/format";

type RankingTableProps = {
  companies: Company[];
};

export default function RankingTable({ companies }: RankingTableProps) {
  const sorted = companies
    .slice()
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 10);

  return (
    <div className="ranking-card">
      <div className="ranking-header">
        <h3 className="chart-title">Full Ranking by Profit</h3>
      </div>
      <div className="ranking-table-wrapper">
        <Table className="ranking-table" hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Company</th>
              <th className="text-end">Revenue</th>
              <th className="text-end">Expenses</th>
              <th className="text-end">Profit</th>
              <th className="text-end">Employees</th>
              <th className="text-end">Clients</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((company, index) => (
              <tr key={company.id}>
                <td>
                  {index < 3 ? (
                    <span className="ranking-badge">{index + 1}</span>
                  ) : (
                    <span className="ranking-number">{index + 1}</span>
                  )}
                </td>
                <td>{company.name}</td>
                <td className="text-end">{formatCurrency(company.revenue)}</td>
                <td className="text-end">{formatCurrency(company.expenses)}</td>
                <td className="text-end ranking-profit">
                  {formatCurrency(company.profit)}
                </td>
                <td className="text-end">{formatInteger(company.employees)}</td>
                <td className="text-end">{formatInteger(company.clients)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
