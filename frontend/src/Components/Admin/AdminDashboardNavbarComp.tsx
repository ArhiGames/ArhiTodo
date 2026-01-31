import { Link, Outlet } from "react-router-dom";
import "./AdminDashboard.css"

const AdminDashboardNavbarComp = () => {

    return (
        <div className="admin-dashboard-page">
            <nav className="settings-sidebar admin-dashboard-navbar">
                <Link to="/admin/dashboard/appsettings">App settings</Link>
                <Link to="/admin/dashboard/users">Manage users</Link>
                { /*<Link to="/admin/dashboard/usergroups">User groups</Link>*/ }
            </nav>

            <div className="admin-dashboard-detailed">
                <Outlet/>
            </div>
        </div>
    )

}

export default AdminDashboardNavbarComp;