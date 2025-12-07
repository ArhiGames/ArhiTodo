import { Routes, Route, useLocation, BrowserRouter } from 'react-router-dom';
import HomePageComp from "./Components/Core/HomePageComp.tsx";
import ProjectViewComp from "./Components/Project/ProjectViewComp.tsx";
import NavbarHeaderComp from "./Components/Core/NavbarHeaderComp.tsx";
import LoginPage from "./Components/Authentication/LoginPage.tsx";
import { AuthProvider } from "./Contexts/AuthProvider.tsx";
import ProtectedRoute from "./Components/Authentication/ProtectedRoute.tsx";

function AppContent() {

    const location = useLocation();

    const hideNavbarOn = ["/login"];
    const hideNavbar = hideNavbarOn.includes(location.pathname);

    return (
        <div className="App">
            { !hideNavbar && <NavbarHeaderComp/> }
            <Routes>
                <Route path="/" element={<ProtectedRoute><HomePageComp/></ProtectedRoute>}/>
                <Route path="/login" element={<LoginPage/>}></Route>
                <Route path="/projects/:projectId/board/:boardId?" element={<ProtectedRoute><ProjectViewComp/></ProtectedRoute>}/>
            </Routes>
        </div>
    )

}

function App() {

    return (
        <BrowserRouter>
            <AuthProvider>
                <AppContent/>
            </AuthProvider>
        </BrowserRouter>
    )

}

export default App;