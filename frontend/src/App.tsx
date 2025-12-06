import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import HomePageComp from "./Components/Core/HomePageComp.tsx";
import ProjectViewComp from "./Components/Project/ProjectViewComp.tsx";
import NavbarHeaderComp from "./Components/Core/NavbarHeaderComp.tsx";
import LoginPage from "./Components/Authentication/LoginPage.tsx";

function AppContent() {

    const location = useLocation();

    const hideNavbarOn = ["/login"];
    const hideNavbar = hideNavbarOn.includes(location.pathname);

    return (
        <div className="App">
            { !hideNavbar && <NavbarHeaderComp/> }
            <Routes>
                <Route path="/" element={<HomePageComp/>}/>
                <Route path="/login" element={<LoginPage/>}></Route>
                <Route path="/projects/:projectId/board/:boardId?" element={<ProjectViewComp/>}/>
            </Routes>
        </div>
    )

}

function App() {

    return (
        <Router>
            <AppContent/>
        </Router>
    )

}

export default App;