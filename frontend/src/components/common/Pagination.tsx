import { Form, Pagination as BsPagination } from "react-bootstrap";

type PaginationProps = {
  page: number;
  totalPages: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}) => {
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div
      className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2"
      data-testid="pagination"
    >
      <span className="text-secondary-custom" style={{ fontSize: 14 }}>
        Showing {Math.min(pageSize, total - (page - 1) * pageSize)} of {total}{" "}
        companies
      </span>

      <div className="d-flex align-items-center gap-3">
        <div className="d-flex align-items-center gap-2">
          <span style={{ fontSize: 14 }}>Rows per page:</span>
          <Form.Select
            size="sm"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            style={{ width: "auto" }}
            data-testid="page-size-select"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Form.Select>
        </div>

        <BsPagination size="sm" className="mb-0">
          <BsPagination.Prev
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            data-testid="pagination-prev"
          />
          {pages.map((p) => (
            <BsPagination.Item
              key={p}
              active={p === page}
              onClick={() => onPageChange(p)}
            >
              {p}
            </BsPagination.Item>
          ))}
          <BsPagination.Next
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            data-testid="pagination-next"
          />
        </BsPagination>
      </div>
    </div>
  );
};

export default Pagination;
