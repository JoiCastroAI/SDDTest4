import { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";

import { companyService } from "../../services/companyService";
import type { Company, CreateCompanyPayload } from "../../types/company";
import { handleError } from "../../utils/format";

type CompanyFormModalProps = {
  show: boolean;
  company: Company | null;
  onClose: () => void;
  onSuccess: () => void;
};

type FormData = {
  name: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  revenue: string;
  expenses: string;
  employees: string;
  clients: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  street: "",
  city: "",
  state: "",
  zip_code: "",
  country: "",
  revenue: "0",
  expenses: "0",
  employees: "0",
  clients: "0",
};

const CompanyFormModal: React.FC<CompanyFormModalProps> = ({
  show,
  company,
  onClose,
  onSuccess,
}) => {
  const isEdit = company !== null;
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (show) {
      if (company) {
        setFormData({
          name: company.name,
          street: company.street ?? "",
          city: company.city ?? "",
          state: company.state ?? "",
          zip_code: company.zip_code ?? "",
          country: company.country ?? "",
          revenue: String(company.revenue),
          expenses: String(company.expenses),
          employees: String(company.employees),
          clients: String(company.clients),
        });
      } else {
        setFormData(EMPTY_FORM);
      }
      setErrors({});
      setApiError(null);
    }
  }, [show, company]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Company name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateCompanyPayload = {
      name: formData.name.trim(),
      street: formData.street || null,
      city: formData.city || null,
      state: formData.state || null,
      zip_code: formData.zip_code || null,
      country: formData.country || null,
      revenue: Number(formData.revenue) || 0,
      expenses: Number(formData.expenses) || 0,
      employees: Number(formData.employees) || 0,
      clients: Number(formData.clients) || 0,
    };

    try {
      setSubmitting(true);
      setApiError(null);
      if (isEdit && company) {
        await companyService.update(company.id, payload);
      } else {
        await companyService.create(payload);
      }
      onSuccess();
    } catch (err) {
      setApiError(handleError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const computedProfit = (Number(formData.revenue) || 0) - (Number(formData.expenses) || 0);

  return (
    <Modal
      show={show}
      onHide={onClose}
      size="lg"
      centered
      className="company-modal"
      data-testid="company-form-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ fontWeight: 600 }}>
          {isEdit ? "Edit Company" : "New Company"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {apiError && (
            <Alert variant="danger" data-testid="form-error-alert">
              {apiError}
            </Alert>
          )}

          <h6 className="mb-3" style={{ fontWeight: 600 }}>
            Basic Information
          </h6>
          <Form.Group className="mb-3">
            <Form.Label>
              Name <span className="required">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
              data-testid="company-name-input"
              placeholder="Company name"
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <h6 className="mb-3 mt-4" style={{ fontWeight: 600 }}>
            Address
          </h6>
          <Form.Group className="mb-3">
            <Form.Label>Street</Form.Label>
            <Form.Control
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              data-testid="company-street-input"
              placeholder="Street address"
            />
          </Form.Group>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  data-testid="company-city-input"
                  placeholder="City"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  data-testid="company-state-input"
                  placeholder="State"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>ZIP Code</Form.Label>
                <Form.Control
                  type="text"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleChange}
                  data-testid="company-zipcode-input"
                  placeholder="ZIP Code"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  data-testid="company-country-input"
                  placeholder="Country"
                />
              </Form.Group>
            </Col>
          </Row>

          <h6 className="mb-3 mt-4" style={{ fontWeight: 600 }}>
            Financial Data
          </h6>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Revenue</Form.Label>
                <Form.Control
                  type="number"
                  name="revenue"
                  value={formData.revenue}
                  onChange={handleChange}
                  data-testid="company-revenue-input"
                  min="0"
                  step="0.01"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Expenses</Form.Label>
                <Form.Control
                  type="number"
                  name="expenses"
                  value={formData.expenses}
                  onChange={handleChange}
                  data-testid="company-expenses-input"
                  min="0"
                  step="0.01"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Profit</Form.Label>
                <Form.Control
                  type="text"
                  value={`$${computedProfit.toLocaleString()}`}
                  readOnly
                  disabled
                  data-testid="company-profit-display"
                  style={{
                    backgroundColor: "var(--color-profit-bg)",
                    color: "var(--color-primary)",
                    fontWeight: 600,
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          <h6 className="mb-3 mt-4" style={{ fontWeight: 600 }}>
            Other Data
          </h6>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Employees</Form.Label>
                <Form.Control
                  type="number"
                  name="employees"
                  value={formData.employees}
                  onChange={handleChange}
                  data-testid="company-employees-input"
                  min="0"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Clients</Form.Label>
                <Form.Control
                  type="number"
                  name="clients"
                  value={formData.clients}
                  onChange={handleChange}
                  data-testid="company-clients-input"
                  min="0"
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={onClose}
            disabled={submitting}
            data-testid="form-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={submitting}
            data-testid="form-submit-btn"
          >
            {submitting ? (
              <>
                <Spinner size="sm" className="me-1" />
                {isEdit ? "Saving..." : "Creating..."}
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Create Company"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CompanyFormModal;
