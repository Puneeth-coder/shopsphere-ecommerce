import { Link } from "react-router-dom";
import "../styles/admin.css";

const AdminDashboardPage = () => {
  return (
    <div className="admin-container">
      <div className="admin-card" style={{ marginTop: "20px" }}>
        <h1 className="admin-title" style={{ marginBottom: "8px" }}>Admin Control Panel</h1>
        <p className="admin-subtitle" style={{ marginBottom: "24px" }}>Manage your store's items, stock levels, and client orders.</p>

        <h3 style={{ marginBottom: "16px", color: "var(--primary-color)" }}>
          Dashboard Shortcuts
        </h3>

        <div style={{ display: "flex", gap: "20px", marginTop: "12px" }}>
          <Link to="/admin/products" className="btn-primary" style={{ flex: 1, padding: "20px" }}>
            📦 Manage Products Catalogue
          </Link>

          <Link to="/admin/orders" className="btn-primary" style={{ flex: 1, padding: "20px", backgroundColor: "var(--primary-color)" }}>
            🛒 Manage Customer Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;