import { NavLink } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Grid1x2,
  Building,
  FileBarGraph,
} from "react-bootstrap-icons";

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: Grid1x2, testId: "nav-dashboard" },
  { path: "/companies", label: "Companies", icon: Building, testId: "nav-companies" },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className="sidebar"
      data-testid="sidebar"
      style={{
        width: collapsed
          ? "var(--sidebar-width-collapsed)"
          : "var(--sidebar-width-expanded)",
        transition: `width var(--sidebar-transition)`,
      }}
    >
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <FileBarGraph size={20} color="#fff" />
          </div>
          {!collapsed && <span className="sidebar-logo-text">FastReport</span>}
        </div>
        <button
          className="sidebar-toggle"
          onClick={onToggle}
          data-testid="sidebar-toggle"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? "active" : ""}`
            }
            data-testid={item.testId}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
