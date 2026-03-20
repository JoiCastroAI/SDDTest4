import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import CompaniesPage from "./pages/CompaniesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
