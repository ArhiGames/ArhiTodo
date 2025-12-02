import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePageComp from "./Components/Core/HomePageComp.tsx";
import ProjectViewComp from "./Components/Project/ProjectViewComp.tsx";
import NavbarHeaderComp from "./Components/Core/NavbarHeaderComp.tsx";

function App() {
  return (
      <Router>
          <div className="App">
              <NavbarHeaderComp/>
              <Routes>
                  <Route path="/" element={<HomePageComp/>}/>
                  <Route path="/projects/:projectId/board/:boardId?" element={<ProjectViewComp/>}/>
              </Routes>
          </div>
      </Router>
  )
}

export default App;