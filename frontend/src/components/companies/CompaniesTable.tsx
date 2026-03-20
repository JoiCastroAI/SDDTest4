import { Button, Form, Table } from "react-bootstrap";
import { Pencil, Trash } from "react-bootstrap-icons";

import type { Company } from "../../types/company";
import { formatCurrency, formatNumber } from "../../utils/format";

type CompaniesTableProps = {
  companies: Company[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
};

const CompaniesTable: React.FC<CompaniesTableProps> = ({
  companies,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
}) => {
  const allSelected =
    companies.length > 0 && companies.every((c) => selectedIds.has(c.id));

  return (
    <Table responsive hover className="companies-table" data-testid="companies-table">
      <thead>
        <tr>
          <th style={{ width: 40 }}>
            <Form.Check
              type="checkbox"
              checked={allSelected}
              onChange={onToggleSelectAll}
              data-testid="select-all-checkbox"
              aria-label="Select all companies"
            />
          </th>
          <th>Name</th>
          <th>Address</th>
          <th>Revenue</th>
          <th>Expenses</th>
          <th>Profit</th>
          <th>Employees</th>
          <th>Clients</th>
          <th style={{ width: 100 }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {companies.map((company) => {
          const address = [company.city, company.state]
            .filter(Boolean)
            .join(", ");
          return (
            <tr key={company.id}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedIds.has(company.id)}
                  onChange={() => onToggleSelect(company.id)}
                  data-testid={`row-checkbox-${company.id}`}
                  aria-label={`Select ${company.name}`}
                />
              </td>
              <td style={{ fontWeight: 500 }}>{company.name}</td>
              <td className="text-secondary-custom">{address || "—"}</td>
              <td>{formatCurrency(company.revenue)}</td>
              <td>{formatCurrency(company.expenses)}</td>
              <td className="profit-cell">{formatCurrency(company.profit)}</td>
              <td>{formatNumber(company.employees)}</td>
              <td>{formatNumber(company.clients)}</td>
              <td>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => onEdit(company)}
                  data-testid={`edit-btn-${company.id}`}
                  aria-label={`Edit ${company.name}`}
                  className="p-1"
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => onDelete(company)}
                  data-testid={`delete-btn-${company.id}`}
                  aria-label={`Delete ${company.name}`}
                  className="p-1 text-danger"
                >
                  <Trash size={16} />
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default CompaniesTable;
