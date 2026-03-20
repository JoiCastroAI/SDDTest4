import { Button } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";

type BulkActionsBarProps = {
  selectedCount: number;
  onDelete: () => void;
};

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onDelete,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div
      className="bulk-actions-bar d-flex align-items-center justify-content-between mb-3"
      data-testid="bulk-actions-bar"
    >
      <span style={{ fontSize: 14, fontWeight: 500 }}>
        {selectedCount} {selectedCount === 1 ? "company" : "companies"} selected
      </span>
      <Button
        variant="danger"
        size="sm"
        onClick={onDelete}
        data-testid="bulk-delete-btn"
        style={{ borderRadius: "var(--radius)" }}
      >
        <Trash className="me-1" />
        Delete
      </Button>
    </div>
  );
};

export default BulkActionsBar;
