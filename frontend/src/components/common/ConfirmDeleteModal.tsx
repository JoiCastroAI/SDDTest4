import { Button, Modal } from "react-bootstrap";

type ConfirmDeleteModalProps = {
  show: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  show,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal show={show} onHide={onCancel} centered data-testid="confirm-delete-modal">
      <Modal.Header closeButton>
        <Modal.Title style={{ fontWeight: 600 }}>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={onCancel}
          data-testid="confirm-cancel-btn"
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          data-testid="confirm-delete-btn"
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDeleteModal;
