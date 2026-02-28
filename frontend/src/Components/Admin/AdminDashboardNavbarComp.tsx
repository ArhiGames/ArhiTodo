import {Link, Outlet, useMatch, useNavigate} from "react-router-dom";
import "./AdminDashboard.css"
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import {useEffect} from "react";

const AdminDashboardNavbarComp = () => {

    const { jwtPayload } = useAuth();
    const navigate = useNavigate();
    const isAdminDashboardHome = useMatch("/admin/dashboard");

    useEffect(() => {
        if (!isAdminDashboardHome) return;

        if (jwtPayload?.UpdateAppSettings === "True") {
            navigate("/admin/dashboard/appsettings");
        } else if (jwtPayload?.ManageUsers === "True" || jwtPayload?.InviteOtherUsers === "True") {
            navigate("/admin/dashboard/users");
        } else {
            navigate("/");
        }
    }, [isAdminDashboardHome, jwtPayload?.InviteOtherUsers, jwtPayload?.ManageUsers, jwtPayload?.UpdateAppSettings, navigate])

    return (
        <div className="admin-dashboard-page">
            <nav className="settings-sidebar admin-dashboard-navbar">
                { jwtPayload?.UpdateAppSettings === "True" && <Link to="/admin/dashboard/appsettings">App settings</Link> }
                { (jwtPayload?.ManageUsers === "True" || jwtPayload?.InviteOtherUsers === "True") && <Link to="/admin/dashboard/users">Manage users</Link> }
                { /*jwtPayload.ManageUsers === "True" && <Link to="/admin/dashboard/usergroups">User groups</Link>*/ }
            </nav>

            <div className="admin-dashboard-detailed">
                <Outlet/>
            </div>
        </div>
    )

}

export default AdminDashboardNavbarComp;