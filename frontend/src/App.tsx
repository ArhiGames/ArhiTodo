import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePageComp from "./HomePageComp.tsx";
import ProjectViewComp from "./ProjectViewComp.tsx";

function App() {
  return (
      <Router>
          <div className="App">
              <Routes>
                  <Route path="/" element={<HomePageComp/>}/>
                  <Route path="/projects/:projectId/board/:boardId?" element={<ProjectViewComp/>}/>
              </Routes>
          </div>
      </Router>
  )
}

export default App;