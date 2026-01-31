import { Routes, Route, useLocation, BrowserRouter } from 'react-router-dom';
import HomePageComp from "./Components/Core/HomePageComp.tsx";
import ProjectViewComp from "./Components/Project/ProjectViewComp.tsx";
import NavbarHeaderComp from "./Components/Core/NavbarHeaderComp.tsx";
import LoginPage from "./Components/Authentication/LoginPage.tsx";
import { AuthProvider } from "./Contexts/Authentication/AuthProvider.tsx";
import ProtectedRoute from "./Components/Authentication/ProtectedRoute.tsx";
import AccountPreferencesPageComp from "./Components/User/AccountSettingsPage/AccountPreferencesPageComp.tsx";
import AccountSettingsNavbarComp from "./Components/User/AccountSettingsPage/AccountSettingsNavbarComp.tsx";
import PasswordManagerPageComp from "./Components/User/AccountSettingsPage/PasswordManagerPageComp.tsx";
import AdminDashboardNavbarComp from "./Components/Admin/AdminDashboardNavbarComp.tsx";
import AdminAppSettingsComp from "./Components/Admin/AdminDashboardPages/AdminAppSettingsComp.tsx";
import AdminUserManagementComp from "./Components/Admin/AdminDashboardPages/UserManagement/User/AdminUserManagementComp.tsx";
import AdminUserGroupsSettingsComp from "./Components/Admin/AdminDashboardPages/AdminUserGroupsSettingsComp.tsx";
import RegisterPage from "./Components/Authentication/RegisterPage.tsx";
import KanbanProvider from "./Contexts/Kanban/KanbanProvider.tsx";
import HubProvider from "./Contexts/Realtime/HubProvider.tsx";

function AppContent() {

    const location = useLocation();

    const hideNavbar =
        location.pathname.startsWith("/login") ||
        location.pathname.startsWith("/register");

    return (
        <div className="App">
            { !hideNavbar && <NavbarHeaderComp/> }
            <Routes>
                <Route path="/" element={<ProtectedRoute><HomePageComp/></ProtectedRoute>}/>
                <Route path="login" element={<LoginPage/>}></Route>
                <Route path="register/:invitationKey" element={<RegisterPage/>}></Route>
                <Route path="projects/:projectId/board/:boardId?/" element={<ProtectedRoute><ProjectViewComp/></ProtectedRoute>}/>
                <Route path="projects/:projectId/board/:boardId?/card/:cardId?" element={<ProtectedRoute><ProjectViewComp/></ProtectedRoute>}/>
                <Route path="user">
                    <Route path="settings" element={<ProtectedRoute><AccountSettingsNavbarComp/></ProtectedRoute>}>
                        <Route index element={<ProtectedRoute><AccountPreferencesPageComp/></ProtectedRoute>}></Route>
                        <Route path="prefs" element={<ProtectedRoute><AccountPreferencesPageComp/></ProtectedRoute>}></Route>
                        <Route path="pswman" element={<ProtectedRoute><PasswordManagerPageComp/></ProtectedRoute>}></Route>
                    </Route>
                </Route>
                <Route path="admin">
                    <Route path="dashboard" element={<ProtectedRoute><AdminDashboardNavbarComp/></ProtectedRoute>}>
                        <Route index element={<ProtectedRoute><AdminAppSettingsComp/></ProtectedRoute>}></Route>
                        <Route path="appsettings" element={<ProtectedRoute><AdminAppSettingsComp/></ProtectedRoute>}></Route>
                        <Route path="users/:userId?" element={<ProtectedRoute><AdminUserManagementComp/></ProtectedRoute>}></Route>
                        <Route path="usergroups" element={<ProtectedRoute><AdminUserGroupsSettingsComp/></ProtectedRoute>}></Route>
                    </Route>
                </Route>
            </Routes>
        </div>
    )

}

function App() {

    return (
        <BrowserRouter>
            <KanbanProvider>
                <AuthProvider>
                    <HubProvider>
                        <AppContent/>
                    </HubProvider>
                </AuthProvider>
            </KanbanProvider>
        </BrowserRouter>
    )

}

export default App;