import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Container, Spinner } from "react-bootstrap";

import BulkActionsBar from "../components/companies/BulkActionsBar";
import CompaniesTable from "../components/companies/CompaniesTable";
import CompanyFormModal from "../components/companies/CompanyFormModal";
import ConfirmDeleteModal from "../components/common/ConfirmDeleteModal";
import Pagination from "../components/common/Pagination";
import { companyService } from "../services/companyService";
import type { Company, PaginatedResponse } from "../types/company";
import { handleError } from "../utils/format";

const CompaniesPage: React.FC = () => {
  const [data, setData] = useState<PaginatedResponse<Company> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modal state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCompany, setDeletingCompany] = useState<Company | null>(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await companyService.getAll(page, pageSize);
      setData(result);
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    if (!data) return;
    const allSelected = data.items.every((c) => selectedIds.has(c.id));
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(data.items.map((c) => c.id)));
    }
  };

  const handleCreateClick = () => {
    setEditingCompany(null);
    setShowFormModal(true);
  };

  const handleEditClick = (company: Company) => {
    setEditingCompany(company);
    setShowFormModal(true);
  };

  const handleDeleteClick = (company: Company) => {
    setDeletingCompany(company);
    setShowDeleteModal(true);
  };

  const handleBulkDeleteClick = () => {
    setShowBulkDeleteModal(true);
  };

  const handleFormSuccess = () => {
    setShowFormModal(false);
    setEditingCompany(null);
    fetchCompanies();
  };

  const handleDeleteConfirm = async () => {
    if (deletingCompany) {
      try {
        await companyService.delete(deletingCompany.id);
        setShowDeleteModal(false);
        setDeletingCompany(null);
        fetchCompanies();
      } catch (err) {
        setError(handleError(err));
      }
    }
  };

  const handleBulkDeleteConfirm = async () => {
    try {
      await companyService.bulkDelete({ ids: Array.from(selectedIds) });
      setShowBulkDeleteModal(false);
      setSelectedIds(new Set());
      fetchCompanies();
    } catch (err) {
      setError(handleError(err));
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setSelectedIds(new Set());
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
    setSelectedIds(new Set());
  };

  if (loading && !data) {
    return (
      <Container className="py-5 text-center" data-testid="loading-spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error && !data) {
    return (
      <Container className="py-5">
        <Alert variant="danger" data-testid="error-alert">
          {error}
        </Alert>
      </Container>
    );
  }

  const companies = data?.items ?? [];
  const isEmpty = companies.length === 0 && data?.total === 0;

  return (
    <Container fluid className="py-4 px-4">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Companies</h1>
          <p className="text-secondary-custom mb-0" style={{ fontSize: 14 }}>
            Manage your company directory
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleCreateClick}
          data-testid="create-company-btn"
        >
          New Company
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <BulkActionsBar
        selectedCount={selectedIds.size}
        onDelete={handleBulkDeleteClick}
      />

      {isEmpty ? (
        <div
          className="text-center py-5"
          data-testid="empty-state"
          style={{
            backgroundColor: "var(--color-input-bg)",
            borderRadius: "var(--radius)",
          }}
        >
          <h4 className="mb-2">No companies yet</h4>
          <p className="text-secondary-custom mb-3">
            Get started by creating your first company.
          </p>
          <Button variant="primary" onClick={handleCreateClick}>
            New Company
          </Button>
        </div>
      ) : (
        <>
          <CompaniesTable
            companies={companies}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
          {data && (
            <Pagination
              page={data.page}
              totalPages={data.total_pages}
              pageSize={data.page_size}
              total={data.total}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </>
      )}

      <CompanyFormModal
        show={showFormModal}
        company={editingCompany}
        onClose={() => setShowFormModal(false)}
        onSuccess={handleFormSuccess}
      />

      <ConfirmDeleteModal
        show={showDeleteModal}
        title="Delete Company"
        message={`Are you sure you want to delete "${deletingCompany?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteModal(false);
          setDeletingCompany(null);
        }}
      />

      <ConfirmDeleteModal
        show={showBulkDeleteModal}
        title="Delete Companies"
        message={`Are you sure you want to delete ${selectedIds.size} ${selectedIds.size === 1 ? "company" : "companies"}? This action cannot be undone.`}
        onConfirm={handleBulkDeleteConfirm}
        onCancel={() => setShowBulkDeleteModal(false)}
      />
    </Container>
  );
};

export default CompaniesPage;
