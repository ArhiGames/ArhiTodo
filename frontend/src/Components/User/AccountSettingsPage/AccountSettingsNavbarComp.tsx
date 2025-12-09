import { Link, Outlet } from "react-router-dom";

const AccountSettingsNavbarComp = () => {

    return (
        <div className="account-settings-page">
            <nav className="account-settings-navbar">
                <Link to="/user/settings/prefs">Preferences</Link>
                <Link to="/user/settings/account">Account</Link>
                <Link to="/user/settings/pswman">Password manager</Link>
            </nav>

            <div className="detailed-settings-panel">
                <Outlet/>
            </div>
        </div>
    )

}

export default AccountSettingsNavbarComp;